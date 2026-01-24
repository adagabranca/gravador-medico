-- ================================================================
-- LIMPAR conversas e mensagens do WhatsApp
-- ================================================================
-- ⚠️ ATENÇÃO: Isso vai deletar TODAS as mensagens e conversas!
-- Os dados serão recriados quando receberem novas mensagens
-- ================================================================

-- 1. BACKUP DE SEGURANÇA (por precaução)
CREATE TABLE IF NOT EXISTS whatsapp_messages_backup AS
SELECT * FROM whatsapp_messages;

CREATE TABLE IF NOT EXISTS whatsapp_contacts_backup_full AS
SELECT * FROM whatsapp_contacts;

-- 2. LIMPAR MENSAGENS
DELETE FROM whatsapp_messages;

-- 3. LIMPAR CONTATOS
DELETE FROM whatsapp_contacts;

-- 4. VERIFICAR se limpou
SELECT COUNT(*) AS total_mensagens FROM whatsapp_messages;
SELECT COUNT(*) AS total_contatos FROM whatsapp_contacts;

-- 5. ✅ PRONTO! Agora:
-- - Envie uma mensagem de teste do seu WhatsApp
-- - O webhook vai criar o contato com o nome correto do WhatsApp
-- - Verifique qual nome aparece com:

-- SELECT remote_jid, push_name, name 
-- FROM whatsapp_contacts 
-- ORDER BY created_at DESC 
-- LIMIT 5;

-- 6. 🔄 ROLLBACK (se precisar restaurar):
-- DELETE FROM whatsapp_messages;
-- DELETE FROM whatsapp_contacts;
-- INSERT INTO whatsapp_messages SELECT * FROM whatsapp_messages_backup;
-- INSERT INTO whatsapp_contacts SELECT * FROM whatsapp_contacts_backup_full;
