#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const { Resend } = require('resend')

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const resend = new Resend(process.env.RESEND_API_KEY)

function generateSecurePassword(length = 12) {
  const lowercase = 'abcdefghijkmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const numbers = '0123456789'
  const special = '@#$%&*!?'
  
  let password = ''
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += special[Math.floor(Math.random() * special.length)]
  
  const allChars = lowercase + uppercase + numbers + special
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

async function main() {
  const sale = {
    id: '12071f07-2414-4196-8d8f-a07f884d3355',
    customer_name: 'Weverton Filho Carvalho',
    customer_email: 'wevertonfcarvalho@hotmail.com',
    amount: 36,
    payment_method: 'credit_card'
  }
  
  const password = generateSecurePassword()
  console.log('=== CRIANDO LOGIN WEVERTON ===')
  console.log('Email:', sale.customer_email)
  console.log('Senha gerada:', password)
  
  const LOVABLE_URL = process.env.LOVABLE_API_URL || process.env.NEXT_PUBLIC_LOVABLE_EDGE_FUNCTION_URL
  const LOVABLE_SECRET = process.env.LOVABLE_API_SECRET
  
  console.log('\nChamando Lovable...')
  
  try {
    const response = await fetch(LOVABLE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-secret': LOVABLE_SECRET
      },
      body: JSON.stringify({
        action: 'create',
        email: sale.customer_email,
        password: password,
        full_name: sale.customer_name
      })
    })
    
    const result = await response.json()
    console.log('Resposta Lovable:', JSON.stringify(result, null, 2))
    
    if (result.success || result.user || result.userId || result.message?.includes('existe')) {
      console.log('\n✅ Usuário criado/existe no Lovable')
      
      console.log('\nEnviando email...')
      
      const htmlContent = `
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
                      <p style="color: #1A2E38; font-size: 18px; margin: 0 0 24px 0;">Olá, <strong>${sale.customer_name}</strong>! 👋</p>
                      <p style="color: #5C7080; font-size: 16px; margin: 0 0 32px 0;">Sua compra foi confirmada com sucesso! Abaixo estão suas credenciais de acesso.</p>
                      
                      <div style="background-color: #E8F8F5; border-radius: 12px; padding: 28px; margin-bottom: 32px;">
                        <h2 style="color: #16A085; font-size: 16px; margin: 0 0 20px 0;">🔐 SUAS CREDENCIAIS DE ACESSO</h2>
                        <div style="margin-bottom: 16px;">
                          <div style="color: #5C7080; font-size: 13px; margin-bottom: 4px;">E-mail</div>
                          <div style="background-color: #FFFFFF; padding: 14px 16px; border-radius: 8px; font-family: monospace; font-size: 15px; color: #1A2E38; border: 1px solid #D8DEE4;">
                            ${sale.customer_email}
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
                            <td style="color: #1A2E38; font-size: 14px; font-weight: 600; padding: 8px 0; text-align: right;">#${sale.id.slice(0,8).toUpperCase()}</td>
                          </tr>
                          <tr>
                            <td style="color: #5C7080; font-size: 14px; padding: 8px 0; border-top: 1px solid #D8DEE4;">Valor</td>
                            <td style="color: #16A34A; font-size: 14px; font-weight: 600; padding: 8px 0; text-align: right; border-top: 1px solid #D8DEE4;">R$ ${Number(sale.amount).toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td style="color: #5C7080; font-size: 14px; padding: 8px 0; border-top: 1px solid #D8DEE4;">Pagamento</td>
                            <td style="color: #1A2E38; font-size: 14px; font-weight: 600; padding: 8px 0; text-align: right; border-top: 1px solid #D8DEE4;">Cartão</td>
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
      
      const emailResult = await resend.emails.send({
        from: 'Gravador Médico <suporte@gravadormedico.com.br>',
        to: sale.customer_email,
        subject: 'Bem-vindo ao Gravador Médico - Seus Dados de Acesso',
        html: htmlContent
      })
      
      console.log('Email enviado! ID:', emailResult.data?.id)
      
      const { error: dbError } = await supabase.from('email_logs').insert({
        email_id: emailResult.data?.id,
        recipient_email: sale.customer_email,
        recipient_name: sale.customer_name,
        subject: 'Bem-vindo ao Gravador Médico - Seus Dados de Acesso',
        html_content: htmlContent,
        email_type: 'welcome',
        from_email: 'suporte@gravadormedico.com.br',
        from_name: 'Gravador Médico',
        order_id: sale.id,
        status: 'sent',
        sent_at: new Date().toISOString(),
        metadata: {
          user_email: sale.customer_email,
          order_value: sale.amount,
          payment_method: sale.payment_method
        }
      })
      
      if (dbError) console.error('Erro ao salvar log:', dbError)
      else console.log('✅ Email log salvo!')
      
      console.log('\n========================================')
      console.log('✅ WEVERTON - CREDENCIAIS')
      console.log('========================================')
      console.log('Email:', sale.customer_email)
      console.log('Senha:', password)
      console.log('========================================')
    } else {
      console.error('❌ Erro ao criar usuário:', result)
    }
  } catch (error) {
    console.error('Erro:', error)
  }
}

main().catch(console.error)
