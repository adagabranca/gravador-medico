// ================================================================
// Notification Provider - Context para notificações globais
// ================================================================

'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef } from 'react'
import type { Notification, NotificationContextValue } from '@/lib/types/notifications'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { WhatsAppMessage } from '@/lib/types/whatsapp'
import type { AdminChatMessage } from '@/lib/types/admin-chat'

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

// Armazenamento global para evitar duplicatas mesmo após recarregar
const globalSeenNotifications = new Set<string>()

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const lastWhatsAppMessageIdRef = useRef<string | null>(null)
  const lastAdminChatMessageIdRef = useRef<string | null>(null)
  const seenNotificationsRef = useRef<Set<string>>(globalSeenNotifications)
  const isSubscribedRef = useRef<boolean>(false)
  const isBootstrappedRef = useRef<boolean>(false) // 🔥 Flag para indicar que bootstrap terminou
  const bootstrapTimestampRef = useRef<string | null>(null) // 🔥 Timestamp do bootstrap para validar mensagens

  // Calcular não lidas
  const unreadCount = notifications.filter(n => !n.read).length

  // Limitar a 25 notificações mais recentes
  const MAX_NOTIFICATIONS = 25

  const normalizeFromMe = (value: unknown) =>
    value === true || value === 'true' || value === 1 || value === '1'

  const getDedupeKey = (
    notification: Omit<Notification, 'id' | 'created_at' | 'read'>
  ) => {
    const meta = notification.metadata
    if (notification.type === 'whatsapp_message' && meta?.whatsapp_message_id) {
      return `whatsapp:${meta.whatsapp_message_id}`
    }
    if (notification.type === 'admin_chat_message' && meta?.admin_chat_message_id) {
      return `admin_chat:${meta.admin_chat_message_id}`
    }
    return null
  }

  // Adicionar notificação
  const addNotification = useCallback((
    notification: Omit<Notification, 'id' | 'created_at' | 'read'>
  ) => {
    const dedupeKey = getDedupeKey(notification)
    if (dedupeKey) {
      const seen = seenNotificationsRef.current
      if (seen.has(dedupeKey)) {
        return
      }
      seen.add(dedupeKey)
      if (seen.size > 1000) {
        seen.clear()
        seen.add(dedupeKey)
      }
    }

    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      read: false
    }

    // Adicionar e limitar a 25 notificações
    setNotifications(prev => {
      const updated = [newNotification, ...prev]
      return updated.slice(0, MAX_NOTIFICATIONS)
    })

    // Toast visual
    const toastTitle = notification.title
    const toastMessage = notification.message

    console.log('🎨 [Toast] Preparando toast:', { 
      toastTitle, 
      toastMessage,
      titleValid: !!(toastTitle && toastTitle.trim()),
      messageValid: !!(toastMessage && toastMessage.trim())
    })

    // 🔥 IMPORTANTE: Só mostrar toast se tiver título e mensagem válidos
    if (toastTitle && toastTitle.trim() && toastMessage && toastMessage.trim()) {
      console.log('✅ [Toast] Mostrando toast:', { toastTitle, toastMessage: toastMessage.substring(0, 30) })
      toast.success(toastTitle, {
        description: toastMessage,
        duration: 5000,
        closeButton: true, // ✅ Adiciona botão X para fechar
        action: notification.metadata ? {
          label: 'Ver',
          onClick: () => {
            // Redirecionar baseado no tipo
            const meta = notification.metadata
            if (!meta) return
            
            if (notification.type === 'whatsapp_message' && meta.whatsapp_remote_jid) {
              window.location.href = `/admin/whatsapp?chat=${encodeURIComponent(meta.whatsapp_remote_jid)}`
            } else if (notification.type === 'admin_chat_message' && meta.admin_chat_conversation_id) {
              window.location.href = `/admin/chat?conversation=${meta.admin_chat_conversation_id}`
            }
          }
        } : undefined
      })
    } else {
      console.warn('⚠️ Toast ignorado - título ou mensagem vazio:', { toastTitle, toastMessage })
    }

    // Notificação do navegador (se permitido)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(toastTitle, {
        body: toastMessage,
        icon: notification.metadata?.profile_picture_url || '/favicon.ico',
        badge: '/favicon.ico',
        tag: newNotification.id
      })
    }
  }, [])

  // Marcar como lida
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }, [])

  // Marcar todas como lidas
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  // Limpar todas
  const clearAll = useCallback(() => {
    setNotifications([])
    seenNotificationsRef.current.clear()
  }, [])

  // Pedir permissão para notificações do navegador
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // ================================================================
  // REALTIME: Escutar mensagens WhatsApp e Chat Interno
  // ================================================================
  useEffect(() => {
    // Evitar subscrição dupla
    if (isSubscribedRef.current) {
      console.log('⚠️ NotificationProvider: Já está subscrito, ignorando...')
      return
    }
    isSubscribedRef.current = true
    
    // Capturar timestamp do momento da conexão
    const connectionTimestamp = new Date().toISOString()
    console.log('🔌 NotificationProvider: Conectando ao Realtime...')
    console.log('🕐 NotificationProvider: Só notificar mensagens criadas após:', connectionTimestamp)

    // Canal WhatsApp
    const whatsappChannel = supabase
      .channel('global-whatsapp-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'whatsapp_messages'
        },
        async (payload) => {
          const newMessage = payload.new as WhatsAppMessage
          
          // 🔥 IMPORTANTE: Só notificar APÓS bootstrap completar
          if (!isBootstrappedRef.current) {
            console.log('⏳ [Realtime] Aguardando bootstrap - mensagem ignorada')
            return
          }
          
          // 🔥 IMPORTANTE: Verificar se a mensagem é realmente nova (criada após conexão)
          const messageTimestamp = newMessage.timestamp || newMessage.created_at
          if (messageTimestamp && messageTimestamp < connectionTimestamp) {
            console.log('⏭️ [Realtime] Mensagem antiga (anterior à conexão), ignorando')
            return
          }
          
          // Deduplicação imediata por ID da mensagem
          const msgKey = `whatsapp:${newMessage.id}`
          if (seenNotificationsRef.current.has(msgKey)) {
            console.log('🚫 [Realtime] Duplicata ignorada:', msgKey)
            return
          }
          seenNotificationsRef.current.add(msgKey)
          
          const fromMe = normalizeFromMe(newMessage.from_me)
          lastWhatsAppMessageIdRef.current = newMessage.id
          
          console.log('🔔 [Realtime] Nova mensagem WhatsApp:', {
            from_me: newMessage.from_me,
            content: newMessage.content?.substring(0, 30),
            remote_jid: newMessage.remote_jid
          })
          
          // ⚠️ IMPORTANTE: Só notificar mensagens RECEBIDAS (não enviadas por mim)
          // from_me === true = mensagem enviada pelo SISTEMA
          // from_me === false = mensagem recebida do CLIENTE
          if (fromMe) {
            console.log('🚫 [Realtime] Ignorando notificação (mensagem enviada por mim)')
            return
          }
          
          // Buscar dados do contato
          const { data: contact } = await supabase
            .from('whatsapp_contacts')
            .select('name, push_name, profile_picture_url')
            .eq('remote_jid', newMessage.remote_jid)
            .single()
          
          const contactName = contact?.name || contact?.push_name || newMessage.remote_jid.split('@')[0]
          const messageContent = newMessage.content || '[Mídia]'
          
          // 🔥 IMPORTANTE: Validar que temos dados antes de notificar
          if (!contactName || !messageContent) {
            console.warn('⚠️ [Realtime] Notificação ignorada - dados inválidos:', { contactName, messageContent })
            return
          }
          
          console.log('✅ [Realtime] Criando notificação:', { contactName, messageContent: messageContent.substring(0, 30) })
          
          addNotification({
            type: 'whatsapp_message',
            title: contactName,
            message: messageContent,
            metadata: {
              whatsapp_remote_jid: newMessage.remote_jid,
              whatsapp_message_id: newMessage.id,
              profile_picture_url: contact?.profile_picture_url
            }
          })
        }
      )
      .subscribe((status) => {
        console.log('📡 WhatsApp Realtime:', status)
      })

    // Canal Chat Interno
  const chatChannel = supabase
      .channel('global-admin-chat-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_chat_messages'
        },
        async (payload) => {
          const newMessage = payload.new as AdminChatMessage
          
          // 🔥 IMPORTANTE: Só notificar APÓS bootstrap completar
          if (!isBootstrappedRef.current) {
            console.log('⏳ [Realtime Chat] Aguardando bootstrap - mensagem ignorada')
            return
          }
          
          // 🔥 IMPORTANTE: Verificar se a mensagem é realmente nova (criada após conexão)
          const messageTimestamp = newMessage.created_at
          if (messageTimestamp && messageTimestamp < connectionTimestamp) {
            console.log('⏭️ [Realtime Chat] Mensagem antiga (anterior à conexão), ignorando')
            return
          }
          
          // Deduplicação imediata por ID da mensagem
          const chatKey = `admin_chat:${newMessage.id}`
          if (seenNotificationsRef.current.has(chatKey)) {
            console.log('🚫 [Realtime Chat] Duplicata ignorada:', chatKey)
            return
          }
          seenNotificationsRef.current.add(chatKey)
          
          lastAdminChatMessageIdRef.current = newMessage.id
          
          // Buscar dados do sender
          const { data: sender } = await supabase
            .from('users')
            .select('name, email, avatar_url')
            .eq('id', newMessage.sender_id)
            .single()
          
          const senderName = sender?.name || sender?.email || 'Admin'
          const messageContent = newMessage.content || '[Mídia]'
          
          // 🔥 IMPORTANTE: Validar que temos dados antes de notificar
          if (!senderName || !messageContent) {
            console.warn('⚠️ [Realtime Chat] Notificação ignorada - dados inválidos:', { senderName, messageContent })
            return
          }
          
          console.log('✅ [Realtime Chat] Criando notificação:', { senderName, messageContent: messageContent.substring(0, 30) })
          
          addNotification({
            type: 'admin_chat_message',
            title: senderName,
            message: messageContent,
            metadata: {
              admin_chat_conversation_id: newMessage.conversation_id,
              admin_chat_message_id: newMessage.id,
              profile_picture_url: sender?.avatar_url
            }
          })
        }
      )
      .subscribe((status) => {
        console.log('📡 Admin Chat Realtime:', status)
      })

    return () => {
  supabase.removeChannel(whatsappChannel)
  supabase.removeChannel(chatChannel)
    }
  }, [addNotification])

  // ================================================================
  // FALLBACK: Polling para garantir toasts mesmo se Realtime falhar
  // ================================================================
  useEffect(() => {
    let cancelled = false
    const bootstrapTimestamp = new Date().toISOString()
    bootstrapTimestampRef.current = bootstrapTimestamp // 🔥 Salvar na ref para uso no polling

    const bootstrap = async () => {
      try {
        // Buscar TODAS as mensagens WhatsApp antigas (últimos 5 minutos) e marcar como vistas
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
        const { data: recentMessages } = await supabase
          .from('whatsapp_messages')
          .select('id, timestamp')
          .gte('timestamp', fiveMinutesAgo)
          .order('timestamp', { ascending: false })

        if (!cancelled && recentMessages) {
          recentMessages.forEach(msg => {
            const msgKey = `whatsapp:${msg.id}`
            seenNotificationsRef.current.add(msgKey)
          })
          
          if (recentMessages.length > 0) {
            lastWhatsAppMessageIdRef.current = recentMessages[0].id
            console.log(`🔵 [Bootstrap] ${recentMessages.length} mensagens WhatsApp antigas marcadas como vistas`)
          }
        }
      } catch (err) {
        console.error('❌ [Bootstrap] Erro ao buscar mensagens WhatsApp:', err)
      }

      try {
        // Buscar TODAS as mensagens do chat interno antigas (últimos 5 minutos) e marcar como vistas
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
        const { data: recentChats } = await supabase
          .from('admin_chat_messages')
          .select('id, created_at')
          .gte('created_at', fiveMinutesAgo)
          .order('created_at', { ascending: false })

        if (!cancelled && recentChats) {
          recentChats.forEach(msg => {
            const chatKey = `admin_chat:${msg.id}`
            seenNotificationsRef.current.add(chatKey)
          })
          
          if (recentChats.length > 0) {
            lastAdminChatMessageIdRef.current = recentChats[0].id
            console.log(`🔵 [Bootstrap] ${recentChats.length} mensagens Chat antigas marcadas como vistas`)
          }
        }
      } catch (err) {
        console.error('❌ [Bootstrap] Erro ao buscar mensagens Chat:', err)
      }
      
      // 🔥 IMPORTANTE: Marcar bootstrap como completo ANTES de iniciar polling
      if (!cancelled) {
        // Aguardar 1 segundo para garantir que todas as mensagens antigas foram processadas
        await new Promise(resolve => setTimeout(resolve, 1000))
        isBootstrappedRef.current = true
        console.log('✅ [Bootstrap] Completo - Agora só notifica mensagens criadas após:', bootstrapTimestamp)
      }
    }

    const pollNotifications = async () => {
      // 🔥 IMPORTANTE: Só processar notificações APÓS bootstrap completar
      if (!isBootstrappedRef.current) {
        console.log('⏳ [Polling] Aguardando bootstrap completar...')
        return
      }
      
      try {
        const params = new URLSearchParams({
          lastWhatsAppId: lastWhatsAppMessageIdRef.current || '',
          lastAdminChatId: lastAdminChatMessageIdRef.current || ''
        })

        const response = await fetch(`/api/whatsapp/notifications?${params.toString()}`)
        if (!response.ok) return
        const payload = await response.json()

  const latestWhatsApp = payload?.whatsapp
        if (latestWhatsApp?.id && latestWhatsApp.id !== lastWhatsAppMessageIdRef.current) {
          const fromMe = normalizeFromMe(latestWhatsApp.from_me)

          // 🔥 IMPORTANTE: Verificar se a mensagem é posterior ao bootstrap
          const messageTimestamp = latestWhatsApp.timestamp || latestWhatsApp.created_at
          if (bootstrapTimestampRef.current && messageTimestamp && messageTimestamp < bootstrapTimestampRef.current) {
            console.log('⏭️ [Polling] Mensagem anterior ao bootstrap, ignorando:', {
              messageTimestamp,
              bootstrapTimestamp: bootstrapTimestampRef.current
            })
            // Atualizar o lastId para não processar novamente
            lastWhatsAppMessageIdRef.current = latestWhatsApp.id
            return
          }

          lastWhatsAppMessageIdRef.current = latestWhatsApp.id

          if (!fromMe && latestWhatsApp.remote_jid) {
            const contact = latestWhatsApp.contact || null
            const contactName =
              contact?.name ||
              contact?.push_name ||
              latestWhatsApp.remote_jid.split('@')[0]
            const messageContent = latestWhatsApp.content || '[Mídia]'

            // 🔥 IMPORTANTE: Validar que temos dados antes de notificar
            if (!contactName || !messageContent) {
              console.warn('⚠️ [Polling] Notificação ignorada - dados inválidos:', { contactName, messageContent })
              return
            }

            console.log('✅ [Polling] Nova mensagem WhatsApp detectada:', { contactName, messageContent: messageContent.substring(0, 30) })
            
            addNotification({
              type: 'whatsapp_message',
              title: contactName,
              message: messageContent,
              metadata: {
                whatsapp_remote_jid: latestWhatsApp.remote_jid,
                whatsapp_message_id: latestWhatsApp.id,
                profile_picture_url: contact?.profile_picture_url
              }
            })
          }
        }

        const latestAdminChat = payload?.adminChat
        if (latestAdminChat?.id && latestAdminChat.id !== lastAdminChatMessageIdRef.current) {
          // 🔥 IMPORTANTE: Verificar se a mensagem é posterior ao bootstrap
          const messageTimestamp = latestAdminChat.created_at
          if (bootstrapTimestampRef.current && messageTimestamp && messageTimestamp < bootstrapTimestampRef.current) {
            console.log('⏭️ [Polling Chat] Mensagem anterior ao bootstrap, ignorando:', {
              messageTimestamp,
              bootstrapTimestamp: bootstrapTimestampRef.current
            })
            // Atualizar o lastId para não processar novamente
            lastAdminChatMessageIdRef.current = latestAdminChat.id
            return
          }

          lastAdminChatMessageIdRef.current = latestAdminChat.id
          
          const { data: sender } = await supabase
            .from('users')
            .select('name, email, avatar_url')
            .eq('id', latestAdminChat.sender_id)
            .single()

          const senderName = sender?.name || sender?.email || 'Admin'
          const messageContent = latestAdminChat.content || '[Mídia]'

          // 🔥 IMPORTANTE: Validar que temos dados antes de notificar
          if (!senderName || !messageContent) {
            console.warn('⚠️ [Polling Chat] Notificação ignorada - dados inválidos:', { senderName, messageContent })
            return
          }

          console.log('✅ [Polling] Nova mensagem Chat detectada:', { senderName, messageContent: messageContent.substring(0, 30) })

          addNotification({
            type: 'admin_chat_message',
            title: senderName,
            message: messageContent,
            metadata: {
              admin_chat_conversation_id: latestAdminChat.conversation_id,
              admin_chat_message_id: latestAdminChat.id,
              profile_picture_url: sender?.avatar_url
            }
          })
        }
      } catch {
        // Silenciar erros de polling para evitar ruído no console
      }
    }

    let intervalId: ReturnType<typeof setInterval> | null = null

    bootstrap().finally(() => {
      if (cancelled) return
      intervalId = setInterval(pollNotifications, 8000)
    })

    return () => {
      cancelled = true
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [addNotification])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}
