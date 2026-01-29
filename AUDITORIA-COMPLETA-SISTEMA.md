# 🔍 AUDITORIA COMPLETA - STACK, PAGAMENTOS E ENTREGA DIGITAL

**Data**: 29 de Janeiro de 2026  
**Autor**: Auditoria Técnica Automatizada  
**Versão**: 1.0

---

## 📋 SUMÁRIO EXECUTIVO

Este documento apresenta uma análise profunda do sistema de vendas do Gravador Médico, identificando causas-raiz de problemas recorrentes, mapeando fluxos reais e apontando fragilidades estruturais.

### ⚠️ Problemas Críticos Identificados

| # | Problema | Causa-Raiz | Impacto |
|---|----------|------------|---------|
| 1 | Vendas duplicadas no dashboard | Fallback AppMax era sempre acionado | Alto |
| 2 | Clientes sem acesso após pagamento | Provisioning não era chamado em webhooks | Crítico |
| 3 | Necessidade de importação manual | Webhooks não atualizavam dados corretamente | Alto |
| 4 | Emails não enviados | Fila de provisionamento não era processada | Crítico |
| 5 | Sincronização gerando duplicatas | Falta de UNIQUE constraint + upsert mal configurado | Médio |

---

## 1️⃣ FLUXO DE COMPRA E PAGAMENTO

### 1.1 Mapa do Fluxo Atual (Passo a Passo)

```
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND: /checkout/page.tsx                                   │
│  Cliente preenche dados e clica "Comprar"                       │
│  → Gera idempotencyKey (UUID)                                   │
│  → Envia POST para /api/checkout/enterprise                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND: /api/checkout/enterprise/route.ts                     │
│                                                                 │
│  1. Valida dados obrigatórios (customer, amount, idempotencyKey)│
│  2. Verifica idempotência (busca por idempotency_key em sales)  │
│  3. Cria pedido na tabela SALES (status: processing)            │
│  4. TENTATIVA 1: Mercado Pago (se payment_method=credit_card    │
│                                E existe mpToken)                │
│  5. TENTATIVA 2: AppMax (APENAS se MP falhou elegível           │
│                  OU não tinha mpToken - CORRIGIDO RECENTEMENTE) │
│  6. Insere em provisioning_queue                                │
│  7. Chama processProvisioningQueue() (fire-and-forget)          │
│  8. Retorna resposta ao cliente                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (se cartão aprovado)
┌─────────────────────────────────────────────────────────────────┐
│  PROVISIONING WORKER: /lib/provisioning-worker.ts               │
│                                                                 │
│  1. Busca itens pendentes na provisioning_queue                 │
│  2. Atualiza sales: paid → provisioning                         │
│  3. Cria usuário no Lovable (Edge Function)                     │
│  4. Envia email com credenciais (Resend API)                    │
│  5. Atualiza sales: provisioning → active                       │
│  6. Marca queue como completed                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (para PIX, aguarda webhook)
┌─────────────────────────────────────────────────────────────────┐
│  WEBHOOK MERCADO PAGO: /api/webhooks/mercadopago-enterprise     │
│                                                                 │
│  1. Recebe notificação do MP                                    │
│  2. Salva log em webhooks_logs                                  │
│  3. Busca detalhes do pagamento na API do MP                    │
│  4. Atualiza sales para status 'paid'                           │
│  5. Adiciona em provisioning_queue                              │
│  ⚠️ NÃO CHAMA processProvisioningQueue()                       │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Entidades Envolvidas

| Tabela | Propósito | Campos-Chave |
|--------|-----------|--------------|
| `sales` | Registro de vendas | id, customer_email, order_status, payment_gateway, mercadopago_payment_id, appmax_order_id, idempotency_key |
| `orders` | Legado (parcialmente usado) | id, status, mercadopago_payment_id |
| `provisioning_queue` | Fila de entrega | sale_id, status, retry_count, last_error |
| `payment_attempts` | Histórico de tentativas | sale_id, provider, status, rejection_code |
| `checkout_logs` | Debug de erros | order_id, gateway, status, error_message |
| `webhook_logs` / `webhooks_logs` | Logs de webhooks | gateway, event_type, payload, status |
| `integration_logs` | Logs de integração | order_id, action, status, recipient_email |

### 1.3 Gateways de Pagamento

#### Mercado Pago (Primary)
- **Arquivo**: Inline em `/api/checkout/enterprise/route.ts`
- **API**: `https://api.mercadopago.com/v1/payments`
- **Métodos**: Cartão de Crédito, PIX
- **Webhook**: `/api/webhooks/mercadopago-enterprise`

#### AppMax (Fallback)
- **Arquivo**: `/lib/appmax.ts`
- **API**: `https://admin.appmax.com.br/api/v3`
- **Métodos**: Cartão de Crédito, PIX
- **Webhook**: `/api/webhook/appmax`

### 1.4 Respostas às Perguntas Críticas

> **O webhook é tratado como fonte da verdade?**

**PARCIALMENTE.** O webhook atualiza o status da venda, mas:
- Para pagamentos instantâneos (cartão aprovado), o checkout já marca como `paid`
- Para PIX, o webhook é a única fonte que confirma o pagamento
- ⚠️ **PROBLEMA**: O webhook não dispara `processProvisioningQueue()`, causando falha na entrega

> **Existe polling / reconciliação ativa?**

**NÃO.** O sistema depende 100% de webhooks para PIX. Não há:
- Polling para verificar status de pagamentos pendentes
- Job de reconciliação para pagamentos perdidos
- Cronjob para reprocessar webhooks falhos

> **O sistema depende de ações manuais?**

**SIM, INFELIZMENTE.** Cenários que exigem intervenção:
1. Webhook falha → Pagamento não é refletido → Necessário sync manual
2. Provisioning falha → Usuário não criado → Necessário processar fila manualmente
3. Sync AppMax → Importa duplicatas ou pendentes → Necessário filtrar

---

## 2️⃣ SINCRONIZAÇÃO E ATUALIZAÇÃO DE DADOS

### 2.1 Endpoints de Sincronização

| Endpoint | Arquivo | Ação |
|----------|---------|------|
| `POST /api/admin/sync-appmax` | `app/api/admin/sync-appmax/route.ts` | Importa pedidos da API AppMax |

### 2.2 O que faz o Sync-AppMax?

```typescript
// Fluxo resumido de /api/admin/sync-appmax
1. fetchAppmaxOrders(days) 
   → Busca todos os pedidos paginados da API AppMax
   → Filtra apenas pedidos PAGOS (correção recente)
   → Filtra por data (últimos X dias)

2. Para cada pedido:
   → Extrai dados do cliente (nome, email, telefone)
   → Extrai dados do pagamento (método, valor, status)
   → UPSERT em customers (onConflict: email)
   → UPSERT em sales (onConflict: appmax_order_id)
```

### 2.3 Problemas de Sincronização

| Problema | Causa | Status |
|----------|-------|--------|
| Importava pendentes | Não filtrava por status | ✅ CORRIGIDO |
| Duplicava registros | Falta de UNIQUE constraints | ⚠️ PARCIAL |
| Sobrescrevia dados | UPSERT sem validar diferenças | ⚠️ RISCO |

### 2.4 Resposta às Perguntas

> **Eles fazem INSERT, UPDATE ou UPSERT?**

**UPSERT** usando `onConflict`:
- `customers`: conflict em `email`
- `sales`: conflict em `appmax_order_id`

> **Podem rodar em paralelo?**

**SIM, sem proteção.** Não há:
- Lock de execução
- Mutex ou semáforo
- Validação de execução duplicada

> **Existe lock ou proteção contra concorrência?**

**NÃO.** Se dois usuários clicarem "Sincronizar" simultaneamente, podem ocorrer race conditions.

> **Por que o sistema não reflete automaticamente uma compra paga?**

**PORQUE O WEBHOOK NÃO PROCESSA A FILA.** O webhook apenas:
1. Atualiza o status para `paid`
2. Insere na `provisioning_queue`
3. **NÃO** chama `processProvisioningQueue()`

Sem processar a fila, o usuário não é criado e o email não é enviado.

---

## 3️⃣ DUPLICAÇÃO DE REGISTROS

### 3.1 Entidades Afetadas

| Entidade | Tipo de Duplicação | Causa |
|----------|-------------------|-------|
| `sales` | MP + AppMax para mesma compra | Fallback sempre acionado |
| `customers` | Múltiplas entradas para mesmo email | UPSERT mal configurado |
| `payment_attempts` | Múltiplas tentativas registradas | Esperado (histórico) |

### 3.2 Análise de Constraints

```sql
-- Verificar constraints existentes
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'sales';
```

**Constraints esperadas (e provavelmente ausentes):**
- `UNIQUE(idempotency_key)` - Protege contra clique duplo
- `UNIQUE(mercadopago_payment_id)` - Evita duplicata por MP
- `UNIQUE(appmax_order_id)` - Evita duplicata por AppMax
- `UNIQUE(customer_email, created_at::date)` - Opcional para mesma compra no dia

### 3.3 Causa-Raiz da Duplicação de Vendas

**PROBLEMA IDENTIFICADO E CORRIGIDO:**

```typescript
// ANTES (causava duplicata):
if (appmax_data) {  // ← SEMPRE true porque checkout sempre envia
  // Cria pedido no AppMax mesmo se MP já aprovou
}

// DEPOIS (corrigido):
let shouldTryAppmax = false
let mpTriedAndFailed = false

// Só marca shouldTryAppmax = true se MP realmente falhou
if (mpResult.status !== 'approved') {
  if (MP_ERRORS_SHOULD_RETRY.includes(statusDetail)) {
    shouldTryAppmax = true
    mpTriedAndFailed = true
  }
}

// Só usa AppMax se flag ativa
if (shouldTryAppmax || !mpToken) {
  // Agora sim, chama AppMax
}
```

### 3.4 Resposta às Perguntas

> **Qual é a causa raiz da duplicação?**

**Backend.** O checkout sempre enviava `appmax_data` e a condição `if (appmax_data)` era sempre true, fazendo o sistema tentar AppMax mesmo quando MP já havia aprovado.

> **É backend, frontend, concorrência ou tudo junto?**

Majoritariamente **backend** (lógica de fallback incorreta), mas também:
- **Frontend**: Enviava ambos os dados sempre
- **Sync**: Importava pendentes além de pagos

---

## 4️⃣ ENTREGA DO PRODUTO (LOVABLE / ACESSO / E-MAIL)

### 4.1 Fluxo de Provisionamento

```
provisioning_queue (status: pending)
        │
        ▼
processProvisioningQueue()  ← Chamado via:
        │                      - Checkout (✅ CORRIGIDO)
        │                      - Cron (limitado - Hobby)
        │                      - Admin manual
        │                      - Webhook (❌ NÃO CHAMA)
        ▼
┌────────────────────────────────────────────┐
│ 1. Busca sales.id pelo sale_id da fila    │
│ 2. Valida status = paid/approved          │
│ 3. Atualiza status → provisioning         │
│ 4. createLovableUser(email, senha)        │
│    → POST Edge Function Supabase          │
│ 5. sendWelcomeEmail(credenciais)          │
│    → POST Resend API                      │
│ 6. Atualiza status → active               │
│ 7. Marca queue → completed                │
└────────────────────────────────────────────┘
```

### 4.2 Serviços de Entrega

| Serviço | Arquivo | Função |
|---------|---------|--------|
| Lovable (usuário) | `/services/lovable-integration.ts` | `createLovableUser()` |
| Email (credenciais) | `/lib/email.ts` | `sendWelcomeEmail()` |

### 4.3 Pontos de Falha

| Etapa | O que pode falhar | Retry? | Log? |
|-------|-------------------|--------|------|
| 1. Buscar sale | Sale não existe | Não | Sim |
| 2. Validar status | Status != paid | Pula | Sim |
| 3. Criar usuário | Edge Function indisponível | Sim (3x) | Sim |
| 4. Enviar email | Resend API falha | Sim (3x) | Sim |

### 4.4 Resposta às Perguntas

> **Por que clientes com pagamento confirmado não recebem acesso?**

**PORQUE O WEBHOOK NÃO PROCESSA A FILA.**

O webhook do Mercado Pago (para PIX especialmente):
1. Atualiza a venda para `paid` ✅
2. Insere na `provisioning_queue` ✅
3. **NÃO chama** `processProvisioningQueue()` ❌

Resultado: A fila fica parada até:
- Próximo cronjob (limitado no Hobby)
- Outra compra processe a fila
- Ação manual do admin

> **Existe retry?**

**SIM.** O `provisioning-worker.ts` implementa:
- Máximo 3 tentativas
- Exponential backoff (5min, 10min, 20min)
- Status `failed` após esgotar tentativas

> **O sistema consegue "reentregar" sem refazer a venda?**

**SIM.** É possível:
1. Resetar status na `provisioning_queue` para `pending`
2. Chamar endpoint `/api/admin/process-provisioning`
3. Ou acessar `/api/fix/process-queue` (temporário)

---

## 5️⃣ ARQUITETURA GERAL

### 5.1 Stack Tecnológico

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| Frontend | Next.js (App Router) | 14.x |
| Backend | Next.js API Routes | 14.x |
| Database | Supabase (PostgreSQL) | - |
| Auth | Supabase Auth | - |
| Email | Resend | - |
| Payments | Mercado Pago + AppMax | - |
| Hosting | Vercel (Hobby) | - |
| User Management | Lovable Edge Function | - |

### 5.2 Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                    │
│  /checkout/page.tsx    /admin/dashboard    /obrigado/page.tsx           │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          API ROUTES (Next.js)                            │
│                                                                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────────┐     │
│  │ /checkout/       │  │ /webhooks/       │  │ /admin/            │     │
│  │   enterprise     │  │   mercadopago-   │  │   sync-appmax      │     │
│  │   cascade        │  │   enterprise     │  │   process-         │     │
│  │   route          │  │   appmax         │  │   provisioning     │     │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬───────────┘     │
│           │                     │                     │                  │
└───────────┼─────────────────────┼─────────────────────┼──────────────────┘
            │                     │                     │
            ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            LIB (Serviços)                                │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  ┌─────────────┐ │
│  │ mercadopago  │  │ appmax.ts    │  │ provisioning- │  │ email.ts    │ │
│  │ -webhook-    │  │              │  │ worker.ts     │  │             │ │
│  │ enterprise   │  │              │  │               │  │             │ │
│  └──────────────┘  └──────────────┘  └───────────────┘  └─────────────┘ │
│                                                                          │
└──────────────────────────────────┬───────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SERVICES                                │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Supabase     │  │ Mercado Pago │  │ AppMax       │  │ Resend       │ │
│  │ (PostgreSQL) │  │ (Payments)   │  │ (Payments)   │  │ (Email)      │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ Lovable Edge Function (User Creation)                            │   │
│  │ https://acouwzdniytqhaesgtpr.supabase.co/functions/v1/...        │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Nível de Acoplamento

| Relação | Nível | Problema |
|---------|-------|----------|
| Checkout → DB | Alto | Lógica complexa inline |
| Webhook → Provisioning | Fraco | Não chama processamento |
| Sync → DB | Médio | UPSERT pode sobrescrever |
| Provisioning → Lovable | Médio | Dependência externa |

### 5.4 Resposta às Perguntas

> **O sistema é orientado a eventos ou a chamadas diretas?**

**HÍBRIDO MAL IMPLEMENTADO.**

- **Eventos**: Webhooks recebem notificações assíncronas
- **Chamadas diretas**: Checkout processa tudo inline
- **Problema**: Os eventos não disparam as ações necessárias (fila não é processada)

> **Existe separação clara entre pagamento, estado do pedido e entrega?**

**PARCIALMENTE.**

| Concern | Arquivo(s) | Separação |
|---------|------------|-----------|
| Pagamento | checkout/enterprise, lib/appmax, lib/mercadopago | ⚠️ Misturado |
| Estado | sales, orders, provisioning_queue | ✅ Tabelas separadas |
| Entrega | provisioning-worker, email, lovable-integration | ✅ Separado |

O **problema** é que o checkout faz muitas coisas:
- Valida dados
- Processa pagamento
- Cria registro
- Insere na fila
- Dispara provisioning

> **Onde estão os maiores riscos de falha em cascata?**

1. **Provisioning não processado** → Usuário não criado → Email não enviado
2. **Webhook falha** → Pagamento não confirmado → Fila não alimentada
3. **Lovable indisponível** → Usuário não criado → Retry até esgotar
4. **Resend indisponível** → Email não enviado → Usuário sem credenciais

---

## 📊 LISTA DE FALHAS ESTRUTURAIS

### Severidade Crítica 🔴

1. **Webhook não processa fila de provisioning**
   - Arquivo: `/api/webhooks/mercadopago-enterprise/route.ts`
   - Impacto: Clientes com PIX pago não recebem acesso
   - Status: ⚠️ NÃO CORRIGIDO

2. **Ausência de job de reconciliação**
   - Não há polling para verificar pagamentos perdidos
   - Não há reprocessamento automático de webhooks falhos
   - Status: ⚠️ NÃO EXISTE

### Severidade Alta 🟠

3. **Duplicatas por fallback incorreto** (CORRIGIDO)
   - Arquivo: `/api/checkout/enterprise/route.ts`
   - Causa: `shouldTryAppmax` flag não existia
   - Status: ✅ CORRIGIDO

4. **Sync importava pendentes** (CORRIGIDO)
   - Arquivo: `/api/admin/sync-appmax/route.ts`
   - Causa: Não filtrava por status
   - Status: ✅ CORRIGIDO

### Severidade Média 🟡

5. **Duas tabelas para vendas (sales vs orders)**
   - Gera confusão e dados inconsistentes
   - Recomendação: Migrar tudo para `sales`

6. **UNIQUE constraints ausentes**
   - `idempotency_key` deveria ser único
   - `mercadopago_payment_id` deveria ser único

7. **Logs espalhados em múltiplas tabelas**
   - `checkout_logs`, `webhook_logs`, `webhooks_logs`, `integration_logs`
   - Dificulta debug e auditoria

---

## 🎯 CAUSAS-RAIZ (NÃO SINTOMAS)

| ID | Causa-Raiz | Consequências |
|----|------------|---------------|
| CR1 | Webhook não chama `processProvisioningQueue()` | PIX pago não entrega produto |
| CR2 | Fallback AppMax era sempre acionado | Vendas duplicadas no dashboard |
| CR3 | Sync não filtrava status | Pendentes apareciam como vendas |
| CR4 | Vercel Hobby limita cronjobs | Fila não processa automaticamente |
| CR5 | Falta de UNIQUE constraints | Registros duplicados possíveis |

---

## 🛠️ CORREÇÕES IMPLEMENTADAS (NESTA SESSÃO)

| # | Correção | Arquivo | Status |
|---|----------|---------|--------|
| 1 | Flag `shouldTryAppmax` | checkout/enterprise/route.ts | ✅ Deploy |
| 2 | Filtro só pagos no sync | admin/sync-appmax/route.ts | ✅ Deploy |
| 3 | Timezone São Paulo | lib/timezone.ts | ✅ Deploy |
| 4 | Processar fila após checkout | checkout/enterprise/route.ts | ✅ Deploy |

---

## ⚡ CORREÇÕES PENDENTES (RECOMENDADAS)

### Prioridade 1 - Crítico

1. **Adicionar `processProvisioningQueue()` nos webhooks**
   ```typescript
   // Em /api/webhooks/mercadopago-enterprise/route.ts
   // Após inserir na fila:
   processProvisioningQueue()
     .then(r => console.log('Provisioning:', r))
     .catch(e => console.error('Erro:', e))
   ```

2. **Criar job de reconciliação**
   - Cronjob que verifica pagamentos pendentes há mais de 1h
   - Busca status na API do MP/AppMax
   - Atualiza e processa fila

### Prioridade 2 - Alta

3. **Adicionar UNIQUE constraints**
   ```sql
   ALTER TABLE sales ADD CONSTRAINT unique_idempotency UNIQUE (idempotency_key);
   ALTER TABLE sales ADD CONSTRAINT unique_mp_payment UNIQUE (mercadopago_payment_id);
   ALTER TABLE sales ADD CONSTRAINT unique_appmax_order UNIQUE (appmax_order_id);
   ```

4. **Migrar de `orders` para `sales`**
   - Consolidar em uma única tabela
   - Remover código legado

### Prioridade 3 - Média

5. **Consolidar tabelas de log**
   - Unificar `webhook_logs` e `webhooks_logs`
   - Padronizar estrutura

6. **Implementar health check**
   - Endpoint que verifica conectividade com:
     - Supabase
     - Mercado Pago
     - AppMax
     - Resend
     - Lovable

---

## 📈 CONCLUSÃO

O sistema apresenta uma arquitetura funcional, mas com **decisões incrementais** que criaram dívida técnica significativa. Os principais problemas não são de código, mas de **orquestração e eventos**:

1. O checkout síncrono funciona bem
2. Os webhooks assíncronos **não completam o ciclo**
3. A dependência de cronjobs no Hobby é **insustentável**

A solução definitiva envolve:
- Garantir que **todo evento de pagamento confirmado** dispare o provisioning
- Implementar **reconciliação** para casos edge
- Adicionar **constraints** para evitar duplicatas na origem

---

**Documento gerado em**: 29/01/2026  
**Próxima revisão recomendada**: Após implementação das correções P1
