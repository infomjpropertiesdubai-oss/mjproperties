"use client"

import { useState, useEffect, useRef } from "react"
import { getSimilarProperties, Property } from "@/lib/properties"
import { PropertyCard } from "./property-card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"



interface SimilarPropertiesProps {
  currentPropertyId: string
}

export function SimilarProperties({ currentPropertyId }: SimilarPropertiesProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Fetch similar properties from database using our algorithm
  useEffect(() => {
    const fetchSimilarProperties = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getSimilarProperties(currentPropertyId, 3)
        setProperties(response.data)
      } catch (err) {
        console.error('Error fetching similar properties:', err)
        setError(err instanceof Error ? err.message : 'Failed to load similar properties')
      } finally {
        setLoading(false)
      }
    }

    if (currentPropertyId) {
      fetchSimilarProperties()
    }
  }, [currentPropertyId])

  // Helper functions

  const formatArea = (areaValue: number, areaUnit: string) => {
    return `${areaValue.toLocaleString()} ${areaUnit}`
  }

  const getMainImage = (property: Property) => {
    if (property.images && property.images.length > 0) {
      const sortedImages = property.images.sort((a, b) => a.order - b.order)
      return sortedImages[0].image_url
    }
    return "/placeholder.svg"
  }

  // Get number of slides per view based on screen size
  const getSlidesPerView = () => {
    if (typeof window === 'undefined') return 1
    const width = window.innerWidth
    if (width >= 1280) return 3 // desktop (xl and up)
    if (width >= 768) return 2 // tablets (md and up)
    return 1 // md and below
  }

  const slidesPerView = getSlidesPerView()
  const filteredProperties = properties.filter((p) => p.id !== currentPropertyId)
  const totalSlides = Math.ceil(filteredProperties.length / slidesPerView)

  // Slider navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex)
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setCurrentSlide(0) // Reset to first slide on resize
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-slide functionality
  useEffect(() => {
    if (filteredProperties.length <= slidesPerView) return
    
    const interval = setInterval(() => {
      nextSlide()
    }, 6000) // Auto-slide every 6 seconds for similar properties

    return () => clearInterval(interval)
  }, [filteredProperties.length, currentSlide, slidesPerView])

  // Hide section if no properties found after loading
  if (!loading && !error && filteredProperties.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-mj-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Similar <span className="text-mj-gold">Properties</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore other exceptional properties that might interest you
          </p>
        </div>

{/* Loading State */}
        {loading && (
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-4 xl:gap-4 2xl:gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-border overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-3">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">{error}</div>
            <p className="text-muted-foreground">Unable to load similar properties at this time.</p>
          </div>
        )}

        {/* Properties Slider */}
        {!loading && !error && (
          <div className="relative">
            {/* Navigation Buttons */}
           

            {/* Slider */}
            <div 
              ref={sliderRef}
              className="overflow-hidden"
            >
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * (100 / totalSlides)}%)`,
                  width: `${totalSlides * 100}%`
                }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div 
                    key={slideIndex}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-4 xl:gap-4 2xl:gap-6"
                    style={{ width: `${100 / totalSlides}%` }}
                  >
                    {filteredProperties
                      .slice(slideIndex * slidesPerView, (slideIndex + 1) * slidesPerView)
                      .map((property) => {
                        // Handle both database Property type and mock data type
                        const isDbProperty = 'property_type' in property
                        const propertyId = property.id.toString()
                        const propertyTitle = property.title
                        const propertyLocation = property.location
                        const propertyType = isDbProperty ? property.property_type : (property as any).type
                        const propertyPrice = isDbProperty ? formatPrice(property.price) : (property as any).price
                        const propertyBeds = isDbProperty ? property.bedrooms : (property as any).bedrooms
                        const propertyBaths = isDbProperty ? property.bathrooms : (property as any).bathrooms
                        const propertyArea = isDbProperty ? formatArea(property.area_value, property.area_unit) : (property as any).area
                        const propertyImage = isDbProperty ? getMainImage(property) : (property as any).image
                        const propertyStatus = isDbProperty ? (property.status || 'For Sale') : (property as any).status
                        const propertyFeatured = isDbProperty ? property.is_featured : (property as any).featured

                        return (
                          <PropertyCard
                            key={propertyId}
                            id={propertyId}
                            title={propertyTitle}
                            location={propertyLocation}
                            price={propertyPrice}
                            bedrooms={propertyBeds}
                            bathrooms={propertyBaths}
                            area={propertyArea}
                            image={propertyImage}
                            type={propertyType}
                            status={propertyStatus}
                            featured={propertyFeatured}
                          />
                        )
                      })}
                  </div>
                ))}
              </div>
            </div>
              
              <div className="flex justify-between items-center mt-8 gap-4">
                {/* Previous Button */}
                {filteredProperties.length > slidesPerView && (
                  <button
                    onClick={prevSlide}
                    className="flex items-center gap-2 bg-mj-gold/90 hover:bg-mj-gold text-mj-teal rounded-md px-4 py-2 shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous properties"
                    disabled={currentSlide === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                )}

                {/* Pagination Dots */}
                {filteredProperties.length > slidesPerView && (
                  <div className="flex gap-2  sm:order-none">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 ${
                          currentSlide === index 
                            ? 'bg-mj-gold scale-125' 
                            : 'bg-mj-gold/30 hover:bg-mj-gold/60'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Next Button */}
                {filteredProperties.length > slidesPerView && (
                  <button
                    onClick={nextSlide}
                    className="flex items-center gap-2 bg-mj-gold/90 hover:bg-mj-gold text-mj-teal rounded-md px-4 py-2 shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next properties"
                    disabled={currentSlide === totalSlides - 1}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
          </div>
        )}
      </div>
    </section>
  )
}
