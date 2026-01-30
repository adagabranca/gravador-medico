import { MessageCircle, Mail } from 'lucide-react'
import { getWhatsAppLink, getEmailLink, formatPhoneDisplay, type WhatsAppContext, type EmailContext } from '@/lib/contact-helpers'

interface ContactButtonsProps {
  phone?: string
  email: string
  customerName?: string
  whatsappContext?: WhatsAppContext
  emailContext?: EmailContext
  extraData?: {
    orderId?: string
    saleId?: string
    productName?: string
  }
  variant?: 'inline' | 'stacked'
  showLabels?: boolean
}

export function ContactButtons({
  phone,
  email,
  customerName,
  whatsappContext = 'general',
  emailContext = 'general',
  extraData,
  variant = 'inline',
  showLabels = false
}: ContactButtonsProps) {
  const whatsappLink = phone ? getWhatsAppLink(phone, whatsappContext, customerName) : null
  const emailLink = getEmailLink(email, emailContext, customerName, extraData)

  const buttonClass = variant === 'inline' 
    ? 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105'
    : 'flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg font-medium transition-all hover:scale-105'

  return (
    <div className={variant === 'inline' ? 'flex items-center gap-2' : 'flex flex-col gap-2'}>
      {/* Botão WhatsApp */}
      {whatsappLink && (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClass} bg-green-600 hover:bg-green-700 text-white`}
          title={phone ? `WhatsApp: ${formatPhoneDisplay(phone)}` : 'WhatsApp'}
        >
          <MessageCircle className="w-4 h-4" />
          {showLabels && <span>WhatsApp</span>}
        </a>
      )}

      {/* Botão Email */}
      <a
        href={emailLink}
        className={`${buttonClass} bg-blue-600 hover:bg-blue-700 text-white`}
        title={`Email: ${email}`}
      >
        <Mail className="w-4 h-4" />
        {showLabels && <span>Email</span>}
      </a>
    </div>
  )
}

/**
 * Versão simples - apenas ícone com link
 */
export function WhatsAppIcon({ phone, context = 'general', customerName }: {
  phone: string
  context?: WhatsAppContext
  customerName?: string
}) {
  const link = getWhatsAppLink(phone, context, customerName)
  
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-600 hover:bg-green-700 text-white transition-all hover:scale-110"
      title={`WhatsApp: ${formatPhoneDisplay(phone)}`}
    >
      <MessageCircle className="w-4 h-4" />
    </a>
  )
}

/**
 * Versão simples - apenas ícone de email
 */
export function EmailIcon({ email, context = 'general', customerName, extraData }: {
  email: string
  context?: EmailContext
  customerName?: string
  extraData?: {
    orderId?: string
    saleId?: string
    productName?: string
  }
}) {
  const link = getEmailLink(email, context, customerName, extraData)
  
  return (
    <a
      href={link}
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-110"
      title={`Email: ${email}`}
    >
      <Mail className="w-4 h-4" />
    </a>
  )
}
