// Hero Section API utility functions
import { Database } from '@/database.types'

export type HeroSectionRow = Database['public']['Tables']['hero_section']['Row']
export type HeroSectionInsert = Database['public']['Tables']['hero_section']['Insert']
export type HeroSectionUpdate = Database['public']['Tables']['hero_section']['Update']

export interface HeroSection extends HeroSectionRow {}

export interface CreateHeroSectionData extends Omit<HeroSectionInsert, 'id' | 'created_at'> {}

export interface HeroSectionResponse {
  data: HeroSection
  message?: string
  timestamp?: string
}

export interface HeroSectionsListResponse {
  data: HeroSection[]
  pagination?: {
    limit: number
    offset: number
    total: number
  }
}

export interface ApiError {
  error: string
  details?: string[]
}

// Create a new hero section
export async function createHeroSection(heroSection: CreateHeroSectionData): Promise<HeroSectionResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hero-sections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(heroSection),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create hero section')
  }

  return data
}

// Get all hero sections
export async function getHeroSections(options?: {
  limit?: number
  offset?: number
}): Promise<HeroSectionsListResponse> {
  const params = new URLSearchParams()

  if (options?.limit) params.append('limit', options.limit.toString())
  if (options?.offset) params.append('offset', options.offset.toString())

  const queryString = params.toString()
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/hero-sections${queryString ? `?${queryString}` : ''}`

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch hero sections')
  }

  return data
}

// Get a single hero section by ID
export async function getHeroSectionById(id: string): Promise<HeroSectionResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hero-sections/${id}`, {
    method: 'GET',
    cache: 'no-store',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch hero section')
  }

  return data
}

// Update a hero section
export async function updateHeroSection(
  id: string,
  heroSection: Partial<CreateHeroSectionData>
): Promise<HeroSectionResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hero-sections/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(heroSection),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update hero section')
  }

  return data
}

// Delete a hero section
export async function deleteHeroSection(id: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hero-sections/${id}`, {
    method: 'DELETE',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete hero section')
  }

  return data
}
