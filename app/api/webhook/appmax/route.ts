import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const payload = await request.json()
    console.log('🔔 Appmax webhook recebido:', JSON.stringify(payload, null, 2))
    
    // ⚠️ APPMAX "test event" envia payload VAZIO/NULL - apenas logar e retornar OK
    if (!payload || Object.keys(payload).length === 0) {
      console.log('⚠️ Webhook de teste vazio recebido (normal para Appmax)')
      await supabase.from('webhooks_logs').insert({
        endpoint: '/api/webhook/appmax',
        payload: { test: true, empty: true },
        response_status: 200,
        processing_time_ms: Date.now() - startTime,
      })
      return NextResponse.json({ received: true, test: true }, { status: 200 })
    }
    
    // Log webhook válido
    await supabase.from('webhooks_logs').insert({
      endpoint: '/api/webhook/appmax',
      payload,
      response_status: 200,
      processing_time_ms: Date.now() - startTime,
    })
    
    const orderId = payload.appmax_order_id || payload.order_id || payload.id
    const status = payload.status || 'pending'
    const customerEmail = payload.customer?.email || payload.email
    const customerName = payload.customer?.name || payload.name || 'Cliente Appmax'
    const totalAmount = Number(payload.total_amount || payload.amount || payload.value || 0)
    const paymentMethod = payload.payment_method || payload.payment_type
    
    if (!orderId || !customerEmail) {
      console.log('⚠️ Dados insuficientes no payload:', { orderId, customerEmail })
      return NextResponse.json({ received: true, warning: 'Dados incompletos' }, { status: 200 })
    }
    if (!orderId || !customerEmail) {
      console.log('⚠️ Dados insuficientes no payload:', { orderId, customerEmail })
      return NextResponse.json({ received: true, warning: 'Dados incompletos' }, { status: 200 })
    }
    
    // UPSERT cliente
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .upsert({ 
        email: customerEmail,
        name: customerName,
      }, { 
        onConflict: 'email',
        ignoreDuplicates: false 
      })
      .select('id')
      .single()
    
    if (customerError) {
      console.error('❌ Erro ao criar/atualizar cliente:', customerError)
    }
    
    // UPSERT venda
    const { error: salesError } = await supabase.from('sales').upsert({
      appmax_order_id: orderId,
      customer_id: customer?.id,
      customer_email: customerEmail,
      customer_name: customerName,
      total_amount: totalAmount,
      status: status,
      payment_method: paymentMethod,
    }, { 
      onConflict: 'appmax_order_id',
      ignoreDuplicates: false 
    })
    
    if (salesError) {
      console.error('❌ Erro ao criar/atualizar venda:', salesError)
    }
    
    console.log('✅ Venda processada com sucesso:', { orderId, status, totalAmount })
    return NextResponse.json({ 
      success: true, 
      order_id: orderId, 
      status 
    })
    
  } catch (error) {
    console.error('❌ Webhook erro:', error)
    
    // Log erro
    try {
      await supabase.from('webhooks_logs').insert({
        endpoint: '/api/webhook/appmax',
        response_status: 500,
        error: error instanceof Error ? error.message : String(error),
        processing_time_ms: Date.now() - startTime,
      })
    } catch (logError) {
      console.error('❌ Erro ao logar webhook:', logError)
    }
    
    // ⚠️ Appmax precisa de 200 sempre, senão fica reenviando
    return NextResponse.json({ received: true, error: 'Internal error' }, { status: 200 })
  }
}
