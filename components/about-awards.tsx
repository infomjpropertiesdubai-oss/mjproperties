"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Trophy, Star, Medal, Crown, Target } from "lucide-react"

const awards = [
  {
    title: "Best Luxury Real Estate Agency",
    year: "2023",
    organization: "Dubai Property Awards",
    icon: Crown,
    color: "from-yellow-400 to-yellow-600",
    description: "Recognized for excellence in luxury property sales and client service"
  },
  {
    title: "Top Performer Award",
    year: "2022",
    organization: "Emaar Properties",
    icon: Trophy,
    color: "from-blue-500 to-blue-700",
    description: "Highest sales volume and customer satisfaction in Emaar developments"
  },
  {
    title: "Excellence in Service",
    year: "2021",
    organization: "Dubai Land Department",
    icon: Medal,
    color: "from-green-500 to-green-700",
    description: "Outstanding service delivery and regulatory compliance"
  },
  {
    title: "Customer Choice Award",
    year: "2020",
    organization: "Property Finder",
    icon: Star,
    color: "from-purple-500 to-purple-700",
    description: "Highest customer ratings and reviews on Property Finder platform"
  },
  {
    title: "Innovation in Real Estate",
    year: "2019",
    organization: "Dubai Real Estate Institute",
    icon: Target,
    color: "from-red-500 to-red-700",
    description: "Pioneering digital marketing and virtual tour technologies"
  },
  {
    title: "Rising Star Agency",
    year: "2018",
    organization: "Arabian Business",
    icon: Award,
    color: "from-teal-500 to-teal-700",
    description: "Fastest growing real estate agency in Dubai"
  }
]

const certifications = [
  {
    name: "RERA Certified",
    description: "Dubai Real Estate Regulatory Authority",
    logo: "RERA"
  },
  {
    name: "ISO 9001:2015",
    description: "Quality Management System",
    logo: "ISO"
  },
  {
    name: "Dubai Chamber",
    description: "Member of Dubai Chamber of Commerce",
    logo: "DCC"
  },
  {
    name: "REID",
    description: "Real Estate Institute of Dubai",
    logo: "REID"
  }
]

export function AboutAwards() {
  return (
    <section className="py-20 bg-mj-teal">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-mj-gold/10 text-mj-gold border-mj-gold/20 px-4 py-2 text-sm font-medium mb-4">
            Recognition & Awards
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Industry <span className="text-mj-gold">Recognition</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our commitment to excellence has been recognized by leading industry organizations and satisfied clients
          </p>
        </div>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {awards.map((award, index) => (
            <Card 
              key={index} 
              className="bg-mj-teal border-mj-gold/20 hover:border-mj-gold/40 transition-all duration-300 group hover:shadow-xl hover:scale-105"
            >
              <CardContent className="p-8 text-center space-y-6">
                <div className="flex justify-center">
                  <div className={`p-4 rounded-full bg-gradient-to-r ${award.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                    <award.icon className="h-10 w-10" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Badge variant="outline" className="text-mj-gold border-mj-gold/40">
                    {award.year}
                  </Badge>
                  <h3 className="text-xl font-bold text-mj-teal group-hover:text-mj-gold transition-colors">
                    {award.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {award.description}
                  </p>
                  <div className="text-mj-gold font-semibold">
                    {award.organization}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Certifications */}
        <div className="bg-mj-teal/5 rounded-2xl p-8 md:p-12 border border-mj-gold/20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">
              Professional <span className="text-mj-gold">Certifications</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our team holds industry-recognized certifications ensuring the highest standards of service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="bg-mj-teal border-mj-gold/20 hover:border-mj-gold/40 transition-all duration-300 group">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-mj-gold/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-mj-gold/20 transition-colors">
                    <span className="text-mj-gold font-bold text-lg">{cert.logo}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-mj-teal mb-2">{cert.name}</h4>
                    <p className="text-muted-foreground text-sm">{cert.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="mt-16 text-center">
          <div className="bg-mj-teal rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 opacity-10">
              <Award className="w-32 h-32 text-mj-gold" />
            </div>
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="p-3 rounded-full bg-mj-gold/20">
                  <Star className="w-8 h-8 text-mj-gold" />
                </div>
              </div>
              <blockquote className="text-2xl md:text-3xl font-medium text-white/90 mb-6 max-w-4xl mx-auto leading-relaxed">
                "MJ Properties has consistently demonstrated excellence in luxury real estate services, 
                setting new standards for client satisfaction and market expertise."
              </blockquote>
              <div className="text-mj-gold font-semibold text-lg">
                Dubai Property Awards Committee
              </div>
              <div className="text-white/70 text-sm mt-2">
                2023 Industry Recognition
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold">
              Experience Award-Winning <span className="text-mj-gold">Service</span>
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our satisfied clients and experience the service that has earned us industry recognition
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-mj-gold hover:bg-mj-gold-light text-mj-teal font-semibold">
                Start Your Journey
              </Button>
              <Button variant="outline" className="border-mj-gold/40 text-mj-gold hover:bg-mj-gold/10">
                View Our Portfolio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
