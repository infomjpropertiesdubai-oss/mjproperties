"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Award, TrendingUp, Building2 } from "lucide-react"

const timelineEvents = [
  {
    year: "2015",
    title: "Company Founded",
    description: "MJ Properties was established with a vision to redefine luxury real estate services in Dubai.",
    icon: Building2,
    color: "bg-mj-gold",
    details: [
      "Started with 3 team members",
      "First office in Business Bay",
      "Initial focus on luxury apartments"
    ]
  },
  {
    year: "2016",
    title: "First Major Sale",
    description: "Completed our first AED 10M+ luxury penthouse sale in Downtown Dubai.",
    icon: TrendingUp,
    color: "bg-mj-teal",
    details: [
      "AED 12M penthouse sale",
      "Established client relationships",
      "Expanded to villas and townhouses"
    ]
  },
  {
    year: "2018",
    title: "Award Recognition",
    description: "Won 'Best Luxury Real Estate Agency' at Dubai Property Awards.",
    icon: Award,
    color: "bg-mj-gold",
    details: [
      "First industry award",
      "Team expanded to 15 members",
      "Launched digital marketing"
    ]
  },
  {
    year: "2020",
    title: "Digital Transformation",
    description: "Launched virtual property tours and digital marketing initiatives.",
    icon: Users,
    color: "bg-mj-teal",
    details: [
      "Virtual tour technology",
      "Online property platform",
      "Remote client consultations"
    ]
  },
  {
    year: "2022",
    title: "Market Expansion",
    description: "Expanded services to include property management and investment consulting.",
    icon: MapPin,
    color: "bg-mj-gold",
    details: [
      "Property management division",
      "Investment advisory services",
      "Team grew to 35 members"
    ]
  },
  {
    year: "2024",
    title: "Market Leadership",
    description: "Achieved 500+ properties sold with AED 2B+ in total sales value.",
    icon: Award,
    color: "bg-mj-teal",
    details: [
      "500+ properties sold",
      "AED 2B+ total sales",
      "98% client satisfaction rate"
    ]
  }
]

export function AboutTimeline() {
  const [activeEvent, setActiveEvent] = useState(0)

  return (
    <section className="py-20 bg-mj-dark">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-mj-gold/10 text-mj-gold border-mj-gold/20 px-4 py-2 text-sm font-medium mb-4">
            Our Journey
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Company <span className="text-mj-gold">Timeline</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            From humble beginnings to becoming Dubai's premier luxury real estate agency
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Timeline Navigation */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-8">Key Milestones</h3>
            {timelineEvents.map((event, index) => (
              <Card 
                key={index}
                className={`cursor-pointer transition-all duration-300 ${
                  activeEvent === index 
                    ? 'bg-mj-gold/20 border-mj-gold shadow-lg' 
                    : 'bg-mj-teal-light/10 border-mj-gold/20 hover:border-mj-gold/40'
                }`}
                onClick={() => setActiveEvent(index)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${event.color} text-white`}>
                      <event.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-mj-gold border-mj-gold/40">
                          {event.year}
                        </Badge>
                        <h4 className="text-lg font-semibold text-white">{event.title}</h4>
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Active Event Details */}
          <div className="sticky top-8">
            <Card className="bg-mj-teal-light/20 backdrop-blur-sm border-mj-gold/20">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-full ${timelineEvents[activeEvent].color} text-white`}>
                      {/* <timelineEvents[activeEvent].icon className="w-8 h-8" /> */}
                    </div>
                    <div>
                      <Badge variant="outline" className="text-mj-gold border-mj-gold/40 mb-2">
                        {timelineEvents[activeEvent].year}
                      </Badge>
                      <h3 className="text-2xl font-bold text-white">
                        {timelineEvents[activeEvent].title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-white/90 text-lg leading-relaxed">
                    {timelineEvents[activeEvent].description}
                  </p>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-mj-gold">Key Achievements:</h4>
                    <ul className="space-y-2">
                      {timelineEvents[activeEvent].details.map((detail, index) => (
                        <li key={index} className="flex items-center gap-3 text-white/80">
                          <div className="w-2 h-2 bg-mj-gold rounded-full" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-mj-gold/20">
                    <Button 
                      className="bg-mj-gold hover:bg-mj-gold-light text-mj-teal font-semibold"
                      onClick={() => {
                        const nextIndex = (activeEvent + 1) % timelineEvents.length
                        setActiveEvent(nextIndex)
                      }}
                    >
                      Next Milestone
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/80 text-sm">Our Progress</span>
            <span className="text-mj-gold font-semibold">
              {activeEvent + 1} of {timelineEvents.length}
            </span>
          </div>
          <div className="w-full bg-mj-teal-light/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-mj-gold to-mj-gold-light h-2 rounded-full transition-all duration-500"
              style={{ width: `${((activeEvent + 1) / timelineEvents.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
