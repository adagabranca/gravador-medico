-- EXECUTE ESTE SQL NO SUPABASE AGORA PARA VER O RESULTADO IMEDIATAMENTE
-- 
-- Acesse: https://supabase.com/dashboard
-- Vá em: SQL Editor
-- Cole este código e clique em RUN

-- 1️⃣ DELETAR O PRODUTO FAKE DE R$ 297
DELETE FROM products 
WHERE external_id NOT IN ('32991339', '32989468', '32989503', '32989520');

-- 2️⃣ INSERIR OS 4 PRODUTOS REAIS (SE NÃO EXISTIREM)
INSERT INTO products (
  external_id,
  name,
  description,
  price,
  image_url,
  category,
  plan_type,
  is_active,
  is_featured,
  checkout_url,
  created_at,
  updated_at
) VALUES 
-- PRODUTO PRINCIPAL - R$ 36
(
  '32991339',
  'Método Gravador Médico',
  'Acesso completo e vitalício ao Método Gravador Médico',
  36.00,
  'https://gravadormedico.com.br/logo.png',
  'one_time',
  'lifetime',
  true,
  true,
  'https://gravadormedico1768482029857.carrinho.app/one-checkout/ocudf/32991339',
  now(),
  now()
),
-- ORDER BUMP 1 - R$ 29,90
(
  '32989468',
  'Conteúdo Infinito para Instagram',
  'Templates e ideias infinitas para seu Instagram médico',
  29.90,
  'https://gravadormedico.com.br/logo.png',
  'bump',
  'one_time',
  true,
  false,
  null,
  now(),
  now()
),
-- ORDER BUMP 2 - R$ 97
(
  '32989503',
  'Implementação Assistida',
  'Suporte dedicado para configurar tudo para você',
  97.00,
  'https://gravadormedico.com.br/logo.png',
  'bump',
  'service',
  true,
  false,
  null,
  now(),
  now()
),
-- ORDER BUMP 3 - R$ 39,90
(
  '32989520',
  'Análise Inteligente de Consultas',
  'IA avançada para análise de consultas e insights',
  39.90,
  'https://gravadormedico.com.br/logo.png',
  'bump',
  'one_time',
  true,
  false,
  null,
  now(),
  now()
)
ON CONFLICT (external_id) DO NOTHING;

-- ✅ VERIFICAR RESULTADO
SELECT 
  external_id,
  name,
  price,
  category,
  is_active
FROM products
ORDER BY is_featured DESC, price DESC;
