"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, TrendingUp, Users, Award, Star, Target, Clock, Globe } from "lucide-react"

const stats = [
  {
    number: 500,
    suffix: "+",
    label: "Properties Sold",
    description: "Successfully closed deals",
    icon: Building2,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/10"
  },
  {
    number: 2,
    suffix: "B+",
    prefix: "AED ",
    label: "Total Sales Value",
    description: "In property transactions",
    icon: TrendingUp,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-500/10"
  },
  {
    number: 98,
    suffix: "%",
    label: "Client Satisfaction",
    description: "Happy customers",
    icon: Users,
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-500/10"
  },
  {
    number: 50,
    suffix: "+",
    label: "Awards Won",
    description: "Industry recognition",
    icon: Award,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-500/10"
  },
  {
    number: 9,
    suffix: "+",
    label: "Years Experience",
    description: "In Dubai real estate",
    icon: Clock,
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-500/10"
  },
  {
    number: 15,
    suffix: "+",
    label: "Neighborhoods",
    description: "Across Dubai",
    icon: Globe,
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-500/10"
  }
]

const achievements = [
  {
    title: "Best Luxury Real Estate Agency",
    year: "2023",
    organization: "Dubai Property Awards"
  },
  {
    title: "Top Performer",
    year: "2022",
    organization: "Emaar Properties"
  },
  {
    title: "Excellence in Service",
    year: "2021",
    organization: "Dubai Land Department"
  },
  {
    title: "Customer Choice Award",
    year: "2020",
    organization: "Property Finder"
  }
]

function AnimatedCounter({ 
  end, 
  duration = 2000, 
  prefix = "", 
  suffix = "" 
}: { 
  end: number
  duration?: number
  prefix?: string
  suffix?: string
}) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const startValue = 0

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(startValue + (end - startValue) * easeOutQuart)
      
      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-mj-gold">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  )
}

export function AboutStats() {
  return (
    <section className="py-20 bg-gradient-to-br from-mj-dark to-mj-teal">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-mj-gold/20 text-mj-gold border-mj-gold/30 px-4 py-2 text-sm font-medium mb-4">
            Our Achievements
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Numbers That <span className="text-mj-gold">Speak</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Our track record of success reflects our commitment to excellence and client satisfaction
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="bg-mj-teal-light/20 backdrop-blur-sm border-mj-gold/20 hover:border-mj-gold/40 transition-all duration-300 group hover:scale-105"
            >
              <CardContent className="p-8 text-center space-y-6">
                <div className="flex justify-center">
                  <div className={`p-4 rounded-full bg-gradient-to-r ${stat.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-10 w-10" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <AnimatedCounter 
                    end={stat.number} 
                    prefix={stat.prefix || ""} 
                    suffix={stat.suffix || ""} 
                  />
                  <div className="text-xl font-semibold text-white">{stat.label}</div>
                  <div className="text-sm text-white/70">{stat.description}</div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-mj-teal-light/20 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-1000 delay-500`}
                    style={{ width: `${Math.min((stat.number / 500) * 100, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievements Section */}
        <div className="bg-mj-teal-light/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-mj-gold/20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Industry <span className="text-mj-gold">Recognition</span>
            </h3>
            <p className="text-white/80 max-w-2xl mx-auto">
              Our commitment to excellence has been recognized by leading industry organizations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-mj-gold/20 hover:border-mj-gold/40 transition-all duration-300 group">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 rounded-full bg-mj-gold/20 group-hover:bg-mj-gold/30 transition-colors">
                      <Star className="h-8 w-8 text-mj-gold" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">{achievement.title}</h4>
                    <div className="text-mj-gold font-bold text-xl mb-1">{achievement.year}</div>
                    <div className="text-white/70 text-sm">{achievement.organization}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-mj-gold to-mj-gold-light rounded-2xl p-8 md:p-12 text-mj-teal">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Experience Our Excellence?
            </h3>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied clients who have trusted us with their real estate needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-mj-teal hover:bg-mj-teal-light text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                View Our Properties
              </button>
              <button className="border-2 border-mj-teal text-mj-teal hover:bg-mj-teal hover:text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                Get Free Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
