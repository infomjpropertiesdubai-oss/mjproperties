"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Star, Quote, MapPin, Calendar, Building2 } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Ahmed Al-Rashid",
    title: "Business Owner",
    company: "Al-Rashid Group",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    rating: 5,
    text: "MJ Properties helped me find the perfect penthouse in Downtown Dubai. Their professionalism and market knowledge are exceptional. I couldn't be happier with the service.",
    property: "Luxury Penthouse, Downtown Dubai",
    value: "AED 8.5M",
    date: "2023",
    location: "Dubai, UAE"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    title: "Expatriate Professional",
    company: "Tech Solutions Ltd",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    rating: 5,
    text: "As a newcomer to Dubai, MJ Properties made the property search process seamless. They understood my needs perfectly and found me a beautiful apartment in Marina.",
    property: "Waterfront Apartment, Dubai Marina",
    value: "AED 2.2M",
    date: "2023",
    location: "Dubai, UAE"
  },
  {
    id: 3,
    name: "Mohammed Hassan",
    title: "Real Estate Investor",
    company: "Hassan Investments",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    rating: 5,
    text: "I've worked with many real estate agencies, but MJ Properties stands out. Their investment advice and market insights have been invaluable for my portfolio.",
    property: "Investment Villa, Dubai Hills",
    value: "AED 4.8M",
    date: "2023",
    location: "Dubai, UAE"
  },
  {
    id: 4,
    name: "Fatima Al-Zahra",
    title: "Family Investor",
    company: "Al-Zahra Holdings",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    rating: 5,
    text: "The team at MJ Properties made our family's dream of owning a luxury villa come true. Their attention to detail and personalized service was outstanding.",
    property: "Family Villa, Emirates Hills",
    value: "AED 12M",
    date: "2022",
    location: "Dubai, UAE"
  },
  {
    id: 5,
    name: "David Smith",
    title: "International Investor",
    company: "Smith Capital",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    rating: 5,
    text: "MJ Properties provided exceptional service for my international investment. Their market expertise and professional approach exceeded all expectations.",
    property: "Commercial Tower, Business Bay",
    value: "AED 25M",
    date: "2022",
    location: "Dubai, UAE"
  }
]

export function AboutTestimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      nextTestimonial()
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const current = testimonials[currentTestimonial]

  return (
    <section className="py-20 bg-mj-teal">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Client <span className="text-mj-gold">Testimonials</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Hear what our satisfied clients have to say about their experience with MJ Properties
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-6xl mx-auto mb-16">
          <Card className="bg-mj-teal border-mj-gold/20 shadow-xl">
            <CardContent className="p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Content - Testimonial */}
                <div className="space-y-8">
                  <div className="flex items-center gap-2">
                    <Quote className="w-8 h-8 text-mj-gold" />
                    <div className="flex">
                      {Array.from({ length: current.rating }).map((_, i) => (
                        <Star key={i} className="h-6 w-6 text-mj-gold fill-current" />
                      ))}
                    </div>
                  </div>

                  <blockquote className="text-2xl md:text-3xl text-muted-foreground italic leading-relaxed">
                    "{current.text}"
                  </blockquote>

                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 overflow-hidden rounded-full border-4 border-mj-gold/20">
                      <Image 
                        src={current.image} 
                        alt={current.name} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-mj-teal">{current.name}</div>
                      <div className="text-mj-gold font-semibold">{current.title}</div>
                      <div className="text-muted-foreground">{current.company}</div>
                    </div>
                  </div>
                </div>

                {/* Right Content - Property Details */}
                <div className="space-y-6">
                  <div className="bg-mj-teal/5 rounded-2xl p-6 border border-mj-gold/20">
                    <h3 className="text-xl font-bold text-mj-teal mb-4">Property Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-mj-gold" />
                        <div>
                          <div className="font-semibold text-mj-gold">{current.property}</div>
                          <div className="text-muted-foreground text-sm">Property Type</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-mj-gold" />
                        <div>
                          <div className="font-semibold text-mj-gold">{current.location}</div>
                          <div className="text-muted-foreground text-sm">Location</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-mj-gold" />
                        <div>
                          <div className="font-semibold text-mj-gold">{current.date}</div>
                          <div className="text-muted-foreground text-sm">Transaction Date</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-mj-gold/10 rounded-2xl p-6 border border-mj-gold/20 text-center">
                    <div className="text-3xl font-bold text-mj-gold mb-2">{current.value}</div>
                    <div className="text-muted-foreground">Transaction Value</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              className={`cursor-pointer transition-all duration-300 ${
                currentTestimonial === index 
                  ? 'bg-mj-gold/5 border-mj-gold shadow-lg' 
                  : 'bg-mj-teal border-mj-gold/20 hover:border-mj-gold/40 hover:shadow-md'
              }`}
              onClick={() => {
                setCurrentTestimonial(index)
                setIsAutoPlaying(false)
              }}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 overflow-hidden rounded-full">
                    <Image 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-mj-teal">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                  </div>
                </div>

                <div className="flex">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-mj-gold fill-current" />
                  ))}
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  "{testimonial.text}"
                </p>

                <div className="text-sm text-mj-gold font-semibold">
                  {testimonial.value} • {testimonial.date}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center items-center gap-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              prevTestimonial()
              setIsAutoPlaying(false)
            }}
            className="border-mj-gold/40 hover:bg-mj-gold/10 bg-transparent cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentTestimonial(index)
                  setIsAutoPlaying(false)
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? "bg-mj-gold" : "bg-mj-gold/30"
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              nextTestimonial()
              setIsAutoPlaying(false)
            }}
            className="border-mj-gold/40 hover:bg-mj-gold/10 bg-transparent cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Auto-play Toggle */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="border-mj-gold/40 text-mj-gold hover:bg-mj-gold/10 cursor-pointer"
          >
            {isAutoPlaying ? "Pause" : "Play"} Auto-Play
          </Button>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-mj-teal rounded-2xl p-8 md:p-12 ">
            <h3 className="text-3xl font-bold mb-4 text-mj-white">
              Ready to Join Our Satisfied Clients?
            </h3>
            <p className="text-xl text-mj-gold max-w-2xl mx-auto mb-8">
              Experience the same exceptional service that has earned us these glowing testimonials
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-mj-gold hover:bg-mj-gold-light text-mj-teal font-semibold cursor-pointer">
                Start Your Journey
              </Button>
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 cursor-pointer">
                View All Properties
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
