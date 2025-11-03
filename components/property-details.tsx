"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Bed, Bath, Square } from "lucide-react"
import { FaShareAlt } from "react-icons/fa"
import { getProperty, Property } from "@/lib/properties"
import { ShareModal } from "./share-modal"
import { formatPrice } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface PropertyDetailsProps {
  propertyId: string
}

export function PropertyDetails({ propertyId }: PropertyDetailsProps) {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getProperty(propertyId)
        setProperty(response.data)
      } catch (err) {
        console.error('Error fetching property:', err)
        setError(err instanceof Error ? err.message : 'Failed to load property')
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId])

  // Helper functions to format data

  const formatArea = (areaValue: number, areaUnit: string) => {
    return `${areaValue.toLocaleString()} ${areaUnit}`
  }

  const getPropertySpecifications = (property: Property) => {
    return {
      "Property Type": property.property_type,
      "Built Year": property.year_built.toString(),
      "Furnishing": property.features.includes('Furnished') ? 'Fully Furnished' : 
                   property.features.includes('Unfurnished') ? 'Unfurnished' : 'Semi Furnished',
      "Parking": `${property.parking_spaces} Space${property.parking_spaces !== 1 ? 's' : ''}`,
      "Floor": property.floor_number > 0 ? `${property.floor_number}${getOrdinalSuffix(property.floor_number)} Floor` : 'Ground Floor',
      "Area": formatArea(property.area_value, property.area_unit),
      "Status": property.status.charAt(0).toUpperCase() + property.status.slice(1)
    }
  }

  const getOrdinalSuffix = (num: number) => {
    const j = num % 10
    const k = num % 100
    if (j === 1 && k !== 11) return 'st'
    if (j === 2 && k !== 12) return 'nd'
    if (j === 3 && k !== 13) return 'rd'
    return 'th'
  }

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Property Header Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-3/4" />
            </div>
            <Skeleton className="h-9 w-20" />
          </div>

          <div className="flex items-center">
            <Skeleton className="h-5 w-5 mr-2" />
            <Skeleton className="h-6 w-48" />
          </div>

          <Skeleton className="h-10 w-64" />

          {/* Property Stats Skeleton */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
        </div>

        <Separator className="border-mj-gold/20" />

        {/* Description Skeleton */}
        <Card className="border-mj-gold/20 pt-6">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>

        {/* Features Skeleton */}
        <Card className="border-mj-gold/20 pt-6">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Amenities Skeleton */}
        <Card className="border-mj-gold/20 pt-6">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-6 w-20" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Specifications Skeleton */}
        <Card className="border-mj-gold/20 pt-6">
          <CardHeader>
            <Skeleton className="h-6 w-56" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="flex justify-between py-2 border-b border-mj-gold/10 last:border-b-0">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="space-y-8">
        <div className="text-red-500">
          {error || 'Property not found'}
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-8">
      {/* Property Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-mj-gold text-mj-teal">{property.property_type}</Badge>
          <Badge variant="outline" className={
            property.status === 'available' ? 'border-green-500 text-green-600' :
            property.status === 'sold' ? 'border-red-500 text-red-600' :
            property.status === 'rented' ? 'border-blue-500 text-blue-600' :
            'border-yellow-500 text-yellow-600'
          }>
            {property.status === 'available' ? 'For Sale' : 
             property.status === 'rented' ? 'For Rent' :
             property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </Badge>
          {property.is_featured && <Badge className="bg-mj-gold text-mj-teal">Featured</Badge>}
          {property.is_hot_property && <Badge variant="destructive">Hot Property</Badge>}
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-balance">{property.title}</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-mj-gold/30 text-mj-gold hover:bg-mj-gold/10 hover:border-mj-gold cursor-pointer"
            onClick={() => setIsShareModalOpen(true)}
          >
            <FaShareAlt className="text-sm" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>

        <div className="flex items-center text-muted-foreground">
          <MapPin className="h-5 w-5 mr-2" />
          <span className="text-lg">{property.location}</span>
        </div>

        <div className="text-3xl md:text-4xl font-bold text-mj-gold">{formatPrice(property.price)}</div>

        {/* Property Stats */}
        <div className="flex flex-wrap gap-6 text-lg">
          <div className="flex items-center gap-2">
            <Bed className="h-5 w-5 text-mj-gold" />
            <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="h-5 w-5 text-mj-gold" />
            <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Square className="h-5 w-5 text-mj-gold" />
            <span>{formatArea(property.area_value, property.area_unit)}</span>
          </div>
        </div>
      </div>

      <Separator className="border-mj-gold/20" />

      {/* Description */}
      <Card className="border-mj-gold/20 pt-6">
        <CardHeader>
          <CardTitle>Property Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{property.description}</p>
        </CardContent>
      </Card>

      {/* Features */}
      {property.features && property.features.length > 0 && (
        <Card className="border-mj-gold/20 pt-6">
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {property.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-mj-gold rounded-full" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Amenities */}
      {property.amenities && property.amenities.length > 0 && (
        <Card className="border-mj-gold/20 pt-6">
          <CardHeader>
            <CardTitle>Building Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity, index) => (
                <Badge key={index} variant="outline" className="border-mj-gold/40">
                  {amenity}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Specifications */}
      <Card className="border-mj-gold/20 pt-6">
        <CardHeader>
          <CardTitle>Property Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(getPropertySpecifications(property)).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-mj-gold/10 last:border-b-0">
                <span className="font-medium">{key}:</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareData={{
          title: property.title,
          text: `${property.property_type} in ${property.location} - ${formatPrice(property.price)} | ${property.bedrooms} bed, ${property.bathrooms} bath, ${formatArea(property.area_value, property.area_unit)}`,
          url: `${typeof window !== 'undefined' ? window.location.origin : ''}/properties/${propertyId}`
        }}
      />
    </div>
  )
}
