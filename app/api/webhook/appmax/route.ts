import { NextRequest, NextResponse } from 'next/server'
import { createOrUpdateUser } from '@/lib/supabase'

/**
 * Webhook da APPMAX
 * Recebe notificações de compras aprovadas e cria/atualiza usuários
 * 
 * Configurar na APPMAX:
 * URL: https://seu-dominio.com/api/webhook/appmax
 * Eventos: purchase.approved
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('Webhook APPMAX recebido:', body)

    // Validar evento
    if (body.event !== 'purchase.approved') {
      return NextResponse.json(
        { message: 'Evento ignorado' },
        { status: 200 }
      )
    }

    // Extrair dados do cliente
    const customerEmail = body.customer?.email
    const customerName = body.customer?.name
    const customerId = body.customer?.id

    if (!customerEmail) {
      console.error('Email do cliente não encontrado no webhook')
      return NextResponse.json(
        { error: 'Email do cliente não encontrado' },
        { status: 400 }
      )
    }

    // Criar ou atualizar usuário no Supabase
    const user = await createOrUpdateUser({
      email: customerEmail,
      name: customerName,
      appmax_customer_id: customerId,
    })

    console.log('Usuário criado/atualizado:', user)

    // TODO: Enviar email de boas-vindas com instruções de login
    // await sendWelcomeEmail(customerEmail, customerName)

    return NextResponse.json({
      success: true,
      message: 'Usuário criado com sucesso',
      user_id: user.id,
    })
  } catch (error) {
    console.error('Erro ao processar webhook APPMAX:', error)
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    )
  }
}

/**
 * Endpoint GET para testar se o webhook está funcionando
 */
export async function GET() {
  return NextResponse.json({
    message: 'Webhook APPMAX está funcionando',
    timestamp: new Date().toISOString(),
  })
}
