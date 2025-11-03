"use client"

import { UseFormReturn } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { PropertyFormData } from "@/lib/schemas/property"
import { Property } from "@/lib/properties"
import {
  PropertyBasicInfo,
  PropertyDetails,
  PropertyAmenities,
  PropertyFeatures,
  PropertyOptions,
  PropertyImages,
} from "./property-forms"

interface PropertyEditFormProps {
  form: UseFormReturn<PropertyFormData>
  onSubmit: (data: PropertyFormData) => Promise<void>
  isSubmitting: boolean
  property: Property
  onCancel: () => void
}

export function PropertyEditForm({
  form,
  onSubmit,
  isSubmitting,
  property,
  onCancel,
}: PropertyEditFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <PropertyBasicInfo form={form} />

        {/* Property Details */}
        <PropertyDetails form={form} />

        {/* Amenities */}
        <PropertyAmenities form={form} />

        {/* Features */}
        <PropertyFeatures form={form} />

        {/* Property Options */}
        <PropertyOptions form={form} />

        {/* Property Images */}
        <PropertyImages form={form} property={property} />

        {/* Submit */}
        <div className="flex gap-4">
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="bg-mj-gold hover:bg-mj-gold-light text-mj-teal shadow-lg"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Update Property
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="border-mj-gold text-mj-gold hover:bg-mj-gold hover:text-mj-teal"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
