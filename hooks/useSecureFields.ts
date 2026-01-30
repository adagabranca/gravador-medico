'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

declare global {
  interface Window {
    MercadoPago: any
  }
}

interface CardFormData {
  token: string
  installments: number
  paymentMethodId: string
  issuerId: string
}

interface SecureFieldsConfig {
  amount: number
  formId: string
  cardNumberId: string
  cardholderNameId: string
  expirationDateId: string
  securityCodeId: string
  installmentsId: string
  identificationTypeId: string
  identificationNumberId: string
  issuerContainerId?: string
}

export function useSecureFields(config: SecureFieldsConfig | null) {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardFormInstance, setCardFormInstance] = useState<any>(null)
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const initRef = useRef(false)

  useEffect(() => {
    if (!config || initRef.current) return
    
    const initSecureFields = async () => {
      try {
        // Aguarda o SDK carregar
        let attempts = 0
        while (!window.MercadoPago && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100))
          attempts++
        }

        if (!window.MercadoPago) {
          throw new Error('Mercado Pago SDK não carregou')
        }

        const publicKey = (process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || '').trim()
        
        if (!publicKey) {
          throw new Error('Chave pública do Mercado Pago não configurada')
        }

        const mp = new window.MercadoPago(publicKey, { locale: 'pt-BR' })

        console.log('🔐 Inicializando Secure Fields do Mercado Pago...')

        // Criar o CardForm com Secure Fields
        const cardForm = mp.cardForm({
          amount: String(config.amount),
          iframe: true, // Habilita Secure Fields (iframes)
          form: {
            id: config.formId,
            cardNumber: {
              id: config.cardNumberId,
              placeholder: '0000 0000 0000 0000',
              style: {
                fontSize: '16px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: '#1a1a1a',
                'placeholder-color': '#9ca3af'
              }
            },
            cardholderName: {
              id: config.cardholderNameId,
              placeholder: 'NOME COMO NO CARTÃO'
            },
            expirationDate: {
              id: config.expirationDateId,
              placeholder: 'MM/AA',
              style: {
                fontSize: '16px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: '#1a1a1a',
                'placeholder-color': '#9ca3af'
              }
            },
            securityCode: {
              id: config.securityCodeId,
              placeholder: 'CVV',
              style: {
                fontSize: '16px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: '#1a1a1a',
                'placeholder-color': '#9ca3af'
              }
            },
            installments: {
              id: config.installmentsId,
              placeholder: 'Parcelas'
            },
            identificationType: {
              id: config.identificationTypeId
            },
            identificationNumber: {
              id: config.identificationNumberId,
              placeholder: 'CPF/CNPJ'
            },
            issuer: config.issuerContainerId ? {
              id: config.issuerContainerId,
              placeholder: 'Banco emissor'
            } : undefined
          },
          callbacks: {
            onFormMounted: (error: any) => {
              if (error) {
                console.error('❌ Erro ao montar Secure Fields:', error)
                setError('Erro ao carregar formulário seguro')
              } else {
                console.log('✅ Secure Fields montados com sucesso')
                setIsReady(true)
              }
            },
            onSubmit: (event: Event) => {
              event.preventDefault()
            },
            onFetching: (resource: string) => {
              console.log('🔄 Fetching:', resource)
              return () => {}
            },
            onCardTokenReceived: (error: any, token: string) => {
              if (error) {
                console.error('❌ Erro ao receber token:', error)
                setError(error.message || 'Erro ao processar cartão')
              } else {
                console.log('✅ Token recebido:', token)
              }
            },
            onPaymentMethodsReceived: (error: any, data: any) => {
              if (error) {
                console.error('❌ Erro ao receber payment methods:', error)
              } else if (data && data.length > 0) {
                console.log('💳 Payment method detectado:', data[0].id)
                setPaymentMethodId(data[0].id)
                setCardBrand(data[0].id)
              }
            }
          }
        })

        setCardFormInstance(cardForm)
        initRef.current = true

      } catch (err: any) {
        console.error('❌ Erro ao inicializar Secure Fields:', err)
        setError(err.message)
      }
    }

    // Delay para garantir que os elementos DOM existem
    const timer = setTimeout(initSecureFields, 500)
    return () => clearTimeout(timer)
  }, [config])

  // Função para criar token
  const createToken = useCallback(async (): Promise<CardFormData | null> => {
    if (!cardFormInstance) {
      setError('Formulário não inicializado')
      return null
    }

    try {
      console.log('🔐 Criando token via Secure Fields...')
      const formData = cardFormInstance.getCardFormData()
      
      console.log('📦 Form data:', {
        token: formData.token ? '***' : null,
        paymentMethodId: formData.paymentMethodId,
        issuerId: formData.issuerId,
        installments: formData.installments
      })

      if (!formData.token) {
        throw new Error('Token não gerado. Verifique os dados do cartão.')
      }

      return {
        token: formData.token,
        installments: parseInt(formData.installments) || 1,
        paymentMethodId: formData.paymentMethodId,
        issuerId: formData.issuerId
      }
    } catch (err: any) {
      console.error('❌ Erro ao criar token:', err)
      setError(err.message || 'Erro ao processar cartão')
      return null
    }
  }, [cardFormInstance])

  // Função para atualizar o amount (para recalcular parcelas)
  const updateAmount = useCallback((newAmount: number) => {
    if (cardFormInstance) {
      cardFormInstance.update('amount', String(newAmount))
    }
  }, [cardFormInstance])

  // Função para obter device ID
  const getDeviceId = useCallback(() => {
    if (!cardFormInstance) return null
    try {
      return window.MercadoPago?.deviceId || null
    } catch (e) {
      return null
    }
  }, [cardFormInstance])

  return {
    isReady,
    error,
    createToken,
    updateAmount,
    getDeviceId,
    paymentMethodId,
    cardBrand
  }
}
