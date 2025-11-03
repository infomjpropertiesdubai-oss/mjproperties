"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Users, Award, Heart, Zap, Globe, ArrowRight, CheckCircle } from "lucide-react"

const values = [
  {
    icon: Shield,
    title: "Integrity",
    description: "We conduct business with the highest ethical standards and complete transparency in all our dealings.",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    details: [
      "Transparent pricing and fees",
      "Honest property assessments",
      "Ethical business practices",
      "Client confidentiality protection"
    ]
  },
  {
    icon: Users,
    title: "Client-Centric",
    description: "Our clients' needs and satisfaction are at the heart of everything we do, ensuring personalized service.",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    details: [
      "Personalized property matching",
      "24/7 client support",
      "Customized investment strategies",
      "Post-sale follow-up services"
    ]
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for excellence in every aspect of our service, from property selection to closing deals.",
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    details: [
      "Premium property portfolio",
      "Expert market analysis",
      "Professional photography",
      "Quality assurance standards"
    ]
  },
  {
    icon: Heart,
    title: "Passion",
    description: "Our genuine passion for real estate drives us to go above and beyond for our clients.",
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    details: [
      "Enthusiastic property presentations",
      "Passionate market insights",
      "Dedicated client relationships",
      "Continuous learning and growth"
    ]
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "We embrace cutting-edge technology and innovative approaches to enhance the property experience.",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    details: [
      "Virtual property tours",
      "AI-powered property matching",
      "Digital marketing strategies",
      "Smart home technology integration"
    ]
  },
  {
    icon: Globe,
    title: "Local Expertise",
    description: "Deep knowledge of Dubai's real estate market enables us to provide valuable insights and guidance.",
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/20",
    details: [
      "Local market knowledge",
      "Neighborhood insights",
      "Investment opportunities",
      "Regulatory compliance expertise"
    ]
  },
]

export function AboutValues() {
  const [activeValue, setActiveValue] = useState(0)
  const [showDetails, setShowDetails] = useState(false)

  return (
    <section className="py-20 bg-mj-teal">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-mj-gold/10 text-mj-gold border-mj-gold/20 px-4 py-2 text-sm font-medium mb-4">
            Our Foundation
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="text-mj-gold">Values</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The principles that guide our work and define our commitment to exceptional service in luxury real estate
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => (
            <Card 
              key={index} 
              className={`cursor-pointer transition-all duration-300 group ${
                activeValue === index 
                  ? 'bg-mj-gold/5 border-mj-gold shadow-lg scale-105' 
                  : 'bg-white border-mj-gold/20 hover:border-mj-gold/40 hover:shadow-md'
              }`}
              onClick={() => {
                setActiveValue(index)
                setShowDetails(true)
              }}
            >
              <CardContent className="p-8 text-center space-y-6">
                <div className="flex justify-center">
                  <div className={`p-4 rounded-full bg-gradient-to-r ${value.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="h-10 w-10" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold group-hover:text-mj-gold transition-colors">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {value.description}
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-mj-gold/40 text-mj-gold hover:bg-mj-gold/10 group-hover:border-mj-gold"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Value Details */}
        {showDetails && (
          <div className="bg-mj-teal/5 rounded-2xl p-8 md:p-12 border border-mj-gold/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-full bg-gradient-to-r ${values[activeValue].color} text-white`}>
                    {/* <values[activeValue].icon className="h-10 w-10" /> */}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-mj-gold">
                      {values[activeValue].title}
                    </h3>
                    <p className="text-muted-foreground text-lg">
                      {values[activeValue].description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-mj-teal">How We Practice This Value:</h4>
                  <ul className="space-y-3">
                    {values[activeValue].details.map((detail, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-mj-gold flex-shrink-0" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="relative">
                <div className={`w-full h-64 rounded-2xl ${values[activeValue].bgColor} border-2 ${values[activeValue].borderColor} flex items-center justify-center`}>
                  <div className="text-center space-y-4">
                    <div className={`p-6 rounded-full bg-gradient-to-r ${values[activeValue].color} text-white mx-auto`}>
                      {/* <values[activeValue].icon className="h-16 w-16" /> */}
                    </div>
                    <h4 className="text-2xl font-bold text-mj-teal">
                      {values[activeValue].title}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Button 
                variant="outline"
                onClick={() => setShowDetails(false)}
                className="border-mj-gold/40 text-mj-gold hover:bg-mj-gold/10"
              >
                Close Details
              </Button>
            </div>
          </div>
        )}

        {/* Values Summary */}
        <div className="mt-16 text-center">
          <div className="bg-mj-dark rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-3xl font-bold mb-6">
              Living Our <span className="text-mj-gold">Values</span> Every Day
            </h3>
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed mb-8">
              These values aren't just words on a wall—they're the foundation of everything we do. 
              From the moment you first contact us to long after your property transaction is complete, 
              you'll experience our commitment to these principles in every interaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-mj-gold hover:bg-mj-gold-light text-mj-teal font-semibold">
                Experience Our Values
              </Button>
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">
                Meet Our Team
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
