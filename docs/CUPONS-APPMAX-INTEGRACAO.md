# 🎟️ Sistema de Cupons - Integração com Appmax

## ❓ Pergunta: Cupons criados no dashboard vão para Appmax?

### 📌 Resposta Rápida: **NÃO** (e não precisa!)

---

## 🔄 Como Funciona a Arquitetura Atual

### **1. Sistema Independente (Melhor Abordagem)**

```
┌─────────────────────────────────────────────────┐
│          GRAVADOR MÉDICO (Seu Sistema)          │
├─────────────────────────────────────────────────┤
│  1. Cliente aplica cupom no checkout            │
│  2. Sistema valida cupom no Supabase            │
│  3. Calcula desconto e novo total               │
│  4. Envia pedido COMPLETO para Appmax          │
│     └─ Já com desconto aplicado                │
│  5. Appmax processa pagamento do valor FINAL   │
│  6. Webhook retorna confirmação                 │
│  7. Sistema salva cupom usado na venda         │
└─────────────────────────────────────────────────┘
```

### **2. Por Que NÃO Enviar Cupons para Appmax?**

✅ **Vantagens de Gerenciar Internamente:**
- **Controle Total**: Você define regras, limites, expiração
- **Flexibilidade**: Cria/edita cupons em tempo real sem API externa
- **Performance**: Validação instantânea no seu banco de dados
- **Estatísticas**: Rastreamento completo de uso por cupom
- **Segurança**: Cupons não expostos a sistema terceiro
- **Simplicidade**: Appmax só recebe o valor final a cobrar

❌ **Desvantagens de Enviar para Appmax:**
- Dependência de API externa para gerenciar cupons
- Possíveis conflitos entre regras internas e do gateway
- Latência adicional na validação
- Complexidade desnecessária
- Appmax pode ter limitações de lógica de cupom

---

## 💡 Como o Sistema Atual Funciona (Passo a Passo)

### **Fluxo Completo**

```javascript
// 1. CHECKOUT - Cliente aplica cupom
const cupom = "ADMGM"
const valorOriginal = 97.00

// 2. VALIDAÇÃO INTERNA (Supabase)
POST /api/checkout/validate-coupon
{
  code: "ADMGM",
  orderValue: 97.00
}

// Resposta:
{
  valid: true,
  discountAmount: 96.03,  // 99% de desconto
  newTotal: 0.97
}

// 3. ENVIO PARA APPMAX (valor JÁ com desconto)
POST /api/checkout
{
  product_id: "xxx",
  customer: {...},
  amount: 0.97,  // ← Valor FINAL com desconto
  coupon_code: "ADMGM",  // ← Salvo no metadata
  coupon_discount: 96.03
}

// 4. APPMAX processa pagamento de R$ 0.97
// 5. WEBHOOK confirma pagamento
// 6. Sistema salva venda com cupom rastreado
```

---

## 🎯 Benefícios da Arquitetura Escolhida

### **1. Autonomia Completa**
- Crie cupons sem depender de Appmax
- Edite regras instantaneamente
- Desative cupons em emergências

### **2. Rastreamento Avançado**
```sql
-- Você tem queries como:
SELECT COUNT(*) FROM sales WHERE coupon_code = 'ADMGM';
SELECT SUM(coupon_discount) FROM sales WHERE status = 'paid';
SELECT customer_email FROM sales WHERE coupon_code = 'BLACKFRIDAY';
```

### **3. Regras Personalizadas**
- Valor mínimo do pedido
- Limite de usos (global ou por cliente)
- Data de expiração
- Cupons de porcentagem ou valor fixo
- Cupons exclusivos por email/CPF

### **4. Performance**
```
Validação Interna:  ~50ms  ✅
vs
API Appmax:         ~500ms ❌
```

---

## 🔐 Segurança e Integridade

### **Como Evitar Fraudes:**

```typescript
// Validação em 3 camadas:

// 1. Frontend (UX, não segurança)
if (!cupom) return alert("Digite um cupom")

// 2. Backend API (SEGURANÇA REAL)
const { valid, error } = await validateCouponOnServer(cupom, valor)
if (!valid) return { error }

// 3. Appmax recebe valor FINAL
// Não há como manipular, o gateway cobra o que você envia
createAppmaxOrder({
  amount: valorFinal  // ← Já calculado no servidor
})
```

---

## 📊 Dados Armazenados

### **Tabela `coupons`** (Supabase)
```sql
- code              VARCHAR(50)   -- "ADMGM"
- type              VARCHAR(10)   -- "percent" | "fixed"
- value             NUMERIC       -- 99 (99% ou R$ 99)
- usage_count       INTEGER       -- Quantas vezes foi usado
- usage_limit       INTEGER       -- Limite de usos (NULL = ilimitado)
- expiration_date   TIMESTAMP     -- Data de expiração
- is_active         BOOLEAN       -- Ativo/Desativado
```

### **Tabela `sales`** (Supabase)
```sql
- appmax_order_id   VARCHAR       -- ID do pedido Appmax
- total_amount      NUMERIC       -- R$ 0.97 (valor FINAL pago)
- coupon_code       VARCHAR       -- "ADMGM"
- coupon_discount   NUMERIC       -- R$ 96.03
- status            VARCHAR       -- "paid" | "pending" | "failed"
```

---

## 🚀 Exemplo Prático: Criar Cupom Black Friday

### **1. No Dashboard** (`/admin/cupons`)
```
Código: BLACKFRIDAY
Tipo: Porcentagem
Valor: 50%
Valor Mínimo: R$ 50.00
Limite: 100 usos
Expira: 30/11/2026 23:59
```

### **2. Cliente Usa no Checkout**
```
Produto: R$ 97.00
Cupom: BLACKFRIDAY
Desconto: -R$ 48.50 (50%)
Total: R$ 48.50 ✅
```

### **3. Appmax Recebe**
```json
{
  "product_id": "gravador-medico",
  "amount": 48.50,
  "metadata": {
    "coupon_code": "BLACKFRIDAY",
    "coupon_discount": 48.50
  }
}
```

### **4. Relatórios no Admin**
```
Cupom BLACKFRIDAY:
├─ 47/100 usos
├─ R$ 2.279,50 em descontos
├─ 47 vendas geradas
└─ Taxa conversão: 89%
```

---

## ✅ Conclusão

### **Seu sistema de cupons é:**
- ✅ **Independente** - Não precisa de Appmax para funcionar
- ✅ **Completo** - Todas as features necessárias
- ✅ **Rápido** - Validação instantânea
- ✅ **Rastreável** - Estatísticas em tempo real
- ✅ **Seguro** - Validação server-side
- ✅ **Flexível** - Crie/edite quando quiser

### **Appmax só precisa saber:**
- 💰 Quanto cobrar (valor final)
- 📦 O que está sendo vendido
- 👤 Dados do cliente

**O resto é gerenciado pelo seu sistema! 🎯**

---

## 🆘 FAQ

**P: E se eu quiser integrar cupons com Appmax no futuro?**  
R: Tecnicamente possível, mas não recomendado. Você perderia flexibilidade e controle.

**P: Appmax valida se o cupom é real?**  
R: Não. Appmax recebe o valor final e cobra isso. A validação é sua responsabilidade (e está feita!).

**P: Posso ter cupons diferentes em Appmax e no sistema?**  
R: Tecnicamente sim, mas geraria confusão. Mantenha tudo no seu sistema.

**P: Como garantir que ninguém burle os cupons?**  
R: Validação acontece no servidor (API route), onde cliente não tem acesso. Seguro! 🔒

---

**Criado em:** 26/01/2026  
**Sistema:** Gravador Médico  
**Arquitetura:** Supabase + Next.js + Appmax Gateway
