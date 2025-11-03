"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Star, Award, MessageCircle, ArrowRight, Linkedin, Mail, Phone } from "lucide-react"

const teamMembers = [
  {
    name: "Ahmed Al-Rashid",
    title: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    experience: "15+ years",
    specialization: "Luxury Properties",
    rating: 5,
    propertiesSold: 150,
    description: "Visionary leader with extensive experience in Dubai's luxury real estate market.",
    achievements: ["Top 1% Agent", "AED 500M+ Sales", "Industry Pioneer"]
  },
  {
    name: "Sarah Johnson",
    title: "Senior Property Consultant",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    experience: "12+ years",
    specialization: "Investment Properties",
    rating: 5,
    propertiesSold: 120,
    description: "Expert in investment strategies and market analysis with a proven track record.",
    achievements: ["Investment Specialist", "Market Analyst", "Client Advisor"]
  },
  {
    name: "Mohammed Hassan",
    title: "Luxury Property Specialist",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    experience: "10+ years",
    specialization: "Penthouses & Villas",
    rating: 5,
    propertiesSold: 95,
    description: "Specialized in high-end properties with deep knowledge of Dubai's luxury market.",
    achievements: ["Luxury Expert", "VIP Client Manager", "Award Winner"]
  },
  {
    name: "Fatima Al-Zahra",
    title: "Client Relations Manager",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    experience: "8+ years",
    specialization: "Client Experience",
    rating: 5,
    propertiesSold: 80,
    description: "Dedicated to ensuring exceptional client experiences throughout the property journey.",
    achievements: ["Client Satisfaction", "Service Excellence", "Team Leader"]
  }
]

const teamStats = [
  {
    number: "50+",
    label: "Expert Agents",
    description: "Certified professionals"
  },
  {
    number: "15+",
    label: "Average Experience",
    description: "Years in real estate"
  },
  {
    number: "98%",
    label: "Client Satisfaction",
    description: "Happy customers"
  },
  {
    number: "24/7",
    label: "Support Available",
    description: "Always here for you"
  }
]

export function AboutTeamPreview() {
  const [activeMember, setActiveMember] = useState(0)

  return (
    <section className="py-20 bg-gradient-to-br from-mj-dark to-mj-teal">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-mj-gold/20 text-mj-gold border-mj-gold/30 px-4 py-2 text-sm font-medium mb-4">
            Meet Our Team
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Expert <span className="text-mj-gold">Professionals</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Our team of experienced professionals is dedicated to providing exceptional service and expertise in Dubai's luxury real estate market
          </p>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {teamStats.map((stat, index) => (
            <Card key={index} className="bg-mj-teal-light/20 backdrop-blur-sm border-mj-gold/20 hover:border-mj-gold/40 transition-all duration-300 group">
              <CardContent className="p-6 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 rounded-full bg-mj-gold/20 group-hover:bg-mj-gold/30 transition-colors">
                    <Users className="h-8 w-8 text-mj-gold" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white">{stat.number}</div>
                <div className="text-lg font-semibold text-mj-gold">{stat.label}</div>
                <div className="text-sm text-white/70">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Team Members */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Meet Our <span className="text-mj-gold">Leadership</span>
            </h3>
            <p className="text-white/80 max-w-2xl mx-auto">
              Get to know the experts behind our success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer transition-all duration-300 group ${
                  activeMember === index 
                    ? 'bg-mj-gold/20 border-mj-gold shadow-xl scale-105' 
                    : 'bg-mj-teal-light/20 border-mj-gold/20 hover:border-mj-gold/40 hover:shadow-lg'
                }`}
                onClick={() => setActiveMember(index)}
              >
                <CardContent className="p-6 text-center space-y-6">
                  <div className="relative">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-mj-gold/30 group-hover:border-mj-gold transition-colors">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-mj-gold text-mj-teal text-xs">
                        {member.experience}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xl font-bold text-white group-hover:text-mj-gold transition-colors">
                      {member.name}
                    </h4>
                    <p className="text-mj-gold font-semibold">{member.title}</p>
                    <p className="text-white/70 text-sm">{member.specialization}</p>
                    
                    <div className="flex justify-center items-center gap-1">
                      {Array.from({ length: member.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-mj-gold fill-current" />
                      ))}
                    </div>

                    <div className="text-sm text-white/60">
                      {member.propertiesSold} properties sold
                    </div>
                  </div>

                  <div className="flex justify-center gap-2">
                    <Button size="sm" variant="outline" className="border-mj-gold/40 text-mj-gold hover:bg-mj-gold/10 p-2">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-mj-gold/40 text-mj-gold hover:bg-mj-gold/10 p-2">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-mj-gold/40 text-mj-gold hover:bg-mj-gold/10 p-2">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Active Member Details */}
        <div className="bg-mj-teal-light/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-mj-gold/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-mj-gold">
                  <Image
                    src={teamMembers[activeMember].image}
                    alt={teamMembers[activeMember].name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {teamMembers[activeMember].name}
                  </h3>
                  <p className="text-mj-gold text-xl font-semibold mb-2">
                    {teamMembers[activeMember].title}
                  </p>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: teamMembers[activeMember].rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-mj-gold fill-current" />
                    ))}
                  </div>
                  <p className="text-white/70">
                    {teamMembers[activeMember].experience} • {teamMembers[activeMember].specialization}
                  </p>
                </div>
              </div>

              <p className="text-white/80 text-lg leading-relaxed">
                {teamMembers[activeMember].description}
              </p>

              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-mj-gold">Key Achievements:</h4>
                <div className="flex flex-wrap gap-2">
                  {teamMembers[activeMember].achievements.map((achievement, index) => (
                    <Badge key={index} className="bg-mj-gold/20 text-mj-gold border-mj-gold/30">
                      {achievement}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="bg-mj-gold hover:bg-mj-gold-light text-mj-teal font-semibold">
                  Contact {teamMembers[activeMember].name.split(' ')[0]}
                </Button>
                <Button variant="outline" className="border-mj-gold/40 text-mj-gold hover:bg-mj-gold/10">
                  View Profile
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-mj-gold/20">
                <h4 className="text-xl font-semibold text-white mb-4">Performance Stats</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Properties Sold</span>
                    <span className="text-mj-gold font-bold">{teamMembers[activeMember].propertiesSold}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Experience</span>
                    <span className="text-mj-gold font-bold">{teamMembers[activeMember].experience}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Client Rating</span>
                    <span className="text-mj-gold font-bold">{teamMembers[activeMember].rating}/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Specialization</span>
                    <span className="text-mj-gold font-bold">{teamMembers[activeMember].specialization}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-mj-gold/20">
                <h4 className="text-xl font-semibold text-white mb-4">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-mj-gold" />
                    <span className="text-white/80">email@mjproperties.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-mj-gold" />
                    <span className="text-white/80">+971 50 123 4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-5 h-5 text-mj-gold" />
                    <span className="text-white/80">linkedin.com/in/username</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-mj-gold to-mj-gold-light rounded-2xl p-8 md:p-12 text-mj-teal">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Work with Our Experts?
            </h3>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Our experienced team is ready to help you find your dream property or sell your current one
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-mj-teal hover:bg-mj-teal-light text-white font-semibold">
                Meet Our Full Team
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" className="border-mj-teal text-mj-teal hover:bg-mj-teal hover:text-white">
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
