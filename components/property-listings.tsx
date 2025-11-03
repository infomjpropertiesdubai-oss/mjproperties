"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getProperties, Property } from "@/lib/properties"
import { useFilters } from "@/lib/filter-context"
import { PropertyCard } from "@/components/property-card"
import { formatPrice } from "@/lib/utils"

interface PropertyListingsProps {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export function PropertyListings({ searchParams }: PropertyListingsProps) {
  const { filters, isInitialized } = useFilters()
  const [sortBy, setSortBy] = useState("featured")
  const [currentPage, setCurrentPage] = useState(1)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalProperties, setTotalProperties] = useState(0)
  const itemsPerPage = 6

  // Create stable keys to avoid unnecessary effect re-runs from object identity changes
  const filtersKey = useMemo(() => {
    return JSON.stringify({
      priceRange: filters.priceRange,
      selectedLocations: filters.selectedLocations,
      selectedTypes: filters.selectedTypes,
      bedrooms: filters.bedrooms,
      bathrooms: filters.bathrooms,
      selectedAmenities: filters.selectedAmenities,
      selectedFeatures: filters.selectedFeatures,
    })
  }, [filters])

  const searchKey = useMemo(() => JSON.stringify(searchParams || {}), [searchParams])

  // Fetch properties from Supabase
  useEffect(() => {
    // Don't fetch until filters are initialized from the database
    if (!isInitialized) return

    const fetchProperties = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const offset = (currentPage - 1) * itemsPerPage
        let queryOptions: any = {
          limit: itemsPerPage,
          offset: offset
        }

        // Apply URL search params first (these take priority)
        if (searchParams) {
          if (searchParams.is_featured) {
            queryOptions.is_featured = searchParams.is_featured
          }
          if (searchParams.is_hot_property) {
            queryOptions.is_hot_property = searchParams.is_hot_property
          }
          if (searchParams.property_type) {
            queryOptions.property_type = searchParams.property_type
          }
          if (searchParams.location) {
            queryOptions.location = searchParams.location
          }
          if (searchParams.min_price) {
            queryOptions.min_price = searchParams.min_price
          }
          if (searchParams.max_price) {
            queryOptions.max_price = searchParams.max_price
          }
          if (searchParams.bedrooms) {
            queryOptions.bedrooms = searchParams.bedrooms
          }
          if (searchParams.bathrooms) {
            queryOptions.bathrooms = searchParams.bathrooms
          }
          if (searchParams.search) {
            queryOptions.search = searchParams.search
          }
          if (searchParams.features) {
            queryOptions.features = searchParams.features
          }
          if (searchParams.amenities) {
            queryOptions.amenities = searchParams.amenities
          }
        }

        // Apply filters - always apply price range if it's different from the full range
        if (filters.priceRange[0] !== filters.priceRange[1]) {
          queryOptions.min_price = filters.priceRange[0]
          queryOptions.max_price = filters.priceRange[1]
        }

        if (filters.selectedLocations.length > 0) {
          queryOptions.location = filters.selectedLocations.join(',')
        }

        if (filters.selectedTypes.length > 0) {
          queryOptions.property_type = filters.selectedTypes.join(',')
        }

        if (filters.bedrooms && filters.bedrooms.length > 0) {
          queryOptions.bedrooms = filters.bedrooms.join(',')
        }

        if (filters.bathrooms && filters.bathrooms.length > 0) {
          queryOptions.bathrooms = filters.bathrooms.join(',')
        }

        if (filters.selectedAmenities.length > 0) {
          queryOptions.amenities = filters.selectedAmenities.join(',')
        }

        if (filters.selectedFeatures.length > 0) {
          queryOptions.features = filters.selectedFeatures.join(',')
        }

        // Apply server-side sorting
        switch (sortBy) {
          case 'featured':
            queryOptions.sort_by = 'featured'
            queryOptions.sort_order = 'desc'
            break
          case 'price-low':
            queryOptions.sort_by = 'price'
            queryOptions.sort_order = 'asc'
            break
          case 'price-high':
            queryOptions.sort_by = 'price'
            queryOptions.sort_order = 'desc'
            break
          case 'newest':
            queryOptions.sort_by = 'created_at'
            queryOptions.sort_order = 'desc'
            break
          case 'area':
            queryOptions.sort_by = 'area_value'
            queryOptions.sort_order = 'desc'
            break
          case 'bedrooms':
            queryOptions.sort_by = 'bedrooms'
            queryOptions.sort_order = 'desc'
            break
          case 'title':
            queryOptions.sort_by = 'title'
            queryOptions.sort_order = 'asc'
            break
          default:
            // Default to display order
            queryOptions.sort_by = 'display_order'
            queryOptions.sort_order = 'asc'
            break
        }
        const response = await getProperties(queryOptions)
        setProperties(response.data)
        setTotalProperties(response.pagination.total)
      } catch (err) {
        console.error('Error fetching properties:', err)
        setError(err instanceof Error ? err.message : 'Failed to load properties')
      } finally {
        setLoading(false)
        if (isInitialLoad) setIsInitialLoad(false)
      }
    }

    fetchProperties()
  }, [currentPage, sortBy, filtersKey, searchKey, isInitialized])

  // useEffect(() => {
  //   const fetchProperties = async () => {
  //     setLoading(true)
  //     const response = await getProperties({
  //       limit: itemsPerPage,
  //       offset: (currentPage - 1) * itemsPerPage,
  //       sort_by: sortBy,
  //       sort_order: 'asc',
  //       ...filtersKey,
  //     })
  //     setProperties(response.data)
  //     setTotalProperties(response.pagination.total)
  //     setLoading(false)
  //   }
  //   fetchProperties()
  // }, [ filtersKey, searchKey ])

  // Reset to first page when filters or search params change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  // only react to stable keys
  }, [filtersKey, searchKey])

  const totalPages = Math.ceil(totalProperties / itemsPerPage)
  const currentProperties = properties

  // Get dynamic header content based on search params
  const getResultsHeader = () => {
    if (searchParams?.is_hot_property === 'true') {
      return {
        title: "Hot Properties",
        subtitle: `${totalProperties} hot deals found`
      }
    } else if (searchParams?.is_featured === 'true') {
      return {
        title: "Featured Properties", 
        subtitle: `${totalProperties} featured properties found`
      }
    } else {
      return {
        title: "Properties for Sale",
        subtitle: `${totalProperties} properties found`
      }
    }
  }
  
  const resultsHeader = getResultsHeader()

  // Helper function to format price

  // Helper function to get the first image or placeholder
  const getPropertyImage = (property: Property) => {
    if (property.images && property.images.length > 0) {
      return property.images[0].image_url
    }
    return "/placeholder.svg"
  }

  // Helper function to format area
  const formatArea = (areaValue: number, areaUnit: string) => {
    return `${areaValue.toLocaleString()} ${areaUnit}`
  }

  if (isInitialLoad && loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="min-w-0 flex-1 space-y-2 w-full">
            <Skeleton className="h-6 sm:h-7 w-44 sm:w-56" />
            <Skeleton className="h-4 w-64 sm:w-80" />
          </div>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 min-w-0 flex-1 sm:flex-initial w-full sm:w-44">
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-3 gap-4 sm:gap-4 xl:gap-4 2xl:gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="max-w-[570px] border border-mj-gold/30 rounded-2xl overflow-hidden bg-mj-teal-dark/80">
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
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold truncate">{resultsHeader.title}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{resultsHeader.subtitle}</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          {/* Sort By */}
          <div className="flex items-center gap-2 min-w-0 flex-1 sm:flex-initial">
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
            <Select value={sortBy} onValueChange={(value) => {
              setSortBy(value)
              setCurrentPage(1) // Reset to first page when sorting changes
            }}>
              <SelectTrigger className="w-full sm:w-44 border-mj-gold/20 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="area">Largest Area</SelectItem>
                <SelectItem value="bedrooms">Most Bedrooms</SelectItem>
                <SelectItem value="title">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-3 gap-4 sm:gap-4 xl:gap-4 2xl:gap-6">
        {currentProperties.map((property, index) => (
          <PropertyCard
            key={property.id}
            id={property.id}
            title={property.title}
            location={property.location}
            price={formatPrice(property.price)}
            bedrooms={property.bedrooms || 0}
            bathrooms={property.bathrooms}
            area={formatArea(property.area_value, property.area_unit)}
            image={getPropertyImage(property)}
            type={property.property_type}
            status={property.status}
            featured={property.is_featured}
            priority={currentPage === 1 && index < 3}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 sm:gap-2 pt-6 sm:pt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="border-mj-gold/20"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1 sm:gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={`${
                  currentPage === page 
                    ? "bg-mj-gold text-mj-teal" 
                    : "border-mj-gold/20 hover:border-mj-gold/40"
                } min-w-[32px] sm:min-w-[40px]`}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="border-mj-gold/20"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
