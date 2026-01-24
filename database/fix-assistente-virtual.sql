-- ================================================================
-- Corrigir push_name específico
-- ================================================================
-- ⚠️ ATENÇÃO: Isso altera o nome que veio do WhatsApp
-- Use apenas se tiver certeza que é o mesmo contato
-- ================================================================

-- Ver o remote_jid exato do "Assistente Virtual"
SELECT remote_jid, push_name, name, profile_picture_url
FROM whatsapp_contacts
WHERE push_name = 'Assistente Virtual';

-- Se confirmar que é você mesmo, rodar este UPDATE:
-- (descomente depois de confirmar)
/*
UPDATE whatsapp_contacts
SET push_name = 'Helcio Mattos'
WHERE push_name = 'Assistente Virtual';
*/

-- Verificar se alterou
SELECT remote_jid, push_name, name
FROM whatsapp_contacts
WHERE remote_jid LIKE '%5521988960217%';
