"use client"
import React, { createContext, useContext, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export interface PropertySearchState {
  location: string
  propertyType: string
  minPrice: string
  maxPrice: string
  bedrooms: string
  bathrooms: string
  search: string
}

interface PropertySearchContextType {
  searchState: PropertySearchState
  isLoading: boolean
  updateSearchState: (updates: Partial<PropertySearchState>) => void
  performSearch: () => void
  clearSearch: () => void
}

interface PropertySearchProviderProps {
  children: React.ReactNode
  initialSearchParams?: { [key: string]: string | string[] | undefined }
}

const defaultSearchState: PropertySearchState = {
  location: "",
  propertyType: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  bathrooms: "",
  search: ""
}

const PropertySearchContext = createContext<PropertySearchContextType | undefined>(undefined)

export function PropertySearchProvider({ children, initialSearchParams }: PropertySearchProviderProps) {
  const [searchState, setSearchState] = useState<PropertySearchState>(() => {
    // Initialize from server-side search params if available
    if (initialSearchParams) {
      const urlState: Partial<PropertySearchState> = {}
      
      if (initialSearchParams.location) urlState.location = Array.isArray(initialSearchParams.location) ? initialSearchParams.location[0] : initialSearchParams.location
      if (initialSearchParams.property_type) urlState.propertyType = Array.isArray(initialSearchParams.property_type) ? initialSearchParams.property_type[0] : initialSearchParams.property_type
      if (initialSearchParams.min_price) urlState.minPrice = Array.isArray(initialSearchParams.min_price) ? initialSearchParams.min_price[0] : initialSearchParams.min_price
      if (initialSearchParams.max_price) urlState.maxPrice = Array.isArray(initialSearchParams.max_price) ? initialSearchParams.max_price[0] : initialSearchParams.max_price
      if (initialSearchParams.bedrooms) urlState.bedrooms = Array.isArray(initialSearchParams.bedrooms) ? initialSearchParams.bedrooms[0] : initialSearchParams.bedrooms
      if (initialSearchParams.bathrooms) urlState.bathrooms = Array.isArray(initialSearchParams.bathrooms) ? initialSearchParams.bathrooms[0] : initialSearchParams.bathrooms
      if (initialSearchParams.search) urlState.search = Array.isArray(initialSearchParams.search) ? initialSearchParams.search[0] : initialSearchParams.search

      return { ...defaultSearchState, ...urlState }
    }
    return defaultSearchState
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Sync with URL params on client side (for direct navigation)
  React.useEffect(() => {
    if (typeof window !== 'undefined' && !initialSearchParams) {
      const urlParams = new URLSearchParams(window.location.search)
      const urlState: Partial<PropertySearchState> = {}
      
      if (urlParams.get('location')) urlState.location = urlParams.get('location')!
      if (urlParams.get('property_type')) urlState.propertyType = urlParams.get('property_type')!
      if (urlParams.get('min_price')) urlState.minPrice = urlParams.get('min_price')!
      if (urlParams.get('max_price')) urlState.maxPrice = urlParams.get('max_price')!
      if (urlParams.get('bedrooms')) urlState.bedrooms = urlParams.get('bedrooms')!
      if (urlParams.get('bathrooms')) urlState.bathrooms = urlParams.get('bathrooms')!
      if (urlParams.get('search')) urlState.search = urlParams.get('search')!

      if (Object.keys(urlState).length > 0) {
        setSearchState(prev => ({ ...prev, ...urlState }))
      }
    }
  }, [])

  const updateSearchState = useCallback((updates: Partial<PropertySearchState>) => {
    setSearchState(prev => ({ ...prev, ...updates }))
  }, [])

  const performSearch = useCallback(() => {
    setIsLoading(true)
    
    // Build search params
    const params = new URLSearchParams()
    
    // Handle location - skip if "all" or default
    if (searchState.location && searchState.location !== 'all' && searchState.location !== 'Location') {
      params.set('location', searchState.location)
    }
    
    // Handle property type - skip if "all" or default
    if (searchState.propertyType && searchState.propertyType !== 'all' && searchState.propertyType !== 'Property type') {
      params.set('property_type', searchState.propertyType)
    }
    
    // Handle bedrooms - skip if default
    if (searchState.bedrooms && searchState.bedrooms !== 'Bedrooms') {
      params.set('bedrooms', searchState.bedrooms)
    }
    
    // Handle bathrooms - skip if default
    if (searchState.bathrooms && searchState.bathrooms !== 'Bathrooms') {
      params.set('bathrooms', searchState.bathrooms)
    }
    
    if (searchState.search) params.set('search', searchState.search)

    // Navigate to properties page with search params
    const queryString = params.toString()
    const url = queryString ? `/properties?${queryString}` : '/properties'
    
    router.push(url)
    
    // Reset loading state after a short delay to allow navigation
    setTimeout(() => setIsLoading(false), 500)
  }, [searchState, router])

  const clearSearch = useCallback(() => {
    setSearchState(defaultSearchState)
    router.push('/properties')
  }, [router])

  const value: PropertySearchContextType = {
    searchState,
    isLoading,
    updateSearchState,
    performSearch,
    clearSearch
  }

  return (
    <PropertySearchContext.Provider value={value}>
      {children}
    </PropertySearchContext.Provider>
  )
}

export function usePropertySearch() {
  const context = useContext(PropertySearchContext)
  if (context === undefined) {
    throw new Error('usePropertySearch must be used within a PropertySearchProvider')
  }
  return context
}
