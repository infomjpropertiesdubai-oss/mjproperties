"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Loader2, X } from "lucide-react"
import { usePropertySearch } from "@/lib/property-search-context"
import { usePriceRange } from "@/hooks/use-price-range"
import CustomDropdown from "./ui/customDropdown"
import { useState, useEffect } from "react"
import { COMMON_AMENITIES, COMMON_FEATURES, PROPERTY_TYPES } from "@/lib/properties"

// Static location data - matching PropertyFilterV2
const locations = [
  "Downtown Dubai",
  "Dubai Marina", 
  "Business Bay",
  "JBR",
  "Palm Jumeirah",
  "Jumeirah Village Circle",
  "Dubai Hills Estate",
  "City Walk",
  "DIFC",
  "Bluewaters Island",
]

const BEDROOM_OPTIONS = [
  "Studio",
  "1",
  "2", 
  "3",
  "4",
  "5+"
]
const BATHROOM_OPTIONS = [
  "1",
  "2",
  "3", 
  "4",
  "5+"
]
export function PropertySearch() {
  const { searchState, isLoading, updateSearchState, performSearch, clearSearch } = usePropertySearch()
  const { priceRange, loading: priceLoading } = usePriceRange()
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([])
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([])
  const [selectedBathrooms, setSelectedBathrooms] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([0, 2000])
  
  const hasActiveSearch = Object.entries(searchState).some(([key, value]) => {
    if (value === "") return false
    if (key === 'location' && value === 'all') return false
    if (key === 'propertyType' && value === 'all') return false
    if (key === 'bedrooms' && value === 'all') return false
    if (key === 'bathrooms' && value === 'all') return false
    return true
  })

  // Initialize price range from hook
  useEffect(() => {
    if (priceRange) {
      setLocalPriceRange([priceRange.roundedMinPrice, priceRange.roundedMaxPrice])
    }
  }, [priceRange])

  const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (item: string) => {
    setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handlePerformSearch = () => {
    // Build URL parameters
    const params = new URLSearchParams();
    
    if (searchState.search.trim()) {
      params.set('search', searchState.search.trim());
    }
    
    // Add price range parameters
    if (priceRange && (localPriceRange[0] !== priceRange.roundedMinPrice || localPriceRange[1] !== priceRange.roundedMaxPrice)) {
      params.set('min_price', localPriceRange[0].toString());
      params.set('max_price', localPriceRange[1].toString());
    }
    
    if (selectedLocations.length > 0) {
      params.set('location', selectedLocations.join(','));
    }
    
    if (selectedPropertyTypes.length > 0) {
      params.set('property_type', selectedPropertyTypes.join(','));
    }
    
    if (selectedBedrooms.length > 0) {
      params.set('bedrooms', selectedBedrooms.join(','));
    }
    
    if (selectedBathrooms.length > 0) {
      params.set('bathrooms', selectedBathrooms.join(','));
    }
    
    if (selectedFeatures.length > 0) {
      params.set('features', selectedFeatures.join(','));
    }
    
    if (selectedAmenities.length > 0) {
      params.set('amenities', selectedAmenities.join(','));
    }
    
    // Navigate to properties page with filters
    const queryString = params.toString();
    const url = queryString ? `/properties?${queryString}` : '/properties';
    window.location.href = url;
  };

  return (
    <div className="w-full bg-mj-teal-light backdrop-blur-sm shadow-lg mb-8 rounded-lg p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-2 md:mb-4">
        <Search className="h-4 w-4 sm:h-5 sm:w-5 text-mj-gold" />
        <h2 className="text-base sm:text-lg font-semibold">Find Your Dream Property</h2>
      </div>

      <div className="w-full flex flex-row justify-center items-end">
        {/* Search Input */}
        <div className="flex flex-col lg:flex-row gap-2 w-full justify-center md:items-end">
          <div className="flex flex-col gap-1 md:gap-2 w-full">
            <label className="text-xs sm:text-sm font-medium text-muted-foreground pl-2">Search Properties</label>
            <Input
              placeholder="Search by title, location, or description..."
              value={searchState.search}
              onChange={(e) => updateSearchState({ search: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  performSearch()
                }
              }}
              className="border-mj-gold/20 focus:border-mj-gold text-sm"
            />
          </div>
          <div className="flex flex-row gap-2 w-full">
          <div className="flex flex-col gap-1 md:gap-2 w-full">
            <label className="text-xs sm:text-sm font-medium text-muted-foreground pl-2">Location</label>
            <CustomDropdown title={selectedLocations.length > 0 ? `${selectedLocations.length} selected` : "Select location"} placeholder="Select location">
              <div className="overflow-y-auto max-h-48">
                {locations.map((location) => (
                  <div key={location} className="cursor-pointer hover:bg-mj-teal px-3 py-1 rounded-sm text-xs sm:text-sm flex items-center gap-2" onClick={() => handleCheckboxChange(setSelectedLocations)(location)}>
                    <input 
                      type="checkbox" 
                      checked={selectedLocations.includes(location)}
                      onChange={() => {}} // Handled by onClick
                      className="w-3 h-3"
                    />
                    {location}
                  </div>
                ))}
              </div>
            </CustomDropdown>
          </div>
          <div className="flex flex-col gap-1 md:gap-2 w-full">
            <label className="text-xs sm:text-sm font-medium text-muted-foreground pl-2">Property Type</label>
            <CustomDropdown title={selectedPropertyTypes.length > 0 ? `${selectedPropertyTypes.length} selected` : "Select property type"} placeholder="Select property type">
              <div className="overflow-y-auto max-h-48">
                {PROPERTY_TYPES.map((type) => (
                  <div key={type} className="cursor-pointer hover:bg-mj-teal px-3 py-1 rounded-sm text-xs sm:text-sm flex items-center gap-2" onClick={() => handleCheckboxChange(setSelectedPropertyTypes)(type)}>
                    <input 
                      type="checkbox" 
                      checked={selectedPropertyTypes.includes(type)}
                      onChange={() => {}} // Handled by onClick
                      className="w-3 h-3"
                    />
                    {type}
                  </div>
                ))}
              </div>
            </CustomDropdown>
          </div>
          </div>
          <div className="flex flex-row gap-2 w-full">
            <div className="flex flex-col gap-1 md:gap-2 w-full ">
              <label className="text-xs sm:text-sm font-medium text-muted-foreground pl-2">Bedrooms</label>
              <CustomDropdown title={selectedBedrooms.length > 0 ? `${selectedBedrooms.length} selected` : "Bedrooms"} placeholder="Bedrooms">
                <div className="overflow-y-auto max-h-48">
                  {BEDROOM_OPTIONS.map((option) => (
                    <div key={option} className="cursor-pointer hover:bg-mj-teal px-3 py-1 rounded-sm text-xs sm:text-sm flex items-center gap-2" onClick={() => handleCheckboxChange(setSelectedBedrooms)(option)}>
                      <input 
                        type="checkbox" 
                        checked={selectedBedrooms.includes(option)}
                        onChange={() => {}} // Handled by onClick
                        className="w-3 h-3"
                      />
                      {option}
                    </div>
                  ))}
                </div>
              </CustomDropdown>
            </div>
            <div className="flex flex-col gap-1 md:gap-2 w-full ">
              <label className="text-xs sm:text-sm font-medium text-muted-foreground pl-2">Bathrooms</label>
              <CustomDropdown title={selectedBathrooms.length > 0 ? `${selectedBathrooms.length} selected` : "Bathrooms"} placeholder="Bathrooms">
                <div className="overflow-y-auto max-h-48">
                  {BATHROOM_OPTIONS.map((option) => (
                    <div key={option} className="cursor-pointer hover:bg-mj-teal px-3 py-1 rounded-sm text-xs sm:text-sm flex items-center gap-2" onClick={() => handleCheckboxChange(setSelectedBathrooms)(option)}>
                      <input 
                        type="checkbox" 
                        checked={selectedBathrooms.includes(option)}
                        onChange={() => {}} // Handled by onClick
                        className="w-3 h-3"
                      />
                      {option}
                    </div>
                  ))}
                </div>
              </CustomDropdown>
            </div>
          </div>
          <div className=" h-full flex justify-end items-end">
            <Button 
              className="w-full md:w-auto" 
              onClick={handlePerformSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
