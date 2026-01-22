-- ================================================================
-- CORREÇÃO 1: Adicionar coluna avatar_url na tabela users
-- ================================================================

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Comentário
COMMENT ON COLUMN users.avatar_url IS 'URL da foto de perfil do usuário';

-- ================================================================
-- CORREÇÃO 2: Verificar se whatsapp_messages tem campo from_me
-- ================================================================

-- Verificar estrutura da tabela
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'whatsapp_messages';

-- Se necessário, adicionar coluna from_me
ALTER TABLE whatsapp_messages 
ADD COLUMN IF NOT EXISTS from_me BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN whatsapp_messages.from_me IS 'Indica se a mensagem foi enviada pelo sistema (true) ou recebida do cliente (false)';

-- Índice para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_from_me 
  ON whatsapp_messages(remote_jid, from_me, timestamp DESC);

-- ================================================================
-- VERIFICAÇÕES
-- ================================================================

-- Contar mensagens enviadas vs recebidas
-- SELECT 
--   from_me,
--   COUNT(*) as total
-- FROM whatsapp_messages
-- GROUP BY from_me;
