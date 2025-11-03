import { z } from 'zod'

// Define these constants here to avoid circular imports
const PROPERTY_TYPES = [
  'Apartment',
  'Villa',
  'Penthouse',
  'Townhouse',
  'Studio',
  'Duplex',
  'Office',
  'Retail',
  'Warehouse',
  'Land'
] as const

const PROPERTY_STATUS = [
  'available',
  'sold',
  'rented',
  'pending',
  'off-market'
] as const

const AREA_UNITS = [
  'sq ft',
  'sq m'
] as const

export const propertyFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required').max(255, 'Location is too long'),
  property_type: z.enum(PROPERTY_TYPES, {
    required_error: 'Property type is required',
  }),
  status: z.enum(PROPERTY_STATUS, {
    required_error: 'Status is required',
  }),
  price: z.number().min(1, 'Price must be greater than 0'),
  area_value: z.number().min(1, 'Area must be greater than 0'),
  area_unit: z.enum(AREA_UNITS, {
    required_error: 'Area unit is required',
  }),
  bedrooms: z.number().min(0, 'Bedrooms cannot be negative'),
  bathrooms: z.number().min(0, 'Bathrooms cannot be negative'),
  parking_spaces: z.number().min(0, 'Parking spaces cannot be negative'),
  floor_number: z.number().min(0, 'Floor number cannot be negative'),
  year_built: z.number()
    .min(1800, 'Year built must be after 1800')
    .max(new Date().getFullYear() + 5, 'Year built cannot be more than 5 years in the future'),
  display_order: z.number().min(0, 'Display order cannot be negative').default(0),
  amenities: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  is_featured: z.boolean().default(false),
  is_hot_property: z.boolean().default(false),
  images: z.array(z.object({
    image_url: z.string().url('Invalid image URL'),
    image_alt: z.string().optional().default(''),
    order: z.number().min(0, 'Image order cannot be negative'),
  })).optional().default([])
})

export type PropertyFormData = z.infer<typeof propertyFormSchema>
