-- ============================================
-- 🚀 ANALYTICS COMPLETO - SETUP ÚNICO
-- Cria tabela analytics_visits com TODAS as colunas
-- Execução: Uma vez só no Supabase SQL Editor
-- ============================================

BEGIN;

-- ============================================
-- FASE 1: CRIAR TABELA (SE NÃO EXISTIR)
-- ============================================

CREATE TABLE IF NOT EXISTS public.analytics_visits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Navegação Básica
    page_path TEXT NOT NULL,
    referrer TEXT,
    referrer_domain TEXT,
    
    -- Sessão e Identificação
    session_id UUID,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- UTM Parameters (Rastreamento de Campanhas)
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    
    -- Dispositivo e Tecnologia
    device_type TEXT DEFAULT 'desktop', -- mobile, desktop, tablet
    os TEXT, -- iOS, Android, Windows, macOS
    browser TEXT, -- Chrome, Safari, Firefox
    browser_version TEXT,
    user_agent TEXT,
    
    -- Geolocalização
    ip_address TEXT,
    city TEXT,
    region TEXT, -- Estado/Região
    country TEXT,
    
    -- Rastreamento de Ads (Facebook & Google)
    gclid TEXT, -- Google Click ID
    fbclid TEXT, -- Facebook Click ID
    fbc TEXT, -- Facebook Cookie (_fbc)
    fbp TEXT, -- Facebook Pixel (_fbp)
    
    -- Status Online
    is_online BOOLEAN DEFAULT true,
    last_seen TIMESTAMPTZ DEFAULT now(),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================
-- FASE 2: CRIAR ÍNDICES (PERFORMANCE)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_visits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_page ON analytics_visits(page_path);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_visits(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_device ON analytics_visits(device_type);
CREATE INDEX IF NOT EXISTS idx_analytics_country ON analytics_visits(country);
CREATE INDEX IF NOT EXISTS idx_analytics_region ON analytics_visits(region);
CREATE INDEX IF NOT EXISTS idx_analytics_city ON analytics_visits(city);
CREATE INDEX IF NOT EXISTS idx_analytics_utm_source ON analytics_visits(utm_source);
CREATE INDEX IF NOT EXISTS idx_analytics_utm_campaign ON analytics_visits(utm_campaign);
CREATE INDEX IF NOT EXISTS idx_analytics_online ON analytics_visits(is_online, last_seen);
CREATE INDEX IF NOT EXISTS idx_analytics_referrer ON analytics_visits(referrer_domain);

-- ============================================
-- FASE 3: ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.analytics_visits ENABLE ROW LEVEL SECURITY;

-- Permitir INSERT público (para tracking anônimo)
DROP POLICY IF EXISTS "Permitir insert público para tracking" ON public.analytics_visits;
CREATE POLICY "Permitir insert público para tracking"
ON public.analytics_visits
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Admin pode ver tudo
DROP POLICY IF EXISTS "Admin pode ver analytics" ON public.analytics_visits;
CREATE POLICY "Admin pode ver analytics"
ON public.analytics_visits
FOR SELECT
USING (
    auth.jwt() ->> 'email' = 'helciomattos@gmail.com'
);

-- Admin pode atualizar (para marcar is_online = false)
DROP POLICY IF EXISTS "Admin pode atualizar analytics" ON public.analytics_visits;
CREATE POLICY "Admin pode atualizar analytics"
ON public.analytics_visits
FOR UPDATE
USING (
    auth.jwt() ->> 'email' = 'helciomattos@gmail.com'
);

-- ============================================
-- FASE 4: FUNÇÕES AUXILIARES
-- ============================================

-- Função: Detectar visitantes online (últimos 5 minutos)
CREATE OR REPLACE FUNCTION public.detect_online_visitors()
RETURNS TABLE(online_count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT COUNT(DISTINCT session_id)
    FROM public.analytics_visits
    WHERE last_seen >= NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função: Top páginas visitadas (últimas 24h)
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

-- Função: Top fontes de tráfego (últimos 7 dias)
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
-- FASE 5: VIEWS AGREGADAS
-- ============================================

-- View: Visitantes online agora
CREATE OR REPLACE VIEW public.analytics_visitors_online AS
SELECT 
    COUNT(DISTINCT session_id) as online_count,
    COUNT(*) as active_sessions
FROM public.analytics_visits
WHERE last_seen >= NOW() - INTERVAL '5 minutes';

-- View: Resumo diário
CREATE OR REPLACE VIEW public.analytics_daily_summary AS
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

COMMIT;

-- ============================================
-- ✅ SETUP COMPLETO!
-- ============================================
-- Tabela: analytics_visits (com TODAS as colunas)
-- Índices: 11 índices para performance
-- RLS: 3 políticas (insert público, select/update admin)
-- Funções: 3 funções auxiliares
-- Views: 2 views agregadas
-- ============================================
