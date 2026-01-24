-- ================================================================
-- CORRIGIR: Nomes personalizados errados nos contatos
-- ================================================================
-- Remove nomes personalizados e mantém apenas o push_name original
-- Exemplo: "Assistente Virtual" (name) → NULL, usa "Helcio Mattos" (push_name)
-- ================================================================

-- 1. 🔍 DIAGNÓSTICO: Ver quais contatos têm name diferente de push_name
SELECT 
  remote_jid,
  name AS nome_personalizado,
  push_name AS nome_original_whatsapp,
  CASE 
    WHEN name IS NOT NULL AND push_name IS NOT NULL AND name != push_name 
    THEN '⚠️ DIFERENTE'
    ELSE '✅ OK'
  END AS status
FROM whatsapp_contacts
WHERE name IS NOT NULL AND push_name IS NOT NULL
ORDER BY remote_jid;

-- 2. 💾 BACKUP: Criar tabela de backup antes de alterar (SEGURANÇA)
CREATE TABLE IF NOT EXISTS whatsapp_contacts_backup_names AS
SELECT * FROM whatsapp_contacts;

-- 3. ✅ CORREÇÃO: Limpar nomes personalizados incorretos
-- Remove "name" quando for diferente de "push_name"
-- Exemplo: name="Assistente Virtual" → name=NULL (usa push_name="Helcio Mattos")
UPDATE whatsapp_contacts
SET name = NULL
WHERE name IS NOT NULL 
  AND push_name IS NOT NULL 
  AND name != push_name;

-- 4. 📊 VERIFICAÇÃO: Conferir os 20 contatos mais recentes após correção
SELECT 
  remote_jid,
  name AS nome_personalizado,
  push_name AS nome_original_whatsapp,
  profile_picture_url
FROM whatsapp_contacts
WHERE push_name IS NOT NULL
ORDER BY last_message_timestamp DESC
LIMIT 20;

-- 5. 🔄 ROLLBACK (OPCIONAL): Se precisar desfazer as mudanças
-- Descomente as linhas abaixo para restaurar o backup:
-- DELETE FROM whatsapp_contacts;
-- INSERT INTO whatsapp_contacts SELECT * FROM whatsapp_contacts_backup_names;

-- 6. 🧹 LIMPEZA (OPCIONAL): Apagar backup após confirmar que está tudo OK
-- DROP TABLE whatsapp_contacts_backup_names;
