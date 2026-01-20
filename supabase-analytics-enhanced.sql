-- Melhorias na tabela analytics_visits
-- Execute no Supabase SQL Editor

-- Adicionar colunas para device, país e cidade
ALTER TABLE public.analytics_visits
ADD COLUMN IF NOT EXISTS device_type TEXT DEFAULT 'desktop',
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS ip_address TEXT;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_analytics_device ON public.analytics_visits(device_type);
CREATE INDEX IF NOT EXISTS idx_analytics_country ON public.analytics_visits(country);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.analytics_visits(created_at DESC);

-- Ver estrutura atualizada
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'analytics_visits';
