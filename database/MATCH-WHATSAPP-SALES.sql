-- =====================================================
-- CRUZAMENTO: WhatsApp Contacts X Sales (Telefones)
-- =====================================================
-- OBJETIVO: Buscar telefones dos clientes através do WhatsApp
-- =====================================================

-- 1️⃣ VER TODOS OS CONTATOS DO WHATSAPP
SELECT 
    '📱 WHATSAPP CONTACTS' as origem,
    push_name as nome_whatsapp,
    remote_jid,
    REPLACE(REPLACE(remote_jid, '@s.whatsapp.net', ''), '@c.us', '') as telefone_limpo,
    last_message_content,
    last_message_timestamp
FROM whatsapp_contacts
ORDER BY last_message_timestamp DESC
LIMIT 20;

-- 2️⃣ CRUZAR COM SALES (por nome similar)
WITH whatsapp_data AS (
    SELECT 
        push_name,
        REPLACE(REPLACE(remote_jid, '@s.whatsapp.net', ''), '@c.us', '') as telefone,
        remote_jid
    FROM whatsapp_contacts
    WHERE push_name IS NOT NULL
)
SELECT 
    '🔗 MATCH POR NOME' as tipo,
    s.customer_email,
    s.customer_name as nome_sales,
    w.push_name as nome_whatsapp,
    w.telefone as telefone_whatsapp,
    s.customer_phone as telefone_atual
FROM sales s
INNER JOIN whatsapp_data w ON (
    LOWER(TRIM(s.customer_name)) = LOWER(TRIM(w.push_name))
    OR LOWER(TRIM(s.customer_name)) LIKE '%' || LOWER(TRIM(w.push_name)) || '%'
    OR LOWER(TRIM(w.push_name)) LIKE '%' || LOWER(TRIM(s.customer_name)) || '%'
)
WHERE s.status IN ('paid', 'provisioning', 'active')
    AND (s.customer_phone IS NULL OR s.customer_phone = '')
ORDER BY s.created_at DESC;

-- 3️⃣ ATUALIZAR TELEFONES AUTOMATICAMENTE (baseado em match de nome)
WITH whatsapp_data AS (
    SELECT 
        push_name,
        REPLACE(REPLACE(remote_jid, '@s.whatsapp.net', ''), '@c.us', '') as telefone,
        remote_jid
    FROM whatsapp_contacts
    WHERE push_name IS NOT NULL
        AND remote_jid IS NOT NULL
),
matches AS (
    SELECT DISTINCT ON (s.id)
        s.id,
        w.telefone
    FROM sales s
    INNER JOIN whatsapp_data w ON (
        LOWER(TRIM(s.customer_name)) = LOWER(TRIM(w.push_name))
    )
    WHERE s.status IN ('paid', 'provisioning', 'active')
        AND (s.customer_phone IS NULL OR s.customer_phone = '')
        AND w.telefone IS NOT NULL
        AND LENGTH(w.telefone) >= 10
)
UPDATE sales s
SET 
    customer_phone = m.telefone,
    updated_at = NOW()
FROM matches m
WHERE s.id = m.id;

-- 4️⃣ VERIFICAR RESULTADO
SELECT 
    '✅ RESULTADO APÓS WHATSAPP MATCH' as status,
    COUNT(*) as total_vendas_pagas,
    COUNT(*) FILTER (WHERE customer_phone IS NOT NULL AND customer_phone != '') as com_telefone,
    COUNT(*) FILTER (WHERE customer_phone IS NULL OR customer_phone = '') as ainda_sem_telefone
FROM sales
WHERE status IN ('paid', 'provisioning', 'active');

-- 5️⃣ VER CLIENTES ESPECÍFICOS QUE FORAM ATUALIZADOS
SELECT 
    customer_email,
    customer_name,
    customer_phone,
    updated_at
FROM sales
WHERE customer_email IN (
    'gabriel_acardoso@hotmail.com',
    'gacardosorj@gmail.com',
    'carol.lucas20@hotmail.com'
);
