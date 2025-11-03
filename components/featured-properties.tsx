"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { PropertyCard } from "@/components/property-card"
import Link from "next/link"
import { getProperties, PropertiesListResponse, Property } from "@/lib/properties"
import { formatPrice } from "@/lib/utils"
import { useState, useEffect, useCallback, useMemo } from "react"

export function FeaturedProperties() {
  const [data, setData] = useState<PropertiesListResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchFeatured = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await getProperties({ is_featured: true, sort_by: 'display_order', sort_order: 'asc', limit: 3 })
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch featured properties'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFeatured()
  }, [fetchFeatured])

  const memoizedCards = useMemo(() => {
    if (!data?.data || data.data.length === 0) return null
    return data.data.slice(0, 3).map((property: Property) => (
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
        status={property.status === 'available' ? 'For Sale' : 'For Rent'}
        featured={true}
      />
    ))
  }, [data?.data])

  if (isLoading) {
    return (
      <div className="mt-36 sm:mt-44 md:mt-52 lg:mt-10 py-16 bg-mj-dark">
        <div className=" container mx-auto px-4">
          <div className="text-center mb-6 md:mb-12 lg:mb-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="text-mj-gold">Properties</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Handpicked premium listings curated by our team.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-4 xl:gap-4 2xl:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="max-w-[570px] border border-mj-gold/30 rounded-2xl overflow-hidden bg-mj-teal-dark/80">
                <div className="relative">
                  <div className="relative w-full h-52 overflow-hidden">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="h-8 w-32" />
                    </div>
                    <div className="flex justify-between items-center py-3 border-t border-mj-gold/20">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-lg" />
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

  if (error) {
    return (
      <section className="mt-36 sm:mt-44 md:mt-52 lg:mt-10 py-16 bg-mj-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-12 lg:mb-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="text-mj-gold">Properties</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Handpicked premium listings curated by our team.
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error.message}</p>
              <Button onClick={fetchFeatured} className="bg-mj-gold text-mj-teal">
                Refetch
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!memoizedCards) {
    return null
  }

  return (
    <div className="mt-36 sm:mt-44 md:mt-52 lg:mt-10 py-16 bg-mj-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-10 lg:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="text-mj-gold">Properties</span>
          </h2>
          <p className=" text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked premium listings curated by our team.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-4 xl:gap-4 2xl:gap-6">
          {memoizedCards}
        </div>
        <div className="text-center mt-8">
          <Link href="/properties?is_featured=true">
            <Button variant="outlineV2" size="lg" className="border-mj-gold text-mj-gold hover:bg-mj-gold/10 cursor-pointer">
              View All Featured
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}


