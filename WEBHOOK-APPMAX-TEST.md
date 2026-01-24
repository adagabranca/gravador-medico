# 🔔 Teste de Webhooks Appmax

## ✅ Configuração Atual

### Variáveis de Ambiente
```env
APPMAX_API_URL=https://admin.appmax.com.br/api/v3
APPMAX_API_TOKEN=B6C99C65-4FAE30A5-BB3DFD79-CCEDE0B7
APPMAX_PRODUCT_ID=32991339
APPMAX_WEBHOOK_URL=https://www.gravadormedico.com.br/api/webhook/appmax
```

**⚠️ IMPORTANTE:** `APPMAX_WEBHOOK_SECRET` NÃO está configurado!
- O webhook está funcionando SEM validação de assinatura
- Para produção, você deve configurar isso na Appmax e adicionar ao `.env.local`

---

## 📡 Endpoint do Webhook

**URL:** `https://www.gravadormedico.com.br/api/webhooks/appmax`

### Eventos Recebidos

O webhook da Appmax está configurado para receber e processar:

#### ✅ Eventos de Pagamento
- `order.approved` - Pedido aprovado
- `order.paid` - Pedido pago
- `pix.paid` - PIX pago
- `pix.generated` - PIX gerado
- `order.pending` - Pedido pendente

#### ❌ Eventos de Falha
- `order.rejected` - Pedido recusado
- `order.cancelled` - Pedido cancelado
- `pix.expired` - PIX expirado
- `order.refunded` - Estornado

---

## 🔍 Como Verificar se Está Funcionando

### 1. Verificar Logs de Webhooks no Supabase

```sql
-- Ver últimos webhooks recebidos
SELECT 
  id,
  event_type,
  created_at,
  success,
  error_message,
  payload->>'order_id' as order_id,
  payload->>'status' as status
FROM webhooks_logs
WHERE source = 'appmax'
ORDER BY created_at DESC
LIMIT 20;
```

### 2. Verificar Tentativas de Checkout Atualizadas

```sql
-- Ver checkouts atualizados por webhook
SELECT 
  id,
  customer_email,
  status,
  recovery_status,
  total_amount,
  appmax_order_id,
  converted_at,
  created_at,
  updated_at
FROM checkout_attempts
WHERE appmax_order_id IS NOT NULL
ORDER BY updated_at DESC
LIMIT 20;
```

### 3. Verificar Vendas Criadas

```sql
-- Ver vendas criadas via webhook
SELECT 
  id,
  appmax_order_id,
  customer_email,
  status,
  total_amount,
  payment_method,
  paid_at,
  created_at
FROM sales
WHERE appmax_order_id IS NOT NULL
ORDER BY created_at DESC
LIMIT 20;
```

---

## 🧪 Testar Webhook Manualmente

### Usando cURL (Local - Deve falhar pois não tem internet)

```bash
curl -X POST http://localhost:3000/api/webhooks/appmax \
  -H "Content-Type: application/json" \
  -d '{
    "event": "order.paid",
    "data": {
      "order_id": "TEST123",
      "status": "paid",
      "customer_email": "teste@exemplo.com",
      "customer_name": "Cliente Teste",
      "total_amount": 36.00,
      "payment_method": "pix"
    }
  }'
```

### Usando cURL (Produção)

```bash
curl -X POST https://www.gravadormedico.com.br/api/webhooks/appmax \
  -H "Content-Type: application/json" \
  -d '{
    "event": "order.paid",
    "data": {
      "order_id": "TEST123",
      "status": "paid",
      "customer_email": "teste@exemplo.com",
      "customer_name": "Cliente Teste",
      "total_amount": 36.00,
      "payment_method": "pix"
    }
  }'
```

---

## 📊 Fluxo Completo de Pagamento

### Cartão de Crédito
1. Cliente preenche dados no checkout
2. API `/api/checkout` envia para Appmax
3. Appmax processa pagamento
4. **Webhook:** `order.approved` ou `order.paid`
5. Sistema atualiza:
   - `checkout_attempts` → status: 'paid'
   - `sales` → cria venda com `paid_at`
   - `customers` → upsert cliente
6. Cliente é redirecionado para `/obrigado`

### PIX
1. Cliente preenche dados no checkout
2. API `/api/checkout` envia para Appmax
3. Appmax gera QR Code PIX
4. **Webhook:** `pix.generated` (status: pending)
5. Cliente paga o PIX
6. **Webhook:** `pix.paid`
7. Sistema atualiza (mesmos passos do cartão)
8. Cliente é redirecionado para `/obrigado`

---

## 🔧 Configuração na Appmax

Para garantir que os webhooks funcionem:

1. **Acesse o painel da Appmax**
2. **Configurações → Webhooks**
3. **Adicionar Webhook:**
   - URL: `https://www.gravadormedico.com.br/api/webhooks/appmax`
   - Eventos: Selecionar todos os eventos de pedido e pagamento
   - Secret: (Opcional, mas recomendado para segurança)

4. **Se configurar Secret:**
   ```env
   # Adicionar ao .env.local
   APPMAX_WEBHOOK_SECRET=sua_chave_secreta_aqui
   ```

---

## ✅ Checklist de Validação

- [x] Endpoint `/api/webhooks/appmax` existe
- [x] Webhook processa eventos de pagamento
- [x] Webhook atualiza `checkout_attempts`
- [x] Webhook cria registros em `sales`
- [x] Webhook faz upsert em `customers`
- [x] Logs são salvos em `webhooks_logs`
- [ ] `APPMAX_WEBHOOK_SECRET` configurado (RECOMENDADO)
- [ ] Testado com pagamento real no ambiente de produção

---

## 🎯 Próximos Passos

1. **Fazer um pagamento de teste** no ambiente de produção
2. **Verificar os logs** no Supabase usando as queries acima
3. **Configurar webhook secret** na Appmax para maior segurança
4. **Monitorar** a taxa de sucesso dos webhooks

---

## 📞 Suporte

Se os webhooks não estiverem funcionando:
- Verificar se a URL está correta na Appmax
- Verificar logs de erro em `webhooks_logs`
- Verificar se o servidor está acessível externamente
- Contatar suporte da Appmax se necessário
