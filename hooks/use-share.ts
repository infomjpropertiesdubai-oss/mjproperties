import { useState } from 'react'

export interface ShareData {
  title: string
  text?: string
  url: string
}

export interface ShareOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
  fallbackMessage?: string
}

export function useShare() {
  const [isSharing, setIsSharing] = useState(false)
  const [shareError, setShareError] = useState<string | null>(null)

  const shareViaWebAPI = async (data: ShareData, options?: ShareOptions) => {
    try {
      setIsSharing(true)
      setShareError(null)

      if (navigator.share) {
        await navigator.share({
          title: data.title,
          text: data.text,
          url: data.url,
        })
        options?.onSuccess?.()
        return true
      }
      return false
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setShareError(error.message)
        options?.onError?.(error)
      }
      return false
    } finally {
      setIsSharing(false)
    }
  }

  const shareViaWhatsApp = (data: ShareData) => {
    const message = encodeURIComponent(
      `${data.title}\n\n${data.text || ''}\n\n${data.url}`
    )
    const whatsappUrl = `https://wa.me/?text=${message}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  const shareViaEmail = (data: ShareData) => {
    const subject = encodeURIComponent(data.title)
    const body = encodeURIComponent(
      `${data.text || ''}\n\nCheck out this property: ${data.url}`
    )
    const emailUrl = `mailto:?subject=${subject}&body=${body}`
    window.location.href = emailUrl
  }

  const shareViaFacebook = (data: ShareData) => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`
    window.open(facebookUrl, '_blank', 'noopener,noreferrer,width=600,height=400')
  }

  const shareViaTwitter = (data: ShareData) => {
    const text = encodeURIComponent(`${data.title} ${data.text || ''}`)
    const url = encodeURIComponent(data.url)
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
    window.open(twitterUrl, '_blank', 'noopener,noreferrer,width=600,height=400')
  }

  const shareViaLinkedIn = (data: ShareData) => {
    const url = encodeURIComponent(data.url)
    const title = encodeURIComponent(data.title)
    const summary = encodeURIComponent(data.text || '')
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer,width=600,height=400')
  }

  const copyToClipboard = async (data: ShareData, options?: ShareOptions) => {
    try {
      setIsSharing(true)
      setShareError(null)

      const textToCopy = `${data.title}\n\n${data.text || ''}\n\n${data.url}`
      
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy)
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = textToCopy
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
      }
      
      options?.onSuccess?.()
      return true
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to copy to clipboard')
      setShareError(err.message)
      options?.onError?.(err)
      return false
    } finally {
      setIsSharing(false)
    }
  }

  const share = async (data: ShareData, options?: ShareOptions) => {
    // Try native share API first
    const nativeShareWorked = await shareViaWebAPI(data, options)
    
    if (!nativeShareWorked) {
      // Fallback to copy to clipboard
      return await copyToClipboard(data, {
        ...options,
        onSuccess: () => {
          options?.onSuccess?.()
        }
      })
    }
    
    return true
  }

  return {
    share,
    shareViaWebAPI,
    shareViaWhatsApp,
    shareViaEmail,
    shareViaFacebook,
    shareViaTwitter,
    shareViaLinkedIn,
    copyToClipboard,
    isSharing,
    shareError,
  }
}
