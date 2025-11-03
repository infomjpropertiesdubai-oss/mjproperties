import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin } from "lucide-react"
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { NewsletterSubscription } from "@/components/newsletter-subscription"
import { getCompanySettings } from "@/lib/settings"

export async function Footer() {
  // Get company settings
  const settings = await getCompanySettings()

  // Fallback values if settings are not available
  const companyName = settings?.company_name ?? "MJ Properties"
  const companyDescription = "Your trusted partner in Dubai real estate. We specialize in luxury properties and provide exceptional service to help you find your dream home."
  const companyPhone = settings?.company_phone ?? "+971 58 842 4517"
  const companyEmail = settings?.company_email ?? "contact@mjproperties.ae"
  const companyAddress = settings?.company_address ?? "Iris Bay Tower- Office: 38, 17th Floor - Al Mustaqbal St - Business Bay - Dubai - UAE"
  const facebookUrl = "http://facebook.com/mjproperties.dubai"
  const instagramUrl = "http://instagram.com/mjproperties_dubai"

  return (
    <footer className="bg-mj-dark border-t border-mj-gold/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/mj-icon.png"
                alt={companyName}
                width={32}
                height={32}
                className="h-8 w-8"
                sizes="32px"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {companyDescription}
            </p>
            <div className="flex space-x-4">
              <Link href={facebookUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer hover:text-blue-600 group" aria-label="Visit our Facebook page">
                  <FaFacebookF className="h-4 w-4 group-hover:scale-110 transition-all duration-300" />
                </Button>
              </Link>
              <Link href={instagramUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-pink-600 cursor-pointer group" aria-label="Visit our Instagram page">
                  <FaInstagram className="h-4 w-4 group-hover:scale-110 transition-all duration-300" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-mj-gold">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/properties"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Properties
              </Link>
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link href="/team" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Our Team
              </Link>
              <Link href="/blog" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
              <Link
                href="/contact"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-mj-gold">Contact Info</h3>
            <div className="space-y-3">
              <Link href={`tel:${companyPhone}`} className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-mj-gold transition-colors">
                <Phone className="h-4 w-4 text-mj-gold" />
                <span>{companyPhone}</span>
              </Link>
              <Link href={`mailto:${companyEmail}`} className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-mj-gold transition-colors">
                <Mail className="h-4 w-4 text-mj-gold" />
                <span>{companyEmail}</span>
              </Link>
              <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-mj-gold mt-0.5" />
                <span className="">{companyAddress}</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-mj-gold">Newsletter</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to get the latest property updates and market insights.
            </p>
            <NewsletterSubscription />
          </div>
        </div>

        <div className="border-t border-mj-gold/20 mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {companyName}. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  )
}
