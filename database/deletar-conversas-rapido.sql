-- ================================================================
-- DELETAR conversas rapidamente (sem backup)
-- ================================================================

DELETE FROM whatsapp_messages;
DELETE FROM whatsapp_contacts;

-- Verificar
SELECT COUNT(*) AS total_mensagens FROM whatsapp_messages;
SELECT COUNT(*) AS total_contatos FROM whatsapp_contacts;

-- Agora envie uma mensagem de teste e verifique:
-- SELECT remote_jid, push_name, name FROM whatsapp_contacts ORDER BY created_at DESC LIMIT 5;
