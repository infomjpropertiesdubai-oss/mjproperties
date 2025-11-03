import { Button } from "@/components/ui/button"
import { getCachedCompanySettings } from "@/lib/settings"
import { Phone, Mail, MessageCircle } from "lucide-react"

export async function CTASection() {
  const settings = await getCachedCompanySettings()

  const companyPhone = settings?.company_phone || "+971 50 123 4567";
  const whatsApp = settings?.whatsapp || "+971501234567";
  const email = settings?.company_email || "mj_properties@gmail.com";

  return (
    <section className="py-16 bg-mj-teal">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-4xl font-bold text-white">Ready to Find Your Dream Property?</h2>
            <p className="text-sm md:text-base text-mj-gold max-w-2xl mx-auto">
              Get in touch with our expert team for a consultation and personalized property recommendations.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-mj-gold text-mj-teal hover:bg-mj-gold/90 text-sm md:text-base"
              asChild
            >
              <a href={`tel:${companyPhone.replace(/\s/g, "")}`}>
                <Phone className="mr-2 h-5 w-5" />
                <span className="hidden md:inline text-sm md:text-base"> Call Now: </span> {companyPhone}
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-mj-gold text-mj-gold hover:bg-mj-gold/10 bg-transparent text-sm md:text-base"
              asChild
            >
              <a href={`mailto:${email}`}>
              <Mail className="mr-2 h-5 w-5" />
              <span className="hidden md:inline text-sm md:text-base"> Email Consultation: </span> {email}
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-mj-gold text-mj-gold hover:bg-mj-gold/10 bg-transparent text-sm md:text-base  "
              asChild
            >
              <a
              href={`https://wa.me/${whatsApp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              >
              <MessageCircle className="mr-2 h-5 w-5" />
              <span className="hidden md:inline text-sm md:text-base"> WhatsApp: </span> {whatsApp}
              </a>
            </Button>
          </div>

          <div className="pt-8 border-t border-mj-gold/20">
            <p className="text-mj-gold/80">Available 24/7 • Consultation • No Hidden Fees</p>
          </div>
        </div>
      </div>
    </section>
  )
}
