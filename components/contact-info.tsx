"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react"
import { CompanySettings } from "@/lib/settings"

interface ContactInfoProps {
  settings: CompanySettings | null
}

export function ContactInfo({ settings }: ContactInfoProps) {
  const companyPhone = settings?.company_phone || "+971 50 123 4567"
  const companyEmail = settings?.company_email || "info@mjproperties.ae"
  const companyAddress = settings?.company_address || "Suite 1205, Business Bay Tower, Business Bay, Dubai, UAE, P.O. Box 12345"
  const whatsapp = settings?.whatsapp || "+971501234567"

  // Clean whatsapp number for URL (remove spaces, hyphens, etc.)
  const cleanWhatsapp = whatsapp.replace(/[\s-]/g, "")

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Contact Details */}
      <Card className="border-mj-gold/20 pt-4 sm:pt-8">
        <CardHeader className="">
          <CardTitle className="text-lg sm:text-xl">Get in Touch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 p-2 sm:p-3 rounded-full bg-mj-gold/10">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-mj-gold" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base">Phone</p>
                <a 
                  href={`tel:${companyPhone}`}
                  className="text-muted-foreground hover:text-mj-gold transition-colors block text-sm sm:text-base break-all"
                >
                  {companyPhone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 p-2 sm:p-3 rounded-full bg-mj-gold/10">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-mj-gold" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base">Email</p>
                <a 
                  href={`mailto:${companyEmail}`}
                  className="text-muted-foreground hover:text-mj-gold transition-colors block text-sm sm:text-base break-all"
                >
                  {companyEmail}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 p-2 sm:p-3 rounded-full bg-mj-gold/10">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-mj-gold" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base">Office Address</p>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {companyAddress}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-mj-gold/20">
            <Button
              size="lg"
              className="w-full bg-mj-gold hover:bg-mj-gold/90 text-mj-teal cursor-pointer text-sm sm:text-base py-3 sm:py-4"
              onClick={() => window.open(`https://wa.me/${cleanWhatsapp}`, "_blank")}
            >
              <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              WhatsApp Us
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <Button
                size="lg"
                variant="outline"
                className="border-mj-gold/40 hover:bg-mj-gold/10 bg-transparent text-sm sm:text-base py-3 sm:py-4"
                onClick={() => window.open(`tel:${companyPhone}`, "_self")}
              >
                <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Call Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-mj-gold/40 hover:bg-mj-gold/10 bg-transparent text-sm sm:text-base py-3 sm:py-4"
                onClick={() => window.open(`mailto:${companyEmail}`, "_self")}
              >
                <Mail className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
