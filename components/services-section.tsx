import { Card, CardContent } from "@/components/ui/card"
import { Home, Building2, Key, MapPin, Settings, TrendingUp, FileText, Compass } from "lucide-react"

const services = [
  {
    icon: Home,
    title: "Residential Buying & Selling",
    description: "Expert guidance for buying and selling residential properties with personalized service and market expertise.",
  },
  {
    icon: Building2,
    title: "Commercial Property Solutions",
    description: "Comprehensive commercial real estate services for offices, retail spaces, and industrial properties.",
  },
  {
    icon: Key,
    title: "Property Rentals & Leasing",
    description: "Professional rental and leasing services for both tenants and property owners.",
  },
  {
    icon: MapPin,
    title: "Land & Plot Sales",
    description: "Specialized services for land acquisition, plot sales, and development opportunities.",
  },
  {
    icon: Settings,
    title: "Property Management Services",
    description: "Complete property management solutions to maximize your investment returns and property value.",
  },
  {
    icon: TrendingUp,
    title: "Real Estate Investment Advisory",
    description: "Expert investment advice and market analysis to help you make informed property investment decisions.",
  },
  {
    icon: FileText,
    title: "Legal & Documentation Support",
    description: "Comprehensive legal support and documentation services throughout your property transactions.",
  },
  {
    icon: Compass,
    title: "Project Marketing & Sales Support",
    description: "Professional marketing and sales support for real estate projects and developments.",
  },
]

export function ServicesSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-mj-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
            Our <span className="text-mj-gold">Services</span>
          </h2>
          <p className="text-xs md:text-base text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
            Comprehensive real estate solutions tailored to meet all your property needs with professional expertise and personalized service.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6">
          {services.map((service, index) => (
            <Card key={index} className="bg-card border-mj-gold/20 hover:border-mj-gold hover:shadow-lg hover:shadow-mj-gold/20 transition-colors group p-0">
              <CardContent className="p-2 md:p-6 text-center">
                <div className="mb-2 md:mb-3 flex justify-center">
                  <div className="p-2 sm:p-3 rounded-full bg-mj-gold/10 group-hover:bg-mj-gold/20 transition-colors">
                    <service.icon className="h-4 w-4 md:h-6 md:w-6 text-mj-gold" />
                  </div>
                </div>
                <h3 className="text-sm md:text-lg font-semibold mb-2 sm:mb-3 group-hover:text-mj-gold transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
