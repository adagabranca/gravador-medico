import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.user) {
    return NextResponse.json({ error: auth.error }, { status: auth.status || 401 })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('webhooks_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Erro ao buscar webhooks:', error)
      return NextResponse.json({ error: 'Erro ao buscar webhooks' }, { status: 500 })
    }

    // Transformar dados para o formato esperado pela página
    const logs = (data || []).map(item => {
      const payload = item.payload || {}
      const meta = payload._meta || {}
      
      // Determinar o tipo de evento
      let eventType = meta.event_type || meta.gateway || 'unknown'
      if (payload.topic) {
        eventType = `${meta.gateway || 'webhook'}.${payload.topic}`
      }
      
      // Extrair gateway do endpoint
      let gateway = meta.gateway || 'unknown'
      if (item.endpoint) {
        if (item.endpoint.includes('mercadopago')) gateway = 'mercadopago'
        else if (item.endpoint.includes('appmax')) gateway = 'appmax'
        else if (item.endpoint.includes('resend')) gateway = 'resend'
      }

      return {
        id: item.id,
        event_type: eventType,
        gateway: gateway,
        endpoint: item.endpoint,
        payload: payload,
        response_status: item.response_status,
        error: item.error,
        processing_time_ms: item.processing_time_ms,
        ip_address: null,
        created_at: item.created_at || item.received_at
      }
    })

    return NextResponse.json({ logs })
  } catch (error) {
    console.error('Erro ao carregar webhooks:', error)
    return NextResponse.json({ error: 'Erro ao carregar webhooks' }, { status: 500 })
  }
}
