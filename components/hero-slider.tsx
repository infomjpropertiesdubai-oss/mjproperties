"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getHeroSections, HeroSection } from "@/lib/hero-sections"
import { Skeleton } from "@/components/ui/skeleton"

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<HeroSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchHeroSections = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await getHeroSections({ limit: 10 })
      setSlides(result.data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch hero sections'))
      // Fallback to static slides if API fails
      setSlides([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHeroSections()
  }, [fetchHeroSections])

  useEffect(() => {
    if (slides.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-mj-dark">
        <Skeleton className="absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="container mx-auto px-4 text-center text-white">
            <div className="max-w-4xl mx-auto space-y-6">
              <Skeleton className="h-16 md:h-24 w-3/4 mx-auto" />
              <Skeleton className="h-8 w-1/2 mx-auto" />
              <Skeleton className="h-12 w-48 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Demo data constants
  const demoImage = "/images/heroBg.jpg"
  const demoTitle = "Welcome to MJ Properties"
  const demoSubtitle = "Discover your dream home in Dubai"

  // Error state or no slides - show demo content
  if (error || slides.length === 0) {
    return (
      <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <Image
          src={demoImage}
          alt={demoTitle}
          fill
          className="object-cover z-10"
          priority
          fetchPriority="high"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60 pointer-events-none z-10" />
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-auto">
          <div className="container mx-auto px-4 text-center text-white">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance text-mj-white max-w-3xl mx-auto">
                {demoTitle}
              </h1>
              <p className="text-xl md:text-2xl text-mj-gold font-medium">
                {demoSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/properties">
                  <Button size="lg" className="bg-mj-gold text-mj-teal hover:bg-mj-gold/90 cursor-pointer">
                    Browse Properties
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      {slides.map((slide, index) => {
        // Use demo image if slide doesn't have an image_url
        const imageUrl = slide.image_url || demoImage
        // Use demo text if slide doesn't have title/subtitle
        const displayTitle = slide.title || demoTitle
        const displaySubtitle = slide.subtitle || demoSubtitle

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          >
            <Image
              src={imageUrl}
              alt={displayTitle}
              fill
              className="object-cover z-10"
              priority={index === 0}
              fetchPriority={index === 0 ? "high" : "auto"}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/60 pointer-events-none z-10" />

            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-auto">
              <div className="container mx-auto px-4 text-center text-white">
                <div className="max-w-4xl mx-auto space-y-6">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance text-mj-white max-w-3xl mx-auto">
                    {displayTitle}
                  </h1>
                  <p className="text-xl md:text-2xl text-mj-gold font-medium">{displaySubtitle}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link href="/properties">
                      <Button size="lg" className="bg-mj-gold text-mj-teal hover:bg-mj-gold/90 cursor-pointer">
                        Browse Properties
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous property"
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors cursor-pointer z-40"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next property"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors cursor-pointer z-40"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-40">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to property ${index + 1}`}
            className={`p-2 rounded-full transition-colors ${
              index === currentSlide ? "bg-mj-gold/20" : "hover:bg-white/10"
            }`}
          >
            <span className={`block w-2 h-2 rounded-full ${
              index === currentSlide ? "bg-mj-gold" : "bg-white/50"
            }`} />
          </button>
        ))}
      </div>
    </div>
  )
}
