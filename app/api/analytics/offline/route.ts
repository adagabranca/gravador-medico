import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * 📊 API Endpoint: Marcar Visitante como Offline
 * Chamado via navigator.sendBeacon quando o usuário sai da página
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { session_id, is_online, last_seen } = body

    if (!session_id) {
      return NextResponse.json(
        { error: 'session_id é obrigatório' },
        { status: 400 }
      )
    }

    // Atualizar status de online
    const { error } = await supabase
      .from('analytics_visits')
      .update({
        is_online: is_online || false,
        last_seen: last_seen || new Date().toISOString()
      })
      .eq('session_id', session_id)

    if (error) {
      console.error('❌ Erro ao atualizar status offline:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('❌ Erro no endpoint offline:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
