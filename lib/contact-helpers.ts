// =====================================================
// HELPERS: Links WhatsApp e Email Personalizados
// =====================================================

export type WhatsAppContext = 
  | 'recovery' // Recuperação de carrinhos
  | 'support' // Suporte técnico
  | 'welcome' // Boas-vindas
  | 'followup' // Acompanhamento
  | 'general' // Geral

export type EmailContext =
  | 'welcome' // Email de boas-vindas
  | 'support' // Suporte técnico  
  | 'recovery' // Recuperação
  | 'resend' // Reenvio de credenciais
  | 'general' // Geral

/**
 * Gera link do WhatsApp com mensagem personalizada
 */
export function getWhatsAppLink(
  phone: string,
  context: WhatsAppContext = 'general',
  customerName?: string
): string {
  // Limpar telefone (remover caracteres não numéricos)
  const cleanPhone = phone.replace(/\D/g, '')
  
  // Se não tiver código do país, adicionar 55 (Brasil)
  const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`
  
  // Mensagens personalizadas por contexto
  const messages: Record<WhatsAppContext, string> = {
    recovery: `Olá${customerName ? ` ${customerName}` : ''}! 👋

Notamos que você deixou items no carrinho. Posso ajudar a finalizar sua compra? 🛒

Estou aqui para tirar qualquer dúvida! 😊`,
    
    support: `Olá${customerName ? ` ${customerName}` : ''}! 👋

Como posso ajudar você hoje? Estou aqui para resolver qualquer questão sobre sua conta ou sistema. 💻`,
    
    welcome: `Olá${customerName ? ` ${customerName}` : ''}, seja bem-vindo(a)! 🎉

Obrigado por escolher nosso sistema! Como posso ajudar você a começar? 🚀`,
    
    followup: `Olá${customerName ? ` ${customerName}` : ''}! 👋

Como está sendo sua experiência com o sistema? Posso ajudar em algo? 😊`,
    
    general: `Olá${customerName ? ` ${customerName}` : ''}! 👋

Como posso ajudar você hoje? 😊`
  }
  
  const message = encodeURIComponent(messages[context])
  
  return `https://wa.me/${fullPhone}?text=${message}`
}

/**
 * Gera link mailto com assunto e corpo personalizados
 */
export function getEmailLink(
  email: string,
  context: EmailContext = 'general',
  customerName?: string,
  extraData?: {
    orderId?: string
    saleId?: string
    productName?: string
  }
): string {
  // Assuntos e corpos personalizados por contexto
  const templates: Record<EmailContext, { subject: string; body: string }> = {
    welcome: {
      subject: '🎉 Bem-vindo(a) ao Gravador Médico!',
      body: `Olá${customerName ? ` ${customerName}` : ''}!

Seja muito bem-vindo(a) ao Gravador Médico! 

Estamos muito felizes em tê-lo(a) conosco. Se precisar de ajuda para começar ou tiver alguma dúvida, estamos à disposição.

Atenciosamente,
Equipe Gravador Médico`
    },
    
    support: {
      subject: '🛠️ Suporte Técnico - Gravador Médico',
      body: `Olá${customerName ? ` ${customerName}` : ''}!

Como posso ajudar você hoje?

${extraData?.orderId ? `Pedido: ${extraData.orderId}\n` : ''}${extraData?.saleId ? `ID da Venda: ${extraData.saleId}\n` : ''}
Descreva sua dúvida ou problema abaixo e retornaremos o mais rápido possível.

Atenciosamente,
Equipe Gravador Médico`
    },
    
    recovery: {
      subject: '🛒 Complete sua compra - Gravador Médico',
      body: `Olá${customerName ? ` ${customerName}` : ''}!

Notamos que você deixou items no carrinho. Gostaria de finalizar sua compra?

Se tiver alguma dúvida ou precisar de ajuda, estamos aqui para ajudar!

Atenciosamente,
Equipe Gravador Médico`
    },
    
    resend: {
      subject: '🔑 Reenvio de Credenciais - Gravador Médico',
      body: `Olá${customerName ? ` ${customerName}` : ''}!

Aqui estão suas credenciais de acesso ao sistema:

${extraData?.orderId ? `Pedido: ${extraData.orderId}\n` : ''}
(As credenciais serão enviadas automaticamente em um email separado)

Se precisar de ajuda, estamos à disposição!

Atenciosamente,
Equipe Gravador Médico`
    },
    
    general: {
      subject: 'Gravador Médico - Contato',
      body: `Olá${customerName ? ` ${customerName}` : ''}!

Como posso ajudar você hoje?

Atenciosamente,
Equipe Gravador Médico`
    }
  }
  
  const template = templates[context]
  const subject = encodeURIComponent(template.subject)
  const body = encodeURIComponent(template.body)
  
  return `mailto:${email}?subject=${subject}&body=${body}`
}

/**
 * Formata telefone para exibição (formato brasileiro)
 */
export function formatPhoneDisplay(phone: string): string {
  const clean = phone.replace(/\D/g, '')
  
  // Remover código do país se presente
  const localPhone = clean.startsWith('55') ? clean.slice(2) : clean
  
  // Formatar baseado no tamanho
  if (localPhone.length === 11) {
    // Celular: (XX) 9XXXX-XXXX
    return localPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (localPhone.length === 10) {
    // Fixo: (XX) XXXX-XXXX
    return localPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  
  // Retornar original se não se encaixar nos padrões
  return phone
}
