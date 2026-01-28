import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/admin/emails/[emailId]/events
 * Busca eventos (timeline) de um email específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ emailId: string }> }
) {
  try {
    const { emailId } = await params

    // Buscar o email
    const { data: email, error: emailError } = await supabaseAdmin
      .from('email_logs')
      .select('*')
      .eq('id', emailId)
      .single()

    if (emailError || !email) {
      return NextResponse.json(
        { success: false, error: 'Email não encontrado' },
        { status: 404 }
      )
    }

    // Buscar eventos do email
    const { data: events, error: eventsError } = await supabaseAdmin
      .from('email_events')
      .select('*')
      .eq('email_log_id', emailId)
      .order('created_at', { ascending: true })

    // Construir timeline a partir dos campos do email se não houver eventos
    const timeline: Array<{
      id: string
      event_type: string
      created_at: string
      icon?: string
      label?: string
      color?: string
      details?: any
      event_data?: any
    }> = []

    // Evento: Enviado
    if (email.sent_at || email.created_at) {
      timeline.push({
        id: 'sent',
        event_type: 'sent',
        created_at: email.sent_at || email.created_at,
        icon: '➤',
        label: 'Enviado',
        color: 'gray',
      })
    }

    // Evento: Entregue
    if (email.delivered_at || email.status === 'delivered') {
      timeline.push({
        id: 'delivered',
        event_type: 'delivered',
        created_at: email.delivered_at || email.sent_at || email.created_at,
        icon: '✓',
        label: 'Entregue',
        color: 'green',
      })
    }

    // Evento: Aberto (primeira vez)
    if (email.first_opened_at) {
      timeline.push({
        id: 'opened',
        event_type: 'opened',
        created_at: email.first_opened_at,
        icon: '👁',
        label: `Aberto${email.open_count > 1 ? ` (${email.open_count}x)` : ''}`,
        color: 'blue',
        details: {
          device: email.device_type,
          browser: email.browser,
          os: email.os,
        },
      })
    }

    // Evento: Clicado
    if (email.clicked_at || email.clicked) {
      timeline.push({
        id: 'clicked',
        event_type: 'clicked',
        created_at: email.clicked_at || email.first_opened_at,
        icon: '🔗',
        label: `Clicado${email.click_count > 1 ? ` (${email.click_count}x)` : ''}`,
        color: 'purple',
      })
    }

    // Evento: Bounced
    if (email.status === 'bounced') {
      timeline.push({
        id: 'bounced',
        event_type: 'bounced',
        created_at: email.bounced_at || email.created_at,
        icon: '❌',
        label: 'Retornado',
        color: 'red',
      })
    }

    // Evento: Spam
    if (email.status === 'spam') {
      timeline.push({
        id: 'spam',
        event_type: 'spam',
        created_at: email.complained_at || email.created_at,
        icon: '🚫',
        label: 'Marcado como Spam',
        color: 'red',
      })
    }

    // Adicionar eventos do banco
    if (events && events.length > 0) {
      events.forEach((event: any) => {
        // Verificar se já não temos esse evento na timeline
        const exists = timeline.find((t) => t.event_type === event.event_type)
        if (!exists) {
          timeline.push({
            id: event.id,
            event_type: event.event_type,
            created_at: event.created_at,
            event_data: event.event_data,
          })
        }
      })
    }

    // Ordenar por data
    timeline.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )

    return NextResponse.json({
      success: true,
      email,
      timeline,
      events: events || [],
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar eventos do email:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
