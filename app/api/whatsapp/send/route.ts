// ================================================================
// API: Enviar mensagem WhatsApp via Evolution API
// ================================================================

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { remoteJid, message } = await request.json()

    if (!remoteJid || !message) {
      return NextResponse.json(
        { success: false, message: 'remoteJid e message são obrigatórios' },
        { status: 400 }
      )
    }

    const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL
    const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY
    const EVOLUTION_INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME

    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !EVOLUTION_INSTANCE_NAME) {
      throw new Error('Variáveis de ambiente da Evolution API não configuradas')
    }

    // Endpoint Evolution v2: POST /message/sendText/{instance}
    const url = `${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE_NAME}`

    console.log('📤 Enviando mensagem:', { remoteJid, message: message.substring(0, 50) })

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': EVOLUTION_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        number: remoteJid,
        text: message,
        delay: 1200 // Delay para parecer mais humano
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('❌ Erro da Evolution API:', error)
      throw new Error(`Erro ao enviar mensagem: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('✅ Mensagem enviada com sucesso:', data)

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso',
      data
    })

  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
