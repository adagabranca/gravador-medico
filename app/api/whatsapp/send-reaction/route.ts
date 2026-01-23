import { NextRequest, NextResponse } from 'next/server'
import { sendReaction } from '@/services/whatsapp'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { remoteJid, messageId, emoji } = body

    if (!remoteJid || !messageId || !emoji) {
      return NextResponse.json(
        { error: 'remoteJid, messageId e emoji são obrigatórios' },
        { status: 400 }
      )
    }

    // Nome da instância (pode vir do banco ou variável de ambiente)
    const instanceName = process.env.NEXT_PUBLIC_EVOLUTION_INSTANCE_NAME || 'whatsapp-instance'

    // Enviar reação via Evolution API
    const result = await sendReaction({
      instanceName,
      remoteJid,
      messageId,
      emoji
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Erro ao enviar reação:', error)
    return NextResponse.json(
      { error: 'Falha ao enviar reação' },
      { status: 500 }
    )
  }
}
