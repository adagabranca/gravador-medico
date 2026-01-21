# 🎯 GUIA DE IMPLEMENTAÇÃO - ABA CLIENTES (Mini-CRM)

## ✅ O QUE FOI IMPLEMENTADO

### 1. **Backend SQL (Database Layer)**

Foram criadas as seguintes estruturas no arquivo `database/REPAIR-AND-OPTIMIZE.sql`:

#### **View: `customer_intelligence`**
- Cálculo automático de **LTV (Lifetime Value)** por cliente
- **Segmentação RFM Simplificada**:
  - 👑 **VIP**: LTV > R$ 500 + 2+ compras
  - 🔥 **New**: Primeira compra < 7 dias
  - 💤 **Dormant**: Sem compras há > 90 dias
  - ⚠️ **Churn Risk**: Comprava regularmente e parou (> 60 dias)
  - **Regular**: Todos os outros

- **Métricas Calculadas**:
  - `total_orders`: Total de pedidos
  - `paid_orders`: Pedidos pagos
  - `ltv`: Soma total gasta (apenas pedidos paid/approved)
  - `aov`: Ticket médio (Average Order Value)
  - `days_since_last_purchase`: Dias desde última compra
  - `engagement_score`: Score 0-100 baseado em atividade
  - `acquisition_source`: UTM de origem (primeira compra)

#### **Tabela: `customer_notes`**
- Sistema de notas internas para equipe CRM
- Campos: `customer_email`, `note`, `created_by_email`, `is_important`
- RLS habilitado (apenas autenticados podem ler/escrever)

#### **Função SQL: `get_customer_stats()`**
- Retorna estatísticas agregadas:
  - Total de clientes
  - Quantidade de VIPs
  - Quantidade de Dormants
  - LTV total
  - LTV médio

---

### 2. **API Routes**

#### **`/api/admin/customers` (GET)**
Parâmetros suportados:
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 20)
- `search`: Busca full-text (nome ou email)
- `segment`: Filtro por segmento (VIP, New, Dormant, etc)
- `sortBy`: Campo de ordenação (padrão: ltv)
- `sortOrder`: Direção (asc/desc)

Retorna:
```json
{
  "customers": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  },
  "stats": {
    "total_customers": 150,
    "vip_count": 12,
    "dormant_count": 23,
    "total_ltv": 45000,
    "avg_ltv": 300
  }
}
```

#### **`/api/admin/customers` (POST)**
Busca detalhes de um cliente específico por email:
```json
{
  "email": "cliente@example.com"
}
```

Retorna:
```json
{
  "customer": {...},
  "sales": [...],
  "notes": [...],
  "lastVisit": {...}
}
```

#### **`/api/admin/customer-notes` (POST)**
Cria nova nota interna:
```json
{
  "customer_email": "cliente@example.com",
  "note": "Cliente pediu desconto na renovação",
  "created_by_email": "admin@example.com",
  "is_important": false
}
```

---

### 3. **Frontend - Página `/admin/customers`**

#### **Componentes Principais**

**CustomerAvatar**
- Avatar colorido com iniciais do cliente
- Cor gerada automaticamente por hash do email (consistente)

**SegmentBadge**
- Badges vibrantes para cada segmento:
  - 👑 VIP: Gradient dourado
  - 🔥 Novo: Gradient verde
  - 💤 Ausente: Gradient cinza
  - ⚠️ Churn: Gradient laranja-vermelho
  - Regular: Gradient azul

**Data Grid Features**
- ✅ Paginação (20 por página)
- ✅ Busca com debounce (500ms)
- ✅ Filtros por segmento
- ✅ Ordenação por LTV (padrão)
- ✅ Skeleton loading
- ✅ Hover states
- ✅ Click na linha abre drawer

**Stats Cards (Topo)**
1. Total de Clientes
2. Quantidade de VIPs
3. LTV Total (soma de todos)
4. LTV Médio

---

### 4. **Customer Drawer (Visão 360°)**

Painel lateral direito que abre ao clicar no cliente:

#### **Header**
- Avatar grande
- Nome e email
- Botões de ação rápida:
  - 📱 WhatsApp (abre `wa.me/55{phone}`)
  - 📧 Email (abre `mailto:`)

#### **Métricas Destacadas**
- **Lifetime Value**: Card com valor total + ticket médio
- **Engagement Score**: Score visual em círculo (0-100)

#### **Info Cards**
- Primeira compra (data formatada)
- Última compra (data formatada)
- Telefone (se disponível)

#### **Timeline de Compras**
- Lista das últimas 10 vendas
- Status colorido (Pago/Pendente/Falhou/Estornado)
- Produto, data, método de pagamento, valor

#### **Notas Internas**
- Campo de texto para adicionar notas
- Lista de notas existentes com autor e data
- Salvamento assíncrono via API

---

## 📋 PASSOS PARA ATIVAR

### 1. **Executar SQL no Supabase**

```bash
# Copie TODO o conteúdo de database/REPAIR-AND-OPTIMIZE.sql
# Cole no Supabase SQL Editor
# Execute de uma vez
```

### 2. **Verificar Instalação de Dependências**

```bash
npm install clsx --save
```

### 3. **Iniciar Servidor**

```bash
npm run dev
```

### 4. **Acessar Aba de Clientes**

```
http://localhost:3000/admin/customers
```

---

## 🎨 DIFERENCIAIS IMPLEMENTADOS

### **1. Inteligência de Dados**
- ✅ Segmentação automática (não manual)
- ✅ LTV calculado no banco (não no JS)
- ✅ Engagement score proprietário
- ✅ Identificação de Churn Risk

### **2. UX de Classe Mundial**
- ✅ Avatares coloridos consistentes
- ✅ Badges vibrantes com gradientes
- ✅ Busca com debounce (performance)
- ✅ Drawer lateral fluido
- ✅ Loading states profissionais

### **3. Funcionalidades CRM**
- ✅ Notas internas (histórico de interações)
- ✅ Ações rápidas (WhatsApp/Email)
- ✅ Timeline unificada
- ✅ Filtros facetados

### **4. Performance**
- ✅ Índices otimizados
- ✅ Paginação server-side
- ✅ Cache de 30s na API
- ✅ Queries agregadas no banco

---

## 🚀 PRÓXIMOS PASSOS SUGERIDOS

### **1. Integrações Externas**
- [ ] Sincronizar notas com CRM externo (Pipedrive/RD Station)
- [ ] Disparar email automático para Dormants
- [ ] Enviar WhatsApp automático via API oficial

### **2. Analytics Avançado**
- [ ] Integrar `analytics_visits` no drawer (última visita ao site)
- [ ] Mostrar produtos mais comprados por cliente
- [ ] Gráfico de evolução do LTV ao longo do tempo

### **3. Automações**
- [ ] Tag automática "VIP" quando LTV > R$ 1000
- [ ] Alerta no Slack quando VIP entra em Churn Risk
- [ ] Campanha de recuperação automática para Dormants

---

## 🎯 MÉTRICAS DE SUCESSO

Você saberá que está funcionando quando:

1. **Dashboard carrega em < 1s** (graças aos índices)
2. **Busca é instantânea** (graças ao debounce)
3. **Você identifica VIPs imediatamente** (badges chamativos)
4. **Equipe usa notas internas diariamente** (contexto compartilhado)
5. **Taxa de churn diminui** (ação proativa com Churn Risk)

---

## 🐛 TROUBLESHOOTING

### **Problema: View `customer_intelligence` está vazia**
**Solução**: Verifique se a tabela `sales` tem dados com status `paid` ou `approved`.

### **Problema: Erros de TypeScript**
**Solução**: Execute `npm install` para garantir que `clsx` está instalado.

### **Problema: Estatísticas não carregam**
**Solução**: Verifique se a função `get_customer_stats()` foi criada no Supabase.

### **Problema: Drawer não abre**
**Solução**: Verifique console do browser. A API `/api/admin/customers` (POST) deve retornar 200.

---

## ✅ CHECKLIST DE VALIDAÇÃO

- [ ] SQL executado no Supabase sem erros
- [ ] View `customer_intelligence` criada
- [ ] Tabela `customer_notes` criada
- [ ] Função `get_customer_stats()` criada
- [ ] Índices criados
- [ ] Página `/admin/customers` acessível
- [ ] Stats cards mostram números reais
- [ ] Busca funciona
- [ ] Filtros por segmento funcionam
- [ ] Click na linha abre drawer
- [ ] Drawer mostra histórico de compras
- [ ] Botão WhatsApp abre wa.me
- [ ] Notas internas salvam corretamente

---

## 🏆 RESULTADO FINAL

Você agora tem um **Mini-CRM de Alta Performance** que:

1. **Responde perguntas imediatamente**:
   - Quem são meus VIPs?
   - Quem está em risco de churn?
   - Quanto cada cliente já gastou?

2. **Automatiza decisões**:
   - Segmentação automática (sem planilhas)
   - Scores calculados em tempo real
   - Alertas visuais (cores dos badges)

3. **Melhora comunicação da equipe**:
   - Notas internas compartilhadas
   - Histórico completo em um lugar
   - Ações rápidas (WhatsApp/Email)

**Este é o padrão Stripe/Yampi.** 🚀
