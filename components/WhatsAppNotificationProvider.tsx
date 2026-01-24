// ================================================================
// Provider: Notificações Globais do WhatsApp
// ================================================================
// Monitora mensagens do WhatsApp em TODAS as páginas do admin
// Toca som, mostra notificação e pisca título quando receber mensagem
// ================================================================

'use client'

import { useEffect } from 'react'
import { useWhatsAppNotifications } from '@/hooks/useWhatsAppNotifications'
import { useNotifications } from '@/components/NotificationProvider'
import { supabase } from '@/lib/supabase'
import type { WhatsAppMessage } from '@/lib/types/whatsapp'
import { getDisplayContactName } from '@/lib/utils/contact-name-mapper'

const normalizeFromMe = (value: unknown) =>
  value === true || value === 'true' || value === 1 || value === '1'

export function WhatsAppNotificationProvider({ children }: { children: React.ReactNode }) {
  const whatsappNotifications = useWhatsAppNotifications()
  const { addNotification } = useNotifications()

  useEffect(() => {
    // Capturar timestamp do momento do login
    const loginTimestamp = new Date().toISOString()
    console.log('🔌 [WhatsApp Global] Conectando ao Supabase Realtime...')
    console.log('🕐 [WhatsApp Global] Só notificar mensagens criadas após:', loginTimestamp)

    const channel = supabase
      .channel('whatsapp-global-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'whatsapp_messages'
        },
        async (payload: any) => {
          console.log('📩 [WhatsApp Global] Nova mensagem recebida:', payload.new)

          const newMessage = payload.new as WhatsAppMessage
          const fromMe = normalizeFromMe(newMessage.from_me)

          // 🔥 IMPORTANTE: Verificar se a mensagem é realmente nova (criada após login)
          const messageTimestamp = newMessage.timestamp || newMessage.created_at
          if (messageTimestamp && messageTimestamp < loginTimestamp) {
            console.log('⏭️ [WhatsApp Global] Mensagem antiga (anterior ao login), ignorando notificação')
            return
          }

          // Apenas notificar mensagens recebidas (não enviadas por nós)
          if (fromMe) {
            console.log('⏭️ [WhatsApp Global] Mensagem enviada por mim, ignorando notificação')
            return
          }

          // Buscar dados do contato para nome correto
          const { data: contact } = await supabase
            .from('whatsapp_contacts')
            .select('name, push_name, remote_jid')
            .eq('remote_jid', newMessage.remote_jid)
            .single()

          console.log('📋 [WhatsApp Global] Dados do contato:', {
            contact,
            remote_jid: newMessage.remote_jid,
            message_type: newMessage.message_type,
            content: newMessage.content?.substring(0, 50)
          })

          // Usar função de mapeamento para corrigir nomes
          const contactName = getDisplayContactName(
            contact?.push_name,
            newMessage.remote_jid
          )

          // Preparar conteúdo da mensagem
          let messageContent = newMessage.content || '[Mídia]'

          // Se for mídia, usar tipo
          if (newMessage.message_type !== 'text') {
            const typeLabels: Record<string, string> = {
              image: '📷 Imagem',
              video: '🎥 Vídeo',
              audio: '🎵 Áudio',
              document: '📄 Documento',
              sticker: '🎨 Sticker'
            }
            messageContent = typeLabels[newMessage.message_type] || '[Mídia]'
          }

          // 🔥 IMPORTANTE: Validar que temos dados antes de notificar
          if (!contactName || !contactName.trim() || !messageContent || !messageContent.trim()) {
            console.warn('⚠️ [WhatsApp Global] Notificação ignorada - dados inválidos:', { 
              contactName, 
              messageContent: messageContent?.substring(0, 30) 
            })
            return
          }

          console.log('🔔 [WhatsApp Global] Disparando notificação:', {
            contactName,
            messagePreview: messageContent.substring(0, 30),
            remoteJid: newMessage.remote_jid
          })

          // Disparar notificação (som + browser + título piscante)
          whatsappNotifications.notify(
            contactName,
            messageContent,
            newMessage.remote_jid,
            // Adicionar também ao centro de notificações (sininho)
            (title: string, message: string) => {
              addNotification({
                title,
                message,
                type: 'whatsapp_message',
                metadata: {
                  whatsapp_remote_jid: newMessage.remote_jid,
                  whatsapp_message_id: newMessage.message_id || newMessage.id
                }
              })
            }
          )
        }
      )
      .subscribe((status: any) => {
        console.log('📡 [WhatsApp Global] Status da conexão Realtime:', status)
        if (status === 'SUBSCRIBED') {
          console.log('✅ [WhatsApp Global] Conectado ao Supabase Realtime!')
        }
      })

    // Cleanup: Remover canal ao desmontar componente
    return () => {
      console.log('🔌 [WhatsApp Global] Desconectando do Supabase Realtime...')
      supabase.removeChannel(channel)
    }
  }, [whatsappNotifications, addNotification])

  return <>{children}</>
}
