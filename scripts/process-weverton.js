#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Dados do Weverton (da venda)
const WEVERTON = {
  name: 'Weverton Filho Carvalho',
  email: 'wfrfilho2016@gmail.com',
  orderId: '5b66f8cd-0f8a-4dc5-bb73-dd1eb2e00c6e',
  orderValue: 197,
  paymentMethod: 'credit_card'
}

function generatePassword() {
  const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*'
  let pass = ''
  for (let i = 0; i < 12; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return pass
}

async function createLovableUser(email, name) {
  const password = generatePassword()
  const url = process.env.NEXT_PUBLIC_LOVABLE_EDGE_FUNCTION_URL
  const secret = process.env.LOVABLE_API_SECRET
  
  console.log('Criando usuário no Lovable...')
  console.log('URL:', url)
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-secret': secret
    },
    body: JSON.stringify({
      action: 'create',
      email,
      password,
      name
    })
  })
  
  const data = await res.json()
  console.log('Resposta Lovable:', JSON.stringify(data))
  
  return { password, userId: data.userId || data.user?.id }
}

async function sendEmail(data, password) {
  const { Resend } = require('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  const shortOrderId = data.orderId.slice(0, 8).toUpperCase()
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; background-color: #F7F9FA; margin: 0; padding: 40px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
              <tr>
                <td style="background: linear-gradient(135deg, #16A085 0%, #2EAE9A 100%); padding: 50px 40px; text-align: center;">
                  <span style="font-size: 48px;">🎙️</span>
                  <h1 style="color: #FFFFFF; font-size: 28px; margin: 20px 0 0 0;">Bem-vindo ao Gravador Médico!</h1>
                  <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 12px 0 0 0;">Seu acesso está pronto para uso</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px;">
                  <p style="color: #1A2E38; font-size: 18px; margin: 0 0 24px 0;">Olá, <strong>${data.name}</strong>! 👋</p>
                  <p style="color: #5C7080; font-size: 16px; margin: 0 0 32px 0;">Sua compra foi confirmada com sucesso! Abaixo estão suas credenciais de acesso.</p>
                  
                  <div style="background-color: #E8F8F5; border-radius: 12px; padding: 28px; margin-bottom: 32px;">
                    <h2 style="color: #16A085; font-size: 16px; margin: 0 0 20px 0;">🔐 SUAS CREDENCIAIS DE ACESSO</h2>
                    <div style="margin-bottom: 16px;">
                      <div style="color: #5C7080; font-size: 13px; margin-bottom: 4px;">E-mail</div>
                      <div style="background-color: #FFFFFF; padding: 14px 16px; border-radius: 8px; font-family: monospace; font-size: 15px; color: #1A2E38; border: 1px solid #D8DEE4;">
                        ${data.email}
                      </div>
                    </div>
                    <div>
                      <div style="color: #5C7080; font-size: 13px; margin-bottom: 4px;">Senha</div>
                      <div style="background-color: #FFFFFF; padding: 14px 16px; border-radius: 8px; font-family: monospace; font-size: 15px; color: #1A2E38; border: 1px solid #D8DEE4;">
                        ${password}
                      </div>
                    </div>
                  </div>
                  
                  <div style="text-align: center; margin-bottom: 32px;">
                    <a href="https://app.gravadormedico.com.br" style="display: inline-block; background-color: #16A085; color: #FFFFFF; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                      Acessar Plataforma →
                    </a>
                  </div>
                  
                  <div style="background-color: #F7F9FA; border-radius: 12px; padding: 24px;">
                    <h3 style="color: #1A2E38; font-size: 14px; margin: 0 0 16px 0;">📋 DETALHES DO PEDIDO</h3>
                    <table width="100%">
                      <tr>
                        <td style="color: #5C7080; font-size: 14px; padding: 8px 0;">Pedido</td>
                        <td style="color: #1A2E38; font-size: 14px; font-weight: 600; padding: 8px 0; text-align: right;">#${shortOrderId}</td>
                      </tr>
                      <tr>
                        <td style="color: #5C7080; font-size: 14px; padding: 8px 0; border-top: 1px solid #D8DEE4;">Valor</td>
                        <td style="color: #16A34A; font-size: 14px; font-weight: 600; padding: 8px 0; text-align: right; border-top: 1px solid #D8DEE4;">R$ ${data.orderValue.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="color: #5C7080; font-size: 14px; padding: 8px 0; border-top: 1px solid #D8DEE4;">Pagamento</td>
                        <td style="color: #1A2E38; font-size: 14px; font-weight: 600; padding: 8px 0; text-align: right; border-top: 1px solid #D8DEE4;">${data.paymentMethod === 'credit_card' ? 'Cartão de Crédito' : data.paymentMethod.toUpperCase()}</td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background-color: #F7F9FA; padding: 30px 40px; text-align: center; border-top: 1px solid #D8DEE4;">
                  <p style="color: #5C7080; font-size: 14px; margin: 0 0 8px 0;">Precisa de ajuda?</p>
                  <a href="mailto:suporte@gravadormedico.com.br" style="color: #16A085; font-size: 14px; text-decoration: none;">suporte@gravadormedico.com.br</a>
                  <p style="color: #5C7080; font-size: 12px; margin: 24px 0 0 0;">© 2026 Gravador Médico. Todos os direitos reservados.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
  
  console.log('Enviando email...')
  
  const result = await resend.emails.send({
    from: 'Gravador Médico <suporte@gravadormedico.com.br>',
    to: data.email,
    subject: 'Bem-vindo ao Gravador Médico - Seus Dados de Acesso',
    html
  })
  
  console.log('Email enviado:', result.data?.id)
  
  // Salvar no banco
  await supabase.from('email_logs').insert({
    email_id: result.data?.id,
    recipient_email: data.email,
    recipient_name: data.name,
    subject: 'Bem-vindo ao Gravador Médico - Seus Dados de Acesso',
    html_content: html,
    email_type: 'welcome',
    from_email: 'suporte@gravadormedico.com.br',
    from_name: 'Gravador Médico',
    order_id: data.orderId,
    status: 'sent',
    sent_at: new Date().toISOString(),
    metadata: { user_email: data.email, order_value: data.orderValue, payment_method: data.paymentMethod }
  })
  
  return result.data?.id
}

async function main() {
  try {
    console.log('=== Processando Weverton ===')
    console.log('Email:', WEVERTON.email)
    
    // 1. Criar usuário Lovable
    const { password, userId } = await createLovableUser(WEVERTON.email, WEVERTON.name)
    console.log('Usuário criado! Senha:', password)
    
    // 2. Enviar email
    const emailId = await sendEmail(WEVERTON, password)
    console.log('Email enviado! ID:', emailId)
    
    console.log('\n=== CREDENCIAIS WEVERTON ===')
    console.log('Email:', WEVERTON.email)
    console.log('Senha:', password)
    console.log('============================')
    
  } catch (err) {
    console.error('Erro:', err.message)
  }
}

main()
