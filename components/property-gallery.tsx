"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Grid3X3, Play, X } from "lucide-react"
import { getProperty, Property } from "@/lib/properties"

interface PropertyGalleryProps {
  propertyId: string
}

export function PropertyGallery({ propertyId }: PropertyGalleryProps) {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImage, setCurrentImage] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  // Fetch property data including images
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

  // Get images array from property data
  const images = property?.images?.sort((a, b) => a.order - b.order).map(img => img.image_url) || []
  const title = property?.title || ''

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  // Loading state
  if (loading) {
    return (
      <div className="h-[60vh] bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading property gallery...</div>
      </div>
    )
  }

  // Error state
  if (error || !property) {
    return (
      <div className="h-[60vh] bg-gray-100 flex items-center justify-center">
        <div className="text-red-500">{error || 'Property not found'}</div>
      </div>
    )
  }

  // No images state
  if (images.length === 0) {
    return (
      <div className="h-[60vh] bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-2">No images available</div>
          <div className="text-2xl font-bold">{title}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Main Gallery */}
      <div className="grid grid-cols-4 gap-2 h-[60vh]">
        {/* Main Image */}
        <div className={`col-span-4 ${images.length === 1 ? "md:col-span-4" : "md:col-span-3"} relative overflow-hidden rounded-lg `}>
          <Image
            src={images[0] || "/placeholder.svg"}
            alt={title}
            fill
            className="h-[60vh] object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setIsGalleryOpen(true)}
          />
          <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors" />
        </div>

        {/* Thumbnail Grid - Only show if more than 1 image */}
        {images.length > 1 && (
          <div className="hidden md:flex flex-col gap-2">
            {images.slice(1, 5).map((image, index) => (
              <div key={index} className="relative flex-1 overflow-hidden rounded-lg">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${title} - Image ${index + 2}`}
                  fill
                  className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => {
                    setCurrentImage(index + 1)
                    setIsGalleryOpen(true)
                  }}
                />
                {index === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-semibold">+{images.length - 5} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gallery Controls */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        {images.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsGalleryOpen(true)}
            className="bg-white/90 text-black hover:bg-white"
          >
            <Grid3X3 className="mr-2 h-4 w-4" />
            View All Photos ({images.length})
          </Button>
        )}
        <Button variant="secondary" size="sm" className="bg-white/90 text-black hover:bg-white">
          <Play className="mr-2 h-4 w-4" />
          Virtual Tour
        </Button>
      </div>

      {/* Full Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-6xl w-full h-[90vh] p-0">
          <div className="relative w-full h-full bg-black">
            <Image
              src={images[currentImage] || "/placeholder.svg"}
              alt={`${title} - Image ${currentImage + 1}`}
              fill
              className="object-contain"
            />

            {/* Navigation */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={prevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Close Button */}
            {/* <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setIsGalleryOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button> */}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentImage + 1} / {images.length}
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`relative w-16 h-12 flex-shrink-0 overflow-hidden rounded cursor-pointer ${
                    index === currentImage ? "ring-2 ring-mj-gold" : ""
                  }`}
                  onClick={() => setCurrentImage(index)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
