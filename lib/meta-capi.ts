/**
 * 🚀 META CONVERSION API (CAPI)
 * 
 * Envia eventos de conversão diretamente do servidor para o Facebook.
 * Isso recupera 20-30% das conversões perdidas por bloqueadores de anúncios.
 * 
 * Documentação: https://developers.facebook.com/docs/marketing-api/conversions-api
 */

import crypto from 'crypto'

interface MetaConversionEvent {
  // Dados do Usuário (Customer Information)
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  city?: string
  state?: string
  country?: string
  zip?: string
  
  // Dados do Evento
  eventName: 'Purchase' | 'AddToCart' | 'InitiateCheckout' | 'ViewContent'
  eventTime: number // Unix timestamp
  eventId: string // ID único para deduplicação
  
  // Dados da Compra
  value?: number
  currency?: string
  contentName?: string
  contentIds?: string[]
  contentType?: string
  numItems?: number
  
  // Tracking (Crucial!)
  fbc?: string // Facebook Click ID (_fbc cookie)
  fbp?: string // Facebook Browser ID (_fbp cookie)
  eventSourceUrl?: string
  clientIpAddress?: string
  clientUserAgent?: string
}

/**
 * Hash SHA256 para normalizar dados do usuário
 * Meta exige dados hasheados por privacidade
 */
function hashData(data: string | undefined): string | undefined {
  if (!data) return undefined
  return crypto
    .createHash('sha256')
    .update(data.toLowerCase().trim())
    .digest('hex')
}

/**
 * Envia um evento de conversão para o Facebook
 */
export async function sendMetaConversionEvent(event: MetaConversionEvent) {
  const pixelId = process.env.META_PIXEL_ID
  const accessToken = process.env.META_CONVERSION_API_TOKEN

  if (!pixelId || !accessToken) {
    console.error('❌ META_PIXEL_ID ou META_CONVERSION_API_TOKEN não configurados')
    return { success: false, error: 'Configuração ausente' }
  }

  try {
    // Montar User Data (hasheado)
    const userData: any = {}
    
    if (event.email) userData.em = [hashData(event.email)]
    if (event.phone) userData.ph = [hashData(event.phone.replace(/\D/g, ''))]
    if (event.firstName) userData.fn = [hashData(event.firstName)]
    if (event.lastName) userData.ln = [hashData(event.lastName)]
    if (event.city) userData.ct = [hashData(event.city)]
    if (event.state) userData.st = [hashData(event.state)]
    if (event.country) userData.country = [hashData(event.country)]
    if (event.zip) userData.zp = [hashData(event.zip)]
    
    if (event.clientIpAddress) userData.client_ip_address = event.clientIpAddress
    if (event.clientUserAgent) userData.client_user_agent = event.clientUserAgent
    if (event.fbc) userData.fbc = event.fbc
    if (event.fbp) userData.fbp = event.fbp

    // Montar Custom Data (dados da compra)
    const customData: any = {}
    
    if (event.value) customData.value = event.value
    if (event.currency) customData.currency = event.currency
    if (event.contentName) customData.content_name = event.contentName
    if (event.contentIds) customData.content_ids = event.contentIds
    if (event.contentType) customData.content_type = event.contentType
    if (event.numItems) customData.num_items = event.numItems

    // Montar payload completo
    const payload = {
      data: [
        {
          event_name: event.eventName,
          event_time: event.eventTime,
          event_id: event.eventId, // Deduplicação (mesmo ID do Pixel)
          event_source_url: event.eventSourceUrl || 'https://seu-site.com',
          action_source: 'website',
          user_data: userData,
          custom_data: customData
        }
      ]
    }

    // Enviar para Meta CAPI
    const url = `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const result = await response.json()

    if (result.error) {
      console.error('❌ Erro na Meta CAPI:', result.error)
      return { success: false, error: result.error }
    }

    console.log('✅ Evento enviado para Meta CAPI:', {
      eventName: event.eventName,
      eventId: event.eventId,
      value: event.value,
      eventsReceived: result.events_received,
      fbTraceId: result.fbtrace_id
    })

    return { 
      success: true, 
      eventsReceived: result.events_received,
      fbTraceId: result.fbtrace_id 
    }
  } catch (error) {
    console.error('💥 Erro ao enviar para Meta CAPI:', error)
    return { success: false, error }
  }
}

/**
 * Enviar evento de COMPRA (Purchase)
 * Chamar isso no webhook quando a venda for confirmada
 */
export async function sendPurchaseEvent(params: {
  orderId: string
  customerEmail?: string
  customerPhone?: string
  customerName?: string
  totalAmount: number
  currency?: string
  productName?: string
  productIds?: string[]
  city?: string
  state?: string
  country?: string
  fbc?: string
  fbp?: string
  ipAddress?: string
  userAgent?: string
  eventSourceUrl?: string
}) {
  const [firstName, ...lastNameParts] = (params.customerName || '').split(' ')
  const lastName = lastNameParts.join(' ')

  return sendMetaConversionEvent({
    eventName: 'Purchase',
    eventTime: Math.floor(Date.now() / 1000),
    eventId: params.orderId, // Mesmo ID da venda para deduplicação
    
    // Dados do Cliente
    email: params.customerEmail,
    phone: params.customerPhone,
    firstName,
    lastName,
    city: params.city,
    state: params.state,
    country: params.country,
    
    // Dados da Compra
    value: params.totalAmount,
    currency: params.currency || 'BRL',
    contentName: params.productName,
    contentIds: params.productIds,
    contentType: 'product',
    numItems: params.productIds?.length || 1,
    
    // Tracking
    fbc: params.fbc,
    fbp: params.fbp,
    clientIpAddress: params.ipAddress,
    clientUserAgent: params.userAgent,
    eventSourceUrl: params.eventSourceUrl
  })
}

/**
 * Enviar evento de CARRINHO ABANDONADO (InitiateCheckout)
 * Chamar quando o usuário chega no checkout mas não compra
 */
export async function sendInitiateCheckoutEvent(params: {
  sessionId: string
  customerEmail?: string
  customerPhone?: string
  cartValue: number
  productName?: string
  fbc?: string
  fbp?: string
  ipAddress?: string
  userAgent?: string
}) {
  return sendMetaConversionEvent({
    eventName: 'InitiateCheckout',
    eventTime: Math.floor(Date.now() / 1000),
    eventId: `checkout_${params.sessionId}`,
    
    email: params.customerEmail,
    phone: params.customerPhone,
    
    value: params.cartValue,
    currency: 'BRL',
    contentName: params.productName,
    contentType: 'product',
    
    fbc: params.fbc,
    fbp: params.fbp,
    clientIpAddress: params.ipAddress,
    clientUserAgent: params.userAgent
  })
}
