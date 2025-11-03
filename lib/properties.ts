// Property API utility functions
import { Database } from '@/database.types'

export type PropertyRow = Database['public']['Tables']['properties']['Row']
export type PropertyInsert = Database['public']['Tables']['properties']['Insert']
export type PropertyUpdate = Database['public']['Tables']['properties']['Update']

export type PropertyImageRow = Database['public']['Tables']['property_images']['Row']
export type PropertyImageInsert = Database['public']['Tables']['property_images']['Insert']

export interface Property extends Omit<PropertyRow, 'amenities' | 'features'> {
  amenities: string[]
  features: string[]
  images?: PropertyImageRow[]
}

export interface CreatePropertyData extends Omit<PropertyInsert, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'is_deleted'> {
  images?: Array<{
    image_url: string
    image_alt: string
    order: number
  }>
}

export interface PropertyResponse {
  data: Property
  message?: string
  timestamp?: string
}

export interface PropertiesListResponse {
  data: Property[]
  pagination: {
    limit: number
    offset: number
    total: number
  }
}

export interface ApiError {
  error: string
  details?: string[]
}

// Property type options
export const PROPERTY_TYPES = [
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

// Property status options
export const PROPERTY_STATUS = [
  'available',
  'sold',
  'rented',
  'pending',
  'off-market'
] as const

// Area units
export const AREA_UNITS = [
  'sq ft',
  'sq m'
] as const

// Create a new property
export async function createProperty(property: CreatePropertyData): Promise<PropertyResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(property),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create property')
  }

  return data
}

// Get all properties with optional filtering and pagination
export async function getProperties(options?: {
  status?: string
  property_type?: string
  is_featured?: boolean
  is_hot_property?: boolean
  min_price?: number
  max_price?: number
  bedrooms?: number
  bathrooms?: number
  location?: string
  limit?: number
  offset?: number
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  amenities?: string
  features?: string
}): Promise<PropertiesListResponse> {
  const params = new URLSearchParams()
  
  if (options?.status) {
    params.append('status', options.status)
  }
  if (options?.property_type) {
    params.append('property_type', options.property_type)
  }
  if (options?.is_featured !== undefined) {
    params.append('is_featured', options.is_featured.toString())
  }
  if (options?.is_hot_property !== undefined) {
    params.append('is_hot_property', options.is_hot_property.toString())
  }
  if (options?.min_price) {
    params.append('min_price', options.min_price.toString())
  }
  if (options?.max_price) {
    params.append('max_price', options.max_price.toString())
  }
  if (options?.bedrooms) {
    params.append('bedrooms', options.bedrooms.toString())
  }
  if (options?.bathrooms) {
    params.append('bathrooms', options.bathrooms.toString())
  }
  if (options?.location) {
    params.append('location', options.location)
  }
  if (options?.limit) {
    params.append('limit', options.limit.toString())
  }
  if (options?.offset) {
    params.append('offset', options.offset.toString())
  }
  if (options?.search) {
    params.append('search', options.search)
  }
  if (options?.sort_by) {
    params.append('sort_by', options.sort_by)
  }
  if (options?.sort_order) {
    params.append('sort_order', options.sort_order)
  }
  if (options?.amenities) {
    params.append('amenities', options.amenities)
  }
  if (options?.features) {
    params.append('features', options.features)
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties?${params.toString()}`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch properties')
  }

  return data
}

// Get a specific property by ID
export async function getProperty(id: string): Promise<PropertyResponse> {
  
  // For server-side execution, use Supabase directly
  if (typeof window === 'undefined') {
    const { supabase } = await import('@/lib/supabase')
    
    
    const { data: propertyData, error } = await supabase
      .from('properties')
      .select('*, property_images(*)')
      .eq('id', id)
      .eq('is_deleted', false)
      .single()

    if (error) {
      console.error('Error fetching property:', error)
      if (error.code === 'PGRST116') {
        throw new Error('Property not found')
      }
      throw new Error(`Failed to fetch property: ${error.message}`)
    }

    if (!propertyData) {
      console.error('Property not found for ID:', id)
      throw new Error('Property not found')
    }

    // Transform data to include images array
    const property = {
      ...propertyData,
      images: propertyData.property_images || []
    }

    return {
      data: property,
      timestamp: new Date().toISOString()
    }
  }

  // For client-side execution, use fetch
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/${id}`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch property')
  }

  return data
}

export async function getFeaturedProperties(): Promise<PropertiesListResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/featured`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching featured properties:', error)
    throw error
  }
}

export async function getHotProperties(): Promise<PropertiesListResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/hot`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching hot properties:', error)
    throw error
  }
}

// Update a property
export async function updateProperty(id: string, property: Partial<CreatePropertyData>): Promise<PropertyResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(property),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update property')
  }

  return data
}

// Delete a property
export async function deleteProperty(id: string): Promise<{ message: string }> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/${id}`, {
    method: 'DELETE',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete property')
  }

  return data
}

// Get similar properties based on current property characteristics
export async function getSimilarProperties(currentPropertyId: string, limit: number = 3): Promise<PropertiesListResponse> {
  const params = new URLSearchParams()
  params.append('current_property_id', currentPropertyId)
  params.append('limit', limit.toString())

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/similar?${params.toString()}`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch similar properties')
  }

  return data
}

// Validation helper function
export function validatePropertyForm(data: CreatePropertyData): string[] {
  const errors: string[] = []

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required')
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push('Description is required')
  }

  if (!data.location || data.location.trim().length === 0) {
    errors.push('Location is required')
  }

  if (!data.property_type || data.property_type.trim().length === 0) {
    errors.push('Property type is required')
  }

  if (!data.status || data.status.trim().length === 0) {
    errors.push('Status is required')
  }

  if (!data.area_unit || data.area_unit.trim().length === 0) {
    errors.push('Area unit is required')
  }

  if (data.price <= 0) {
    errors.push('Price must be greater than 0')
  }

  if (data.area_value <= 0) {
    errors.push('Area must be greater than 0')
  }

  if (data.bedrooms < 0) {
    errors.push('Bedrooms cannot be negative')
  }

  if (data.bathrooms < 0) {
    errors.push('Bathrooms cannot be negative')
  }

  if (data.parking_spaces < 0) {
    errors.push('Parking spaces cannot be negative')
  }

  if (data.floor_number < 0) {
    errors.push('Floor number cannot be negative')
  }

  if (data.year_built < 1800 || data.year_built > new Date().getFullYear() + 5) {
    errors.push('Year built must be a valid year')
  }

  if (data.display_order < 0) {
    errors.push('Display order cannot be negative')
  }

  return errors
}

// Common amenities
export const COMMON_AMENITIES = [
  'Swimming Pool',
  'Gym/Fitness Center',
  'Parking',
  '24/7 Security',
  'Balcony',
  'Garden',
  'Elevator',
  'Central AC',
  'Built-in Wardrobes',
  'Maid Room',
  'Study Room',
  'Storage Room',
  'Laundry Room',
  'Kitchen Appliances',
  'Furnished',
  'Unfurnished',
  'Internet',
  'Cable TV',
  'Concierge',
  'Valet Parking',
  'Children Play Area',
  'BBQ Area',
  'Sauna',
  'Steam Room',
  'Jacuzzi',
  'Business Center',
  'Conference Room',
  'Prayer Room',
  'Basement',
  'Terrace',
  'Sea View',
  'City View',
  'Mountain View',
  'Garden View',
  'Pool View'
] as const

// Common features
export const COMMON_FEATURES = [
  'Marble Floors',
  'Hardwood Floors',
  'Ceramic Tiles',
  'High Ceilings',
  'Floor-to-Ceiling Windows',
  'Walk-in Closet',
  'En-suite Bathroom',
  'Guest Bathroom',
  'Powder Room',
  'Open Kitchen',
  'Closed Kitchen',
  'Kitchen Island',
  'Breakfast Bar',
  'Pantry',
  'Utility Room',
  'Home Office',
  'Library',
  'Wine Cellar',
  'Home Theater',
  'Fireplace',
  'Smart Home System',
  'Solar Panels',
  'Private Entrance',
  'Separate Entrance',
  'Double Glazed Windows',
  'Soundproof',
  'Wheelchair Accessible',
  'Pet Friendly'
] as const
