-- ================================================================
-- ⚠️ EXECUTAR ESTE ARQUIVO COMPLETO NO SUPABASE SQL EDITOR
-- ================================================================

-- 1️⃣ BACKUP (executar primeiro)
CREATE TABLE IF NOT EXISTS whatsapp_contacts_backup_names AS
SELECT * FROM whatsapp_contacts;

-- 2️⃣ CORREÇÃO (este é o comando principal!)
UPDATE whatsapp_contacts
SET name = NULL
WHERE name IS NOT NULL 
  AND push_name IS NOT NULL 
  AND name != push_name;

-- 3️⃣ VERIFICAR resultado
SELECT 
  remote_jid,
  name AS nome_personalizado,
  push_name AS nome_original_whatsapp,
  profile_picture_url
FROM whatsapp_contacts
WHERE push_name IS NOT NULL
ORDER BY last_message_timestamp DESC
LIMIT 20;
