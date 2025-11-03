"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { PropertyCard } from "@/components/property-card"
import Link from "next/link"
import { getHotProperties, PropertiesListResponse, Property } from "@/lib/properties"
import { formatPrice } from "@/lib/utils"
import { useState, useEffect, useCallback, useMemo } from "react"

export function HotProperties() {
  const [data, setData] = useState<PropertiesListResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchHotProperties = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await getHotProperties()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch hot properties'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHotProperties()
  }, [fetchHotProperties])

  const memoizedProperties = useMemo(() => {
    if (!data?.data || data.data.length === 0) return null
    
    return data.data.slice(0, 3).map((property: Property) => {
      // Calculate discount percentage (assuming 20% discount for hot properties)
      const discountPercentage = 20
      const originalPrice = property.price ? Math.round(property.price / (1 - discountPercentage / 100)) : 0
      
      return (
         <PropertyCard
          key={property.id}
          id={property.id}
          title={property.title}
          location={property.location}
          price={property.price ? formatPrice(property.price) : 'Price on request'}
          pricePerSqft={property.price && property.area_value ? 
            `AED ${Math.round(property.price / property.area_value).toLocaleString()}/sqft` : 
            undefined
          }
          bedrooms={property.bedrooms || 0}
          bathrooms={property.bathrooms || 0}
          area={property.area_value ? `${property.area_value.toLocaleString()} ${property.area_unit}` : 'N/A'}
          image={property.images && property.images.length > 0 ? 
            (typeof property.images[0] === 'string' ? property.images[0] : property.images[0].image_url) 
            : "/placeholder.svg"
          }
          type={property.property_type}
          status="Hot Deal"
          featured={property.is_featured}
        />     
      )
    })
  }, [data?.data])

  if (isLoading) {
    return (
      <div className=" py-16 bg-mj-teal">
        <div className=" container mx-auto px-4">
          <div className="text-center mb-6 md:mb-12 lg:mb-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Hot <span className="text-mj-gold">Properties</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our best deals and hottest properties with incredible discounts. 
              Don't miss out on these exclusive offers!
            </p>
          </div>
          
          {/* Skeleton Loading */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-4 xl:gap-4 2xl:gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="max-w-[570px] border border-mj-gold/30 rounded-2xl overflow-hidden bg-mj-teal-dark/80">
                <div className="relative">
                  {/* Image Section Skeleton */}
                  <div className="relative w-full h-52 overflow-hidden">
                    <Skeleton className="w-full h-full" />
                    {/* Status Badge Skeleton */}
                    <div className="absolute top-4 left-4">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    {/* Property Type Skeleton */}
                    <div className="absolute bottom-4 left-4">
                      <Skeleton className="h-6 w-20 rounded-lg" />
                    </div>
                    {/* Action Button Skeleton */}
                    <div className="absolute bottom-4 right-4">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                  </div>
                  
                  {/* Content Section Skeleton */}
                  <div className="p-6 space-y-4">
                    {/* Title and Location */}
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                    
                    {/* Price Section */}
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                    
                    {/* Property Details */}
                    <div className="flex justify-between items-center py-3 border-t border-mj-gold/20">
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-6" />
                        <Skeleton className="h-3 w-8" />
                      </div>
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-6" />
                        <Skeleton className="h-3 w-8" />
                      </div>
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-3 w-8" />
                      </div>
                    </div>
                    
                    {/* View Property Button */}
                    <div className="pt-2">
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="w-full flex flex-row items-center justify-center mt-8">
            <Skeleton className="h-10 w-52 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  if (error ) {
    return (
      <section className="py-16 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-12 lg:mb-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Hot <span className="text-mj-gold">Properties</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our best deals and hottest properties with incredible discounts. 
              Don't miss out on these exclusive offers!
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error.message}</p>
              <Button onClick={fetchHotProperties} className="bg-mj-gold text-mj-teal">
                Refetch
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Hide section if no hot properties found after loading
  if (!memoizedProperties) {
    return null
  }

  return (
    <div className="py-16  bg-mj-teal">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-12 lg:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Hot <span className="text-mj-gold">Properties</span>
          </h2>
          <p className=" text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our best deals and hottest properties with incredible discounts. 
            Don't miss out on these exclusive offers!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-4 xl:gap-4 2xl:gap-6">
          {memoizedProperties}
        </div>

        <div className="text-center mt-8">
          <Link href="/properties?is_hot_property=true">
            <Button variant="outline" size="lg" className="border-mj-gold text-mj-gold hover:bg-mj-gold/10 cursor-pointer">
              View All Hot Deals
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
