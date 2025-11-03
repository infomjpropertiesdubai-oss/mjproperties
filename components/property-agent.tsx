"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MessageCircle } from "lucide-react"

interface PropertyAgentProps {
  agent: {
    name: string
    title: string
    phone: string
    email: string
    image: string
    whatsapp: string
  }
}

export function PropertyAgent({ agent }: PropertyAgentProps) {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi, I'm interested in this property. Can you provide more details?")
    window.open(`https://wa.me/${agent.whatsapp}?text=${message}`, "_blank")
  }

  const handlePhoneClick = () => {
    window.open(`tel:${agent.phone}`, "_self")
  }

  const handleEmailClick = () => {
    window.open(`mailto:${agent.email}`, "_self")
  }

  return (
    <Card className="border-mj-gold/20 pt-6">
      <CardHeader>
        <CardTitle>Contact Agent</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 overflow-hidden rounded-full">
            <Image src={agent.image || "/placeholder.svg"} alt={agent.name} fill className="object-cover" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{agent.name}</h3>
            <p className="text-muted-foreground">{agent.title}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={handleWhatsAppClick} className="w-full bg-mj-gold hover:bg-mj-gold/90 text-mj-teal cursor-pointer">
            <MessageCircle className="mr-2 h-4 w-4" />
            WhatsApp Agent
          </Button>

          <Button
            onClick={handlePhoneClick}
            variant="outline"
            className="w-full border-mj-gold/40 hover:bg-mj-gold/10 bg-transparent"
          >
            <Phone className="mr-2 h-4 w-4" />
            Call Now
          </Button>

          <Button
            onClick={handleEmailClick}
            variant="outline"
            className="w-full border-mj-gold/40 hover:bg-mj-gold/10 bg-transparent"
          >
            <Mail className="mr-2 h-4 w-4" />
            Send Email
          </Button>
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{agent.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>{agent.email}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
