-- =============================================
-- 🔧 CORRIGIR VENDAS SEM PROVISIONING
-- =============================================
-- Execute este SQL para adicionar vendas pagas à fila
-- =============================================

-- 1️⃣ VER QUANTAS VENDAS PRECISAM SER ADICIONADAS
SELECT COUNT(*) as vendas_sem_provisioning
FROM sales s
LEFT JOIN provisioning_queue pq ON s.id = pq.sale_id
WHERE s.order_status = 'paid'
  AND pq.id IS NULL;

-- 2️⃣ INSERIR NA FILA DE PROVISIONING TODAS AS VENDAS PAGAS QUE NÃO ESTÃO NA FILA
INSERT INTO provisioning_queue (sale_id, status, created_at)
SELECT s.id, 'pending', NOW()
FROM sales s
LEFT JOIN provisioning_queue pq ON s.id = pq.sale_id
WHERE s.order_status = 'paid'
  AND pq.id IS NULL;

-- 3️⃣ VERIFICAR SE FORAM ADICIONADAS
SELECT 
    pq.id,
    pq.sale_id,
    pq.status,
    s.customer_email,
    s.customer_name,
    pq.created_at
FROM provisioning_queue pq
JOIN sales s ON pq.sale_id = s.id
WHERE pq.status = 'pending'
ORDER BY pq.created_at DESC;
