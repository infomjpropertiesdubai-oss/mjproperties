"use client"

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useShare, ShareData } from "@/hooks/use-share"
import { 
  FaWhatsapp, 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaEnvelope, 
  FaCopy,
  FaShareAlt,
  FaTimes
} from "react-icons/fa"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  shareData: ShareData
}

export function ShareModal({ isOpen, onClose, shareData }: ShareModalProps) {
  const { 
    shareViaWhatsApp,
    shareViaFacebook,
    shareViaTwitter,
    shareViaLinkedIn,
    shareViaEmail,
    copyToClipboard,
    isSharing
  } = useShare()

  const [copied, setCopied] = useState(false)
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareData, {
      onSuccess: () => {
        toast({
          title: "Link copied!",
          description: "Property link has been copied to your clipboard.",
        })
        if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
        setCopied(true)
        copyTimeoutRef.current = setTimeout(() => setCopied(false), 1500)
      },
      onError: () => {
        toast({
          title: "Copy failed",
          description: "Failed to copy link to clipboard. Please try again.",
          variant: "destructive",
        })
      }
    })
  }

  const handleWhatsAppShare = () => {
    shareViaWhatsApp(shareData)
    onClose()
  }

  const handleFacebookShare = () => {
    shareViaFacebook(shareData)
    onClose()
  }

  const handleTwitterShare = () => {
    shareViaTwitter(shareData)
    onClose()
  }

  const handleLinkedInShare = () => {
    shareViaLinkedIn(shareData)
    onClose()
  }

  const handleEmailShare = () => {
    shareViaEmail(shareData)
    onClose()
  }

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      onClick: handleWhatsAppShare,
      className: 'hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30'
    },
    {
      name: 'Facebook',
      icon: FaFacebookF,
      onClick: handleFacebookShare,
      className: 'hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/30'
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      onClick: handleTwitterShare,
      className: 'hover:bg-sky-500/10 hover:text-sky-500 hover:border-sky-500/30'
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedinIn,
      onClick: handleLinkedInShare,
      className: 'hover:bg-blue-600/10 hover:text-blue-600 hover:border-blue-600/30'
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      onClick: handleEmailShare,
      className: 'hover:bg-gray-500/10 hover:text-gray-300 hover:border-gray-500/30'
    },
    {
      name: 'Copy Link',
      icon: FaCopy,
      onClick: handleCopyLink,
      className: 'hover:bg-mj-gold/10 hover:text-mj-gold hover:border-mj-gold/30'
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-mj-dark border-mj-gold/20 text-mj-white max-w-sm p-4">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-mj-gold text-base">
            <FaShareAlt className="text-sm" />
            Share Property
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          {/* Property Info - Compact */}
          <div className="p-2 bg-mj-teal-dark/30 rounded border border-mj-gold/10">
            <h4 className="font-medium text-mj-gold text-sm line-clamp-1">
              {shareData.title}
            </h4>
          </div>

          {/* Share Options Grid - More compact */}
          <div className="grid grid-cols-3 gap-2">
            {shareOptions.map((option) => {
              const IconComponent = option.icon
              return (
                <Button
                  key={option.name}
                  variant="outline"
                  className={`flex flex-col items-center gap-1 h-auto py-2 px-1 border-mj-gold/20 bg-mj-teal-dark/20 text-mj-white transition-all duration-300 cursor-pointer ${option.className} `}
                  onClick={option.onClick}
                  disabled={isSharing}
                >
                  <IconComponent className="text-sm" />
                  <span className="text-[10px] font-medium leading-tight">{option.name}</span>
                </Button>
              )
            })}
          </div>

          {/* URL Display - Compact */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-mj-gold">URL:</label>
            <div className="flex items-center gap-1 p-1.5 bg-mj-teal-dark/20 rounded border border-mj-gold/10">
              <input
                type="text"
                value={shareData.url}
                readOnly
                className="flex-1 bg-transparent text-mj-white/80 text-xs outline-none truncate"
              />
              <div className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-5 w-5 p-0 text-mj-gold hover:bg-mj-gold/10 cursor-pointer"
                  onClick={handleCopyLink}
                  disabled={isSharing}
                >
                  <FaCopy className="text-[10px]" />
                </Button>
                {copied ? (
                  <div className="absolute right-0 -top-6 px-1.5 py-0.5 rounded bg-mj-gold text-mj-dark text-xs font-semibold shadow-md">
                    Copied!
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
