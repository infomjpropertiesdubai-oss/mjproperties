"use client"

import { useState, useEffect } from "react"
import { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { PropertyFormData } from "@/lib/schemas/property"
import { Property } from "@/lib/properties"
import { ImageUploadSortable, UploadedImage } from "@/components/ui/image-upload-sortable"

interface PropertyImagesProps {
  form: UseFormReturn<PropertyFormData>
  property: Property
}

export function PropertyImages({ form, property }: PropertyImagesProps) {
  const [images, setImages] = useState<UploadedImage[]>([])

  // Initialize images from property data when component mounts
  useEffect(() => {
    if (property.images && property.images.length > 0) {
      const initialImages: UploadedImage[] = property.images.map((img, index) => ({
        id: `existing-${index}`,
        image_url: img.image_url,
        image_alt: img.image_alt || '',
        order: img.order,
      }))
      setImages(initialImages)
    }
  }, [property.images])

  const handleImagesChange = (newImages: UploadedImage[]) => {
    setImages(newImages)
    // Convert UploadedImage[] to the format expected by the form schema
    const formImages = newImages.map(img => ({
      image_url: img.image_url,
      image_alt: img.image_alt || '',
      order: img.order
    }))
    form.setValue('images', formImages)
  }

  return (
    <Card className="bg-mj-teal-light border-mj-gold/20 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-mj-gold">Property Images</CardTitle>
        <CardDescription className="text-mj-white/80">
          Drag and drop images or click to upload. Images will be automatically uploaded to Cloudinary.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageUploadSortable
                  images={images}
                  onImagesChange={handleImagesChange}
                  maxImages={15}
                  folder="properties"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
