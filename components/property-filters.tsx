"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Filter, X } from "lucide-react"
import { COMMON_AMENITIES, COMMON_FEATURES, PROPERTY_TYPES } from "@/lib/properties"
import { useFilters } from "@/lib/filter-context"
import { usePriceRange } from "@/hooks/use-price-range"

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

export function PropertyFilters() {
  const { filters, updateFilters, clearFilters } = useFilters()
  const { priceRange, loading: priceLoading } = usePriceRange()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Local state for temporary values before applying
  const [tempFilters, setTempFilters] = useState(filters)

  // Sync temp filters with actual filters when they change
  useEffect(() => {
    setTempFilters(filters)
  }, [filters])

  const handleLocationChange = (location: string, checked: boolean) => {
    if (checked) {
      setTempFilters(prev => ({
        ...prev,
        selectedLocations: [...prev.selectedLocations, location]
      }))
    } else {
      setTempFilters(prev => ({
        ...prev,
        selectedLocations: prev.selectedLocations.filter((l: string) => l !== location)
      }))
    }
  }

  const handleTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setTempFilters(prev => ({
        ...prev,
        selectedTypes: [...prev.selectedTypes, type]
      }))
    } else {
      setTempFilters(prev => ({
        ...prev,
        selectedTypes: prev.selectedTypes.filter((t: string) => t !== type)
      }))
    }
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setTempFilters(prev => ({
        ...prev,
        selectedAmenities: [...prev.selectedAmenities, amenity]
      }))
    } else {
      setTempFilters(prev => ({
        ...prev,
        selectedAmenities: prev.selectedAmenities.filter((a: string) => a !== amenity)
      }))
    }
  }

  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      setTempFilters(prev => ({
        ...prev,
        selectedFeatures: [...prev.selectedFeatures, feature]
      }))
    } else {
      setTempFilters(prev => ({
        ...prev,
        selectedFeatures: prev.selectedFeatures.filter((f: string) => f !== feature)
      }))
    }
  }

  const handleApplyFilters = () => {
    updateFilters(tempFilters)
    setIsSheetOpen(false)
  }

  const handleClearFilters = () => {
    clearFilters()
    setTempFilters(filters)
  }

  const FilterContent = () => (
    <div className="flex flex-col h-full">
      {/* Price Range */}
      <div className="space-y-6 h-[70dvh] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-mj-gold [&::-webkit-scrollbar-thumb]:rounded-full pr-4 pb-4 mb-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Price Range (AED)</Label>
          <Slider
            value={tempFilters.priceRange}
            onValueChange={(value) => setTempFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
            max={priceRange.roundedMaxPrice}
            min={priceRange.roundedMinPrice}
            step={Math.max(Math.floor((priceRange.roundedMaxPrice - priceRange.roundedMinPrice) / 100), 10000)}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{tempFilters.priceRange[0].toLocaleString()}</span>
            <span>{tempFilters.priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium pl-2">Bedrooms</Label>
            <Select value={tempFilters.bedrooms} onValueChange={(value) => setTempFilters(prev => ({ ...prev, bedrooms: value }))}>
              <SelectTrigger className="border-mj-gold/20 w-full cursor-pointer">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5+">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium pl-2">Bathrooms</Label>
            <Select value={tempFilters.bathrooms} onValueChange={(value) => setTempFilters(prev => ({ ...prev, bathrooms: value }))}>
              <SelectTrigger className="border-mj-gold/20 w-full cursor-pointer">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5+">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Location</Label>
          <div className="space-y-2  ">
            {locations.map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={location}
                  checked={tempFilters.selectedLocations.includes(location)}
                  onCheckedChange={(checked) => handleLocationChange(location, checked as boolean)}
                />
                <Label htmlFor={location} className="text-sm font-normal cursor-pointer">
                  {location}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Property Type */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Property Type</Label>
          <div className="space-y-2">
            {PROPERTY_TYPES.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={tempFilters.selectedTypes.includes(type)}
                  onCheckedChange={(checked) => handleTypeChange(type, checked as boolean)}
                />
                <Label htmlFor={type} className="text-sm font-normal cursor-pointer">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Features</Label>
          <div className="space-y-2">
            {COMMON_FEATURES.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  checked={tempFilters.selectedFeatures.includes(feature)}
                  onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
                />
                <Label htmlFor={feature} className="text-sm font-normal cursor-pointer">
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Amenities</Label>
          <div className="space-y-2">
            {COMMON_AMENITIES.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={tempFilters.selectedAmenities.includes(amenity)}
                  onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                />
                <Label htmlFor={amenity} className="text-sm font-normal cursor-pointer">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div >

      <Button onClick={handleApplyFilters} className="w-full bg-mj-gold text-mj-teal hover:bg-mj-gold/90 mt-auto">Apply Filters</Button>
    </div>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className=" border-mj-gold/20 text-mj-gold hover:bg-mj-gold/10">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] bg-mj-teal border-mj-gold/20">
            <SheetHeader className="border-b border-mj-gold/20 pb-4">
              <SheetTitle className="flex items-center gap-2 text-mj-gold">
                <Filter className="h-5 w-5" />
                Filters
              </SheetTitle>
            </SheetHeader>
            <div className="py-6 px-4 h-full">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Card */}
      <div className="hidden lg:block">
        <Card className="border-mj-gold/20 pt-6 w-full max-w-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
              <Filter className="h-4 w-4 lg:h-5 lg:w-5 text-mj-gold" />
              Filters
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-muted-foreground text-xs lg:text-sm">
              <X className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
              Clear All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <FilterContent />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
