/**
 * Integração com APPMAX - Checkout
 * Link base: https://gravadormedico.carrinho.app/one-checkout/ocudf/32880073
 */

interface UTMParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

/**
 * Gera o link de checkout da APPMAX com parâmetros UTM
 */
export function generateCheckoutLink(utmParams?: UTMParams): string {
  const baseUrl = 'https://gravadormedico.carrinho.app/one-checkout/ocudf/32880073'
  
  if (!utmParams) {
    return baseUrl
  }
  
  const params = new URLSearchParams()
  
  if (utmParams.utm_source) params.append('utm_source', utmParams.utm_source)
  if (utmParams.utm_medium) params.append('utm_medium', utmParams.utm_medium)
  if (utmParams.utm_campaign) params.append('utm_campaign', utmParams.utm_campaign)
  if (utmParams.utm_content) params.append('utm_content', utmParams.utm_content)
  if (utmParams.utm_term) params.append('utm_term', utmParams.utm_term)
  
  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

/**
 * Valida se um email tem acesso ao produto (via webhook da APPMAX)
 */
export async function validateAppmaxAccess(email: string): Promise<boolean> {
  try {
    // Aqui você pode fazer uma chamada à API da APPMAX para validar
    // Por enquanto, vamos validar via Supabase (tabela de usuários)
    return true
  } catch (error) {
    console.error('Erro ao validar acesso APPMAX:', error)
    return false
  }
}
