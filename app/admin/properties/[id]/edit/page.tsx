"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { propertyFormSchema, PropertyFormData } from "@/lib/schemas/property"
import { getProperty, updateProperty } from "@/lib/properties"
import { Property } from "@/lib/properties"
import { PropertyEditForm } from "@/components/admin"

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      property_type: undefined,
      status: 'available',
      price: 0,
      area_value: 0,
      area_unit: 'sq ft',
      bedrooms: 0,
      bathrooms: 0,
      parking_spaces: 0,
      floor_number: 0,
      year_built: new Date().getFullYear(),
      display_order: 0,
      amenities: [],
      features: [],
      is_featured: false,
      is_hot_property: false,
      images: [],
    },
  })

  // Fetch property data when component mounts
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setIsLoading(true)
        const response = await getProperty(params.id as string)
        const propertyData = response.data
        setProperty(propertyData)

        // Populate form with existing data
        const formData: PropertyFormData = {
          title: propertyData.title,
          description: propertyData.description,
          location: propertyData.location,
          property_type: propertyData.property_type as any,
          status: propertyData.status as any,
          price: propertyData.price,
          area_value: propertyData.area_value,
          area_unit: propertyData.area_unit as any,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          parking_spaces: propertyData.parking_spaces,
          floor_number: propertyData.floor_number,
          year_built: propertyData.year_built,
          display_order: propertyData.display_order,
          amenities: propertyData.amenities || [],
          features: propertyData.features || [],
          is_featured: propertyData.is_featured,
          is_hot_property: propertyData.is_hot_property,
          images: propertyData.images?.map(img => ({
            image_url: img.image_url,
            image_alt: img.image_alt,
            order: img.order,
          })) || [],
        }

        // Reset form with fetched data
        form.reset(formData)
      } catch (error) {
        console.error('Error fetching property:', error)
        toast.error('Failed to load property data')
        router.push('/admin/properties')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchPropertyData()
    }
  }, [params.id, form, router])

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true)
    try {
      await updateProperty(params.id as string, data)
      toast.success('Property updated successfully!')
      router.push('/admin/properties')
    } catch (error) {
      console.error('Error updating property:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update property')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mj-teal via-mj-teal-light to-mj-dark text-mj-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-mj-gold" />
              <div className="text-lg text-mj-white/80">Loading property data...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mj-teal via-mj-teal-light to-mj-dark text-mj-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-lg text-mj-white/80 mb-4">Property not found</div>
              <Button
                variant="outline"
                className="border-mj-gold text-mj-gold hover:bg-mj-gold hover:text-mj-teal"
                onClick={() => router.push('/admin/properties')}
              >
                Back to Properties
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mj-teal via-mj-teal-light to-mj-dark text-mj-white">
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col items-start gap-4 mb-4">
          <Link href="/admin/properties">
            <Button
              variant="outline"
              size="sm"
              className="border-mj-gold text-mj-gold hover:bg-mj-gold hover:text-mj-white bg-transparent cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-mj-gold">Edit Property</h1>
            <p className="text-mj-white/80">Update property: {property.title}</p>
          </div>
        </div>
      </div>

      <PropertyEditForm
        form={form}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        property={property}
        onCancel={() => router.push('/admin/properties')}
      />
      </div>
    </div>
  )
}
