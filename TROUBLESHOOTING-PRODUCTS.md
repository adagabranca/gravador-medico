# 🔍 TROUBLESHOOTING - Products não mostra vendas

## ❌ Problema Identificado

A página de **Inteligência de Produtos** não está mostrando:
- ❌ Vendas (30D) = 0
- ❌ Receita Total = R$ 0,00
- ❌ Taxa de Reembolso = 0%
- ❌ Health Score = 0/100

## 🔎 Causa Raiz

A view `product_performance` no banco de dados depende de 2 fontes de dados:

1. **JSONB** → `checkout_attempts.cart_items` (dados do checkout)
2. **Normalizado** → `sales_items` (vendas confirmadas via AppMax webhook)

**O problema:** Se essas tabelas estiverem vazias ou mal estruturadas, a view retorna 0 resultados.

## ✅ Solução

### Passo 1: Verificar se o SQL foi executado

Acesse o **Supabase SQL Editor** e execute:

```sql
-- Verificar se a view existe
SELECT * FROM information_schema.views 
WHERE table_name = 'product_performance';

-- Se retornar 0 linhas, a view NÃO FOI CRIADA
```

**Se a view não existir:**
- Execute o arquivo: `database/PRODUCTS-INTELLIGENCE-MINIMAL.sql`

---

### Passo 2: Verificar se há vendas no banco

```sql
-- Verificar vendas confirmadas
SELECT COUNT(*) as total_vendas FROM sales;

-- Verificar itens vendidos
SELECT COUNT(*) as total_itens FROM sales_items;

-- Verificar checkouts (JSONB)
SELECT COUNT(*) as total_checkouts FROM checkout_attempts
WHERE cart_items IS NOT NULL;
```

**Resultado esperado:**
- Se todos retornarem `0`, significa que **não há vendas ainda**
- Se `sales` > 0 mas `sales_items` = 0, há um problema no webhook

---

### Passo 3: Testar a view manualmente

```sql
-- Ver dados brutos da view
SELECT * FROM product_performance;

-- Se retornar vazio, verificar a query interna
SELECT 
    product_name,
    COUNT(*) as vendas
FROM (
    -- Fonte 1: JSONB
    SELECT (item->>'name')::text as product_name
    FROM checkout_attempts ca
    CROSS JOIN LATERAL jsonb_array_elements(ca.cart_items) AS item
    WHERE ca.status = 'approved'
    
    UNION ALL
    
    -- Fonte 2: Normalizado
    SELECT si.product_name
    FROM sales_items si
    JOIN sales s ON si.sale_id = s.id
    WHERE s.status IN ('approved', 'paid', 'completed')
) vendas_combinadas
GROUP BY product_name;
```

---

## 🎯 Ação Imediata

**Opção A: Criar venda de teste**

Execute no Supabase:

```sql
-- Criar cliente teste
INSERT INTO customers (email, name, phone)
VALUES ('teste@exemplo.com', 'Cliente Teste', '11999999999')
RETURNING id;

-- Copie o ID retornado e use abaixo (substitua CUSTOMER_ID_AQUI)

-- Criar venda teste
INSERT INTO sales (
    customer_id,
    customer_email,
    total_amount,
    status,
    payment_method,
    external_transaction_id,
    created_at
)
VALUES (
    'CUSTOMER_ID_AQUI',
    'teste@exemplo.com',
    97.00,
    'approved',
    'credit_card',
    'TEST-' || gen_random_uuid(),
    NOW()
)
RETURNING id;

-- Copie o ID retornado e use abaixo (substitua SALE_ID_AQUI)

-- Criar item da venda
INSERT INTO sales_items (
    sale_id,
    product_id,
    product_name,
    quantity,
    unit_price,
    total_price
)
VALUES (
    'SALE_ID_AQUI',
    (SELECT id FROM products LIMIT 1), -- Pega primeiro produto
    'Gravador Médico - Acesso Vitalício',
    1,
    97.00,
    97.00
);
```

**Opção B: Aguardar venda real**

Se você já tem o webhook configurado:
1. Faça uma compra real no checkout
2. O webhook da AppMax vai criar automaticamente:
   - Registro em `sales`
   - Registro em `sales_items`
3. A view `product_performance` vai popular automaticamente

---

## 🔧 Debug via Console

Abra o Console do navegador em `https://www.gravadormedico.com.br/admin/products` e veja:

```
📦 Produtos encontrados: X
📊 Performance encontrada: Y
ℹ️ Produto sem vendas: Nome do Produto
```

- Se `Performance encontrada: 0` → Nenhuma venda ainda OU view não criada
- Se aparecer "Produto sem vendas" para todos → Confirma que não há vendas

---

## ✅ Checklist Final

- [ ] Executar `PRODUCTS-INTELLIGENCE-MINIMAL.sql` no Supabase
- [ ] Executar `ANALYTICS-MIGRATION-REPAIR.sql` no Supabase
- [ ] Verificar se `product_performance` view existe
- [ ] Criar venda de teste OU aguardar venda real
- [ ] Abrir página `/admin/products` e ver console
- [ ] Clicar em "Sincronizar com Vendas" para forçar refresh

---

## 📞 Próximo Passo

Se após executar os SQLs ainda não aparecer dados:
1. Compartilhe o resultado de `SELECT * FROM product_performance;`
2. Compartilhe o log do console do navegador
3. Vou ajustar a query da view
