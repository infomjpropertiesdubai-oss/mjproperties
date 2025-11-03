"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export interface FilterState {
  priceRange: [number, number]
  selectedLocations: string[]
  selectedTypes: string[]
  selectedAmenities: string[]
  selectedFeatures: string[]
  bedrooms: string[]
  bathrooms: string[]
}

interface FilterContextType {
  filters: FilterState
  updateFilters: (newFilters: Partial<FilterState>) => void
  clearFilters: () => void
  isInitialized: boolean
}

interface FilterProviderProps {
  children: ReactNode
  initialSearchParams?: { [key: string]: string | string[] | undefined }
}

const getDefaultFilters = (minPrice = 0, maxPrice = 1): FilterState => ({
  priceRange: [minPrice, maxPrice],
  selectedLocations: [],
  selectedTypes: [],
  selectedAmenities: [],
  selectedFeatures: [],
  bedrooms: [],
  bathrooms: []
})

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children, initialSearchParams }: FilterProviderProps) {
  const [filters, setFilters] = useState<FilterState>(getDefaultFilters())
  const [defaultFilters, setDefaultFilters] = useState<FilterState>(getDefaultFilters())
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize filters from URL parameters AND fetch price range
  useEffect(() => {
    const initializeFilters = async () => {
      try {
        // First, fetch the price range to get the actual min/max bounds
        const response = await fetch('/api/properties/price-range')
        let priceRangeData = null

        if (response.ok) {
          priceRangeData = await response.json()
          const newDefaults = getDefaultFilters(priceRangeData.roundedMinPrice, priceRangeData.roundedMaxPrice)
          setDefaultFilters(newDefaults)
        }

        // Then initialize from URL parameters
        if (initialSearchParams) {
          const newFilters: Partial<FilterState> = {};

          // Initialize bedrooms
          if (initialSearchParams.bedrooms) {
            const bedrooms = Array.isArray(initialSearchParams.bedrooms) ? initialSearchParams.bedrooms[0] : initialSearchParams.bedrooms;
            newFilters.bedrooms = bedrooms.split(',').map(b => b.trim());
          }

          // Initialize bathrooms
          if (initialSearchParams.bathrooms) {
            const bathrooms = Array.isArray(initialSearchParams.bathrooms) ? initialSearchParams.bathrooms[0] : initialSearchParams.bathrooms;
            newFilters.bathrooms = bathrooms.split(',').map(b => b.trim());
          }

          // Initialize locations
          if (initialSearchParams.location) {
            const locations = Array.isArray(initialSearchParams.location) ? initialSearchParams.location[0] : initialSearchParams.location;
            newFilters.selectedLocations = locations.split(',').map(l => l.trim());
          }

          // Initialize property types
          if (initialSearchParams.property_type) {
            const propertyTypes = Array.isArray(initialSearchParams.property_type) ? initialSearchParams.property_type[0] : initialSearchParams.property_type;
            newFilters.selectedTypes = propertyTypes.split(',').map(t => t.trim());
          }

          // Initialize features
          if (initialSearchParams.features) {
            const features = Array.isArray(initialSearchParams.features) ? initialSearchParams.features[0] : initialSearchParams.features;
            newFilters.selectedFeatures = features.split(',').map(f => f.trim());
          }

          // Initialize amenities
          if (initialSearchParams.amenities) {
            const amenities = Array.isArray(initialSearchParams.amenities) ? initialSearchParams.amenities[0] : initialSearchParams.amenities;
            newFilters.selectedAmenities = amenities.split(',').map(a => a.trim());
          }

          // Initialize price range from URL, or use the fetched defaults
          if (initialSearchParams.min_price || initialSearchParams.max_price) {
            const minPrice = initialSearchParams.min_price
              ? parseInt(Array.isArray(initialSearchParams.min_price) ? initialSearchParams.min_price[0] : initialSearchParams.min_price)
              : (priceRangeData?.roundedMinPrice || 0);
            const maxPrice = initialSearchParams.max_price
              ? parseInt(Array.isArray(initialSearchParams.max_price) ? initialSearchParams.max_price[0] : initialSearchParams.max_price)
              : (priceRangeData?.roundedMaxPrice || 1);
            newFilters.priceRange = [minPrice, maxPrice];
          } else if (priceRangeData) {
            // If no URL params for price, use the fetched range
            newFilters.priceRange = [priceRangeData.roundedMinPrice, priceRangeData.roundedMaxPrice];
          }

          // Update the filter context if we have any new filters
          if (Object.keys(newFilters).length > 0) {
            setFilters(prev => ({ ...prev, ...newFilters }));
          }
        } else if (priceRangeData) {
          // No URL params, just update with fetched price range
          setFilters(prev => ({ ...prev, priceRange: [priceRangeData.roundedMinPrice, priceRangeData.roundedMaxPrice] }));
        }
      } catch (error) {
        console.error('Failed to initialize filters:', error)
      } finally {
        // Mark as initialized after the price range has been fetched
        setIsInitialized(true)
      }
    }

    initializeFilters()
  }, [initialSearchParams]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters(defaultFilters)
  }

  return (
    <FilterContext.Provider value={{ filters, updateFilters, clearFilters, isInitialized }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider')
  }
  return context
}
