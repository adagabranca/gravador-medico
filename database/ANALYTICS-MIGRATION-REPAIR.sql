-- ============================================
-- 🔧 ANALYTICS MIGRATION - REPAIR MODE
-- Conserta tabela analytics_visits existente
-- Adiciona colunas faltantes SEM perder dados
-- ============================================
-- 
-- ✅ CORRIGIDO: Agora inclui utm_source, utm_medium, utm_campaign
-- Essas colunas são necessárias ANTES de criar os índices
-- ============================================

BEGIN;

-- ============================================
-- FASE 1: ADICIONAR COLUNAS FALTANTES
-- ============================================
-- O 'IF NOT EXISTS' garante que só adiciona se não tiver

-- Identificação e Referência
ALTER TABLE public.analytics_visits ADD COLUMN IF NOT EXISTS session_id UUID;
ALTER TABLE public.analytics_visits ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.analytics_visits ADD COLUMN IF NOT EXISTS referrer_domain TEXT;

-- UTM Parameters (TODAS as colunas necessárias)
ALTER TABLE public.analytics_visits ADD COLUMN IF NOT EXISTS utm_source TEXT;
ALTER TABLE public.analytics_visits ADD COLUMN IF NOT EXISTS utm_medium TEXT;
ALTER TABLE public.analytics_visits ADD COLUMN IF NOT EXISTS utm_campaign TEXT;
ALTER TABLE public.analytics_visits ADD COLUMN IF NOT EXISTS utm_content TEXT;
ALTER TABLE public.analytics_visits ADD COLUMN IF NOT EXISTS utm_term TEXT;

-- Dispositivo e Tecnologia
ALTER TABLE public.analytics_visits ADD COLUMN IF NOT EXISTS device_type TEXT DEFAULT 'desktop';
ALTER TABLE public.analytics_visits ADD COLUMN IF NOT EXISTS os TEXT;
ALTER TABLE public.analytics_visits ADD COLUMN IF NOT EXISTS browser TEXT;
ALTER TABLE public.analytics_visits ADD COLUMN IF NOT EXISTS browser_version TEXT;

-- Geolocalização
ALTER TABLE public.analytics_visits ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE public.analytics_visits ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.analytics_visits ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE public.analytics_visits ADD COLUMN IF NOT EXISTS country TEXT;

-- Rastreamento de Ads
ALTER TABLE public.analytics_visits ADD COLUMN IF NOT EXISTS gclid TEXT;
ALTER TABLE public.analytics_visits ADD COLUMN IF NOT EXISTS fbclid TEXT;
ALTER TABLE public.analytics_visits ADD COLUMN IF NOT EXISTS fbc TEXT;
ALTER TABLE public.analytics_visits ADD COLUMN IF NOT EXISTS fbp TEXT;

-- Status Online
ALTER TABLE public.analytics_visits ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT true;
ALTER TABLE public.analytics_visits ADD COLUMN IF NOT EXISTS last_seen TIMESTAMPTZ DEFAULT now();

-- ============================================
-- FASE 2: RECRIAR ÍNDICES
-- ============================================
-- DROP IF EXISTS para evitar conflito

DROP INDEX IF EXISTS idx_analytics_created;
DROP INDEX IF EXISTS idx_analytics_page;
DROP INDEX IF EXISTS idx_analytics_session;
DROP INDEX IF EXISTS idx_analytics_device;
DROP INDEX IF EXISTS idx_analytics_country;
DROP INDEX IF EXISTS idx_analytics_region;
DROP INDEX IF EXISTS idx_analytics_city;
DROP INDEX IF EXISTS idx_analytics_utm_source;
DROP INDEX IF EXISTS idx_analytics_utm_campaign;
DROP INDEX IF EXISTS idx_analytics_online;
DROP INDEX IF EXISTS idx_analytics_referrer;

CREATE INDEX idx_analytics_created ON public.analytics_visits(created_at DESC);
CREATE INDEX idx_analytics_page ON public.analytics_visits(page_path);
CREATE INDEX idx_analytics_session ON public.analytics_visits(session_id);
CREATE INDEX idx_analytics_device ON public.analytics_visits(device_type);
CREATE INDEX idx_analytics_country ON public.analytics_visits(country);
CREATE INDEX idx_analytics_region ON public.analytics_visits(region);
CREATE INDEX idx_analytics_city ON public.analytics_visits(city);
CREATE INDEX idx_analytics_utm_source ON public.analytics_visits(utm_source);
CREATE INDEX idx_analytics_utm_campaign ON public.analytics_visits(utm_campaign);
CREATE INDEX idx_analytics_online ON public.analytics_visits(is_online, last_seen);
CREATE INDEX idx_analytics_referrer ON public.analytics_visits(referrer_domain);

-- ============================================
-- FASE 3: RECRIAR VIEWS
-- ============================================

DROP VIEW IF EXISTS public.analytics_visitors_online CASCADE;
DROP VIEW IF EXISTS public.analytics_daily_summary CASCADE;

-- View: Visitantes online agora
CREATE VIEW public.analytics_visitors_online AS
SELECT 
    COUNT(DISTINCT session_id) as online_count,
    COUNT(*) as active_sessions
FROM public.analytics_visits
WHERE last_seen >= NOW() - INTERVAL '5 minutes';

-- View: Resumo diário
CREATE VIEW public.analytics_daily_summary AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_pageviews,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL) as authenticated_users,
    COUNT(*) FILTER (WHERE device_type = 'mobile') as mobile_visits,
    COUNT(*) FILTER (WHERE device_type = 'desktop') as desktop_visits
FROM public.analytics_visits
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- ============================================
-- FASE 4: FUNÇÕES AUXILIARES
-- ============================================

CREATE OR REPLACE FUNCTION public.detect_online_visitors()
RETURNS TABLE(online_count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT COUNT(DISTINCT session_id)
    FROM public.analytics_visits
    WHERE last_seen >= NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_top_pages_24h()
RETURNS TABLE(
    page_path TEXT,
    visit_count BIGINT,
    unique_sessions BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.page_path,
        COUNT(*) as visit_count,
        COUNT(DISTINCT v.session_id) as unique_sessions
    FROM public.analytics_visits v
    WHERE v.created_at >= NOW() - INTERVAL '24 hours'
    GROUP BY v.page_path
    ORDER BY visit_count DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_top_traffic_sources_7d()
RETURNS TABLE(
    source TEXT,
    visit_count BIGINT,
    unique_sessions BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(v.utm_source, v.referrer_domain, 'direct') as source,
        COUNT(*) as visit_count,
        COUNT(DISTINCT v.session_id) as unique_sessions
    FROM public.analytics_visits v
    WHERE v.created_at >= NOW() - INTERVAL '7 days'
    GROUP BY source
    ORDER BY visit_count DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FASE 5: RLS E PERMISSÕES
-- ============================================

ALTER TABLE public.analytics_visits ENABLE ROW LEVEL SECURITY;

-- Remove políticas antigas
DROP POLICY IF EXISTS "Permitir insert público para tracking" ON public.analytics_visits;
DROP POLICY IF EXISTS "Admin pode ver analytics" ON public.analytics_visits;
DROP POLICY IF EXISTS "Admin pode atualizar analytics" ON public.analytics_visits;
DROP POLICY IF EXISTS "Public insert analytics" ON public.analytics_visits;
DROP POLICY IF EXISTS "Permitir update público para heartbeat" ON public.analytics_visits;
DROP POLICY IF EXISTS "Public update analytics" ON public.analytics_visits;

-- Recria políticas limpas
CREATE POLICY "Permitir insert público para tracking"
ON public.analytics_visits
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Permitir UPDATE público (para heartbeat/is_online)
CREATE POLICY "Public update analytics"
ON public.analytics_visits
FOR UPDATE
TO anon, authenticated
USING (true);

-- SELECT aberto (para dashboard público ou MVP)
CREATE POLICY "Admin pode ver analytics"
ON public.analytics_visits
FOR SELECT
USING (true);

COMMIT;

-- ============================================
-- ✅ MIGRAÇÃO COMPLETA!
-- ============================================
-- ✓ Colunas adicionadas à tabela existente
-- ✓ 11 índices recriados
-- ✓ 2 views recriadas
-- ✓ 3 funções auxiliares
-- ✓ RLS com 3 políticas
-- ============================================
