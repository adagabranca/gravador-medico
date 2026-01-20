"use client"

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

/**
 * Componente invisível que rastreia visitas ao site
 * Salva pageviews, origem, UTMs e sessão
 */
export default function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    trackPageView()
  }, [pathname, searchParams])

  const trackPageView = async () => {
    try {
      // Gerar ou recuperar session_id (persiste no sessionStorage)
      let sessionId = sessionStorage.getItem('session_id')
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        sessionStorage.setItem('session_id', sessionId)
      }

      // Capturar UTMs da URL
      const utmSource = searchParams?.get('utm_source') || null
      const utmMedium = searchParams?.get('utm_medium') || null
      const utmCampaign = searchParams?.get('utm_campaign') || null
      const utmContent = searchParams?.get('utm_content') || null
      const utmTerm = searchParams?.get('utm_term') || null

      // Salvar UTMs no sessionStorage (para manter durante navegação)
      if (utmSource) sessionStorage.setItem('utm_source', utmSource)
      if (utmMedium) sessionStorage.setItem('utm_medium', utmMedium)
      if (utmCampaign) sessionStorage.setItem('utm_campaign', utmCampaign)

      // Recuperar UTMs salvos (caso página atual não tenha UTM na URL)
      const savedUtmSource = utmSource || sessionStorage.getItem('utm_source')
      const savedUtmMedium = utmMedium || sessionStorage.getItem('utm_medium')
      const savedUtmCampaign = utmCampaign || sessionStorage.getItem('utm_campaign')

      // Dados do pageview
      const visitData = {
        page_path: pathname,
        referrer: document.referrer || null,
        utm_source: savedUtmSource,
        utm_medium: savedUtmMedium,
        utm_campaign: savedUtmCampaign,
        utm_content: utmContent,
        utm_term: utmTerm,
        user_agent: navigator.userAgent,
        session_id: sessionId,
      }

      // Inserir no Supabase (sem autenticação, policy permite insert público)
      const { error } = await supabase.from('analytics_visits').insert(visitData)

      if (error) {
        console.error('Erro ao registrar visita:', error)
      } else {
        console.log('✅ Visita registrada:', pathname)
      }
    } catch (err) {
      console.error('Erro no analytics tracker:', err)
    }
  }

  return null // Componente invisível
}
