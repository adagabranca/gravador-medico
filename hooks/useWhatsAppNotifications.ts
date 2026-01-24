// ================================================================
// Hook: Notificações do WhatsApp
// ================================================================
// Gerencia notificações de navegador, som e título piscante
// Funciona mesmo quando o usuário está em outra aba!
// ================================================================

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// Som de notificação (beep curto)
const NOTIFICATION_SOUND = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTUIGGe57OScTgwNUKbj8LNkHQU2kNXxy34sBiR1xe/glEILFF+16+2qWRQLRp/g8r1sIQQpfs3y2Ik3CBdmuuvjm08MDU+l4u+yZB4FNo/U8ct9KwUkdMPu34tBCxResuvqpVYVC0Wc3vK7ax8EJ3vL8tuLOAcXZbjr4ppPDA1PpOLvsGMeBTWO0/DLfSsFJHPC7d6JQQsUXbDp6aRUFApEm93xumgdBSZ4yPHaizsIF2W16+GZTgwMTqPh7a5hGwU0jdHuxHspBSNzwOzdiUALE1yv6OiiUhIKQ5rc8bdnHAQldsfx2Yo4CBZjtunfmE0LDEyh4OytYBoFM4zP7cF5KAUicL7q3IY/CxNbrejnnlAQCUIa2/G1ZRsFJHXF8NiIOQgVYbbp3pZMCwxMoN/sqV8aBTKLzuy/dycEIW++6tqFPgsTV6zn5ptPEAhBGdnxs2McBSJ0w+/Xhj4IFGCz6d6USwsMSp7e6qdeGQQxiszqvXYnBCBsvOnag0wKE1Wr5uaaTQ8JP5fX8LFhGgQgcsLu1oU9BxNesundkkoLDEie3emnXBgEL4fL6bl0JgQfasvk2IFLChRTqOTomEwOCT6W1u+uXxcEH3DA7NSEOwcTXbHo3I9JCwxHnNzoo1sZBCyEyua3dCUEHmjK49aBSgoUUqfl5ZZLDgo+ldTtqVwWBB1uv+vSgzsHE1uw6NuNSAsLR5rb551aGAQsgsXktXMkBB1nyePVfkgKFFGl4+OUSQsKPZLT7aZbFgQcbL7q0YI6BxJar+fai0gLC0aZ2uadWRgEK4HE46txJAQcZsjh030nChNQouLhkkcLCj2R0uyjWRQEG2q96NBBOQcSWa7m2YlGCwtFltnmm1gYBCp/wuGnbyMEHGXG4NJ5JgoTT6Dh35BHCgk8kNDroVkUBBpouuvNQTgHEliu5deJRQoMRJXZ5ZhXFwQqfsDgpG4iAxpkxN7PeCUKE06f4N6PRwoJO4/P6p9YEwQZZ+nqyz43BxJXreTWiEQKC0SU2OOWVhYEKX684qNtIgMaY8Pcz3YkChNNnN7djkYKCDqOzumcVhMEGGXo6so9NwcSVqzj1YZDCgtDk9filVQWBCh6vOGhaxoCA2LB29J1IwoSTJvd3IxFCQc5jc3om1YSAxdj5unINjYHElSr4tOFQgoLQpLW45RUFQMHV/q1/z8hAwAA'

export function useWhatsAppNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isTabVisible, setIsTabVisible] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const originalTitleRef = useRef<string>('')
  const titleIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // ================================================================
  // Inicializar áudio e solicitar permissão
  // ================================================================
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Salvar título original
    originalTitleRef.current = document.title

    // Inicializar áudio
    audioRef.current = new Audio(NOTIFICATION_SOUND)
    audioRef.current.volume = 0.5

    // Solicitar permissão de notificação
    if ('Notification' in window) {
      setPermission(Notification.permission)

      if (Notification.permission === 'default') {
        Notification.requestPermission().then((perm) => {
          setPermission(perm)
          console.log('🔔 Permissão de notificação:', perm)
        })
      }
    }

    // Cleanup
    return () => {
      stopTitleBlink()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // ================================================================
  // Monitorar visibilidade da aba
  // ================================================================
  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden
      setIsTabVisible(visible)

      // Quando o usuário voltar para a aba, parar de piscar
      if (visible) {
        stopTitleBlink()
      }
    }

    const handleFocus = () => {
      setIsTabVisible(true)
      stopTitleBlink()
    }

    const handleBlur = () => {
      setIsTabVisible(false)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  // ================================================================
  // Tocar som de notificação
  // ================================================================
  const playSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch((err) => {
        console.warn('⚠️ Erro ao tocar som de notificação:', err)
      })
    }
  }, [])

  // ================================================================
  // Parar título piscante
  // ================================================================
  const stopTitleBlink = useCallback(() => {
    if (titleIntervalRef.current) {
      clearInterval(titleIntervalRef.current)
      titleIntervalRef.current = null
    }
    document.title = originalTitleRef.current
  }, [])

  // ================================================================
  // Iniciar título piscante
  // ================================================================
  const startTitleBlink = useCallback((message: string) => {
    stopTitleBlink()

    let isOriginal = true
    titleIntervalRef.current = setInterval(() => {
      document.title = isOriginal ? `💬 ${message}` : originalTitleRef.current
      isOriginal = !isOriginal
    }, 1000)
  }, [stopTitleBlink])

  // ================================================================
  // Função principal: notificar nova mensagem
  // ================================================================
  const notify = useCallback((
    contactName: string,
    messageContent: string,
    remoteJid: string,
    onAddToNotificationCenter?: (title: string, message: string) => void
  ) => {
    const shouldNotify = !isTabVisible

    console.log('🔔 [Notificação] Verificando:', {
      contactName,
      messagePreview: messageContent.substring(0, 30),
      isTabVisible,
      shouldNotify,
      permission
    })

    // Se a aba está focada, apenas adicionar ao centro de notificações
    if (isTabVisible) {
      if (onAddToNotificationCenter) {
        onAddToNotificationCenter(
          `Nova mensagem de ${contactName}`,
          messageContent
        )
      }
      return { played: false, notified: false, addedToCenter: true }
    }

    // Tocar som
    playSound()

    // Piscar título da aba
    startTitleBlink(`Nova mensagem de ${contactName}`)

    // Adicionar ao centro de notificações
    if (onAddToNotificationCenter) {
      onAddToNotificationCenter(
        `Nova mensagem de ${contactName}`,
        messageContent
      )
    }

    // Notificação do navegador
    if (permission === 'granted') {
      try {
        const notification = new Notification(`💬 ${contactName}`, {
          body: messageContent.length > 100
            ? messageContent.substring(0, 100) + '...'
            : messageContent,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
          tag: remoteJid, // Agrupa notificações do mesmo contato
          requireInteraction: false,
          silent: true // Já tocamos nosso próprio som
        })

        notification.onclick = () => {
          window.focus()
          stopTitleBlink()
          notification.close()

          // Navegar para o chat
          const currentUrl = new URL(window.location.href)
          currentUrl.searchParams.set('chat', remoteJid)
          window.history.pushState({}, '', currentUrl.toString())

          // Disparar evento customizado para abrir o chat
          window.dispatchEvent(new CustomEvent('open-whatsapp-chat', {
            detail: { remoteJid }
          }))
        }

        // Auto-fechar após 5 segundos
        setTimeout(() => notification.close(), 5000)
      } catch (err) {
        console.warn('⚠️ Erro ao criar notificação:', err)
      }
    }

    return { played: true, notified: shouldNotify, addedToCenter: true }
  }, [isTabVisible, permission, playSound, startTitleBlink, stopTitleBlink])

  return {
    permission,
    notify,
    playSound,
    startTitleBlink,
    stopTitleBlink,
    isTabVisible,
    requestPermission: () => {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        return Notification.requestPermission().then((perm) => {
          setPermission(perm)
          return perm
        })
      }
      return Promise.resolve('denied' as NotificationPermission)
    }
  }
}
