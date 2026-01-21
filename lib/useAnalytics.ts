'use client'

/**
 * 📊 Analytics Heartbeat Hook
 * Rastreia visitantes em tempo real e envia dados de navegação para o Supabase
 * Nível: Google Analytics / Mixpanel
 */

import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface AnalyticsData {
  session_id: string
  page_path: string
  last_seen: string
  is_online: boolean
  user_agent?: string
  device_type?: 'mobile' | 'tablet' | 'desktop'
  referrer_domain?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

/**
 * Hook para rastreamento de Analytics
 * Deve ser chamado no layout.tsx raiz da aplicação pública (não no /admin)
 */
export function useAnalytics() {
  const sessionId = useRef<string>('')
  const isInitialized = useRef(false)

  useEffect(() => {
    // Não rastrear em páginas de admin
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return
    }

    // Evitar inicialização duplicada
    if (isInitialized.current) return
    isInitialized.current = true

    // 1️⃣ GERAR OU RECUPERAR SESSION ID
    const initSession = () => {
      let currentSession = sessionStorage.getItem('analytics_session_id')
      if (!currentSession) {
        currentSession = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        sessionStorage.setItem('analytics_session_id', currentSession)
      }
      sessionId.current = currentSession
      return currentSession
    }

    const currentSessionId = initSession()

    // 2️⃣ DETECTAR DISPOSITIVO
    const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
      const ua = navigator.userAgent
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet'
      }
      if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'mobile'
      }
      return 'desktop'
    }

    // 3️⃣ EXTRAIR UTMs DA URL
    const getUTMParams = () => {
      if (typeof window === 'undefined') return {}
      
      const params = new URLSearchParams(window.location.search)
      return {
        utm_source: params.get('utm_source') || undefined,
        utm_medium: params.get('utm_medium') || undefined,
        utm_campaign: params.get('utm_campaign') || undefined,
        utm_content: params.get('utm_content') || undefined,
        utm_term: params.get('utm_term') || undefined,
      }
    }

    // 4️⃣ EXTRAIR REFERRER
    const getReferrerDomain = () => {
      if (!document.referrer) return undefined
      try {
        const url = new URL(document.referrer)
        return url.hostname
      } catch {
        return undefined
      }
    }

    // 5️⃣ FUNÇÃO DE HEARTBEAT (Enviar dados para o Supabase)
    const sendHeartbeat = async () => {
      const utmParams = getUTMParams()
      
      const analyticsData: AnalyticsData = {
        session_id: currentSessionId,
        page_path: window.location.pathname,
        last_seen: new Date().toISOString(),
        is_online: true,
        user_agent: navigator.userAgent,
        device_type: getDeviceType(),
        referrer_domain: getReferrerDomain(),
        ...utmParams,
      }

      try {
        const { error } = await supabase
          .from('analytics_visits')
          .upsert(analyticsData, { 
            onConflict: 'session_id',
            ignoreDuplicates: false 
          })

        if (error) {
          console.error('❌ Erro no heartbeat analytics:', error)
        } else {
          console.log('✅ Analytics heartbeat enviado:', {
            session: currentSessionId.substring(0, 20) + '...',
            page: window.location.pathname
          })
        }
      } catch (err) {
        console.error('❌ Exceção no heartbeat:', err)
      }
    }

    // 6️⃣ DISPARAR IMEDIATAMENTE E DEPOIS A CADA 30s
    sendHeartbeat()
    const interval = setInterval(sendHeartbeat, 30000) // 30 segundos

    // 7️⃣ MARCAR COMO OFFLINE AO SAIR (Elegante, mas opcional)
    const handleUnload = () => {
      // Navigator.sendBeacon é não-bloqueante e funciona mesmo ao fechar a aba
      const blob = new Blob([JSON.stringify({ 
        session_id: currentSessionId,
        is_online: false,
        last_seen: new Date().toISOString()
      })], { type: 'application/json' })
      
      navigator.sendBeacon('/api/analytics/offline', blob)
    }

    // Eventos de saída
    window.addEventListener('beforeunload', handleUnload)
    window.addEventListener('pagehide', handleUnload)

    // 🧹 CLEANUP
    return () => {
      clearInterval(interval)
      window.removeEventListener('beforeunload', handleUnload)
      window.removeEventListener('pagehide', handleUnload)
    }
  }, [supabase])

  return null // Hook não retorna nada, apenas executa efeitos colaterais
}
