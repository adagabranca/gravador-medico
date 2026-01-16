import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validar campos
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Autenticar usuário
    const isValid = await authenticateUser(email, password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Email ou senha inválidos, ou você não tem acesso ao produto' },
        { status: 401 }
      )
    }

    // Gerar token
    const token = await generateToken(email)

    return NextResponse.json({
      success: true,
      token,
      message: 'Login realizado com sucesso'
    })
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { error: 'Erro ao processar login' },
      { status: 500 }
    )
  }
}
