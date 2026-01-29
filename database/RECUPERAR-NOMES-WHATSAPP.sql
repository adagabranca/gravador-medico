-- =============================================
-- 🔧 RECUPERAR NOMES DO WHATSAPP A PARTIR DAS MENSAGENS
-- =============================================
-- O nome do contato vem no campo raw_payload das mensagens
-- Vamos extrair o pushName de lá e atualizar os contatos
-- =============================================

-- 1️⃣ Ver se as mensagens têm o pushName no raw_payload
SELECT 
    m.remote_jid,
    m.from_me,
    m.raw_payload->>'pushName' as push_name_from_payload,
    m.raw_payload->'data'->>'pushName' as push_name_from_data,
    m.timestamp
FROM whatsapp_messages m
WHERE m.from_me = false
ORDER BY m.timestamp DESC
LIMIT 20;

-- 2️⃣ ATUALIZAR contatos com pushName extraído das mensagens
-- Pega a mensagem mais recente de cada contato que NÃO seja from_me
WITH latest_names AS (
    SELECT DISTINCT ON (m.remote_jid)
        m.remote_jid,
        COALESCE(
            m.raw_payload->>'pushName',
            m.raw_payload->'data'->>'pushName',
            m.raw_payload->'key'->>'pushName'
        ) as extracted_name
    FROM whatsapp_messages m
    WHERE m.from_me = false
      AND m.raw_payload IS NOT NULL
    ORDER BY m.remote_jid, m.timestamp DESC
)
UPDATE whatsapp_contacts c
SET push_name = ln.extracted_name
FROM latest_names ln
WHERE c.remote_jid = ln.remote_jid
  AND ln.extracted_name IS NOT NULL
  AND ln.extracted_name != ''
  AND LOWER(ln.extracted_name) NOT IN ('gravador medico', 'gravador médico', 'assistente virtual')
  AND (c.push_name IS NULL OR c.push_name = '');

-- 3️⃣ Verificar resultado
SELECT 
    remote_jid,
    push_name,
    name
FROM whatsapp_contacts
ORDER BY last_message_timestamp DESC NULLS LAST
LIMIT 20;
