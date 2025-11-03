import { z } from 'zod'

// Define inquiry types and budget ranges based on the contact form
const INQUIRY_TYPES = [
  'buying',
  'selling',
  'renting',
  'investment',
  'valuation',
  'other'
] as const

const BUDGET_RANGES = [
  'under-1m',
  '1m-2m',
  '2m-5m',
  '5m-10m',
  '10m-20m',
  'over-20m'
] as const

const LOCATIONS = [
  'downtown',
  'marina',
  'jbr',
  'business-bay',
  'palm',
  'hills',
  'other'
] as const

export const consultationRequestSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100, 'First name is too long'),
  last_name: z.string().min(1, 'Last name is required').max(100, 'Last name is too long'),
  email: z.string().email('Invalid email address').max(255, 'Email is too long'),
  phone: z.string().min(1, 'Phone number is required').max(20, 'Phone number is too long'),
  type_of_inquiry: z.enum(INQUIRY_TYPES, {
    required_error: 'Type of inquiry is required',
  }),
  budget_range: z.enum(BUDGET_RANGES).or(z.literal("")),
  preferred_location: z.enum(LOCATIONS).or(z.literal("")),
  message: z.string().max(1000, 'Message is too long').default(""),
  subscribe_to_newsletter: z.boolean().default(false).optional(),
})

export type ConsultationRequestData = z.infer<typeof consultationRequestSchema>

// Mapping objects for display labels
export const INQUIRY_TYPE_LABELS = {
  buying: 'Buying Property',
  selling: 'Selling Property', 
  renting: 'Renting Property',
  investment: 'Investment Consultation',
  valuation: 'Property Valuation',
  other: 'Other'
} as const

export const BUDGET_RANGE_LABELS = {
  'under-1m': 'Under 1 Million',
  '1m-2m': '1 - 2 Million',
  '2m-5m': '2 - 5 Million', 
  '5m-10m': '5 - 10 Million',
  '10m-20m': '10 - 20 Million',
  'over-20m': 'Over 20 Million'
} as const

export const LOCATION_LABELS = {
  downtown: 'Downtown Dubai',
  marina: 'Dubai Marina',
  jbr: 'JBR',
  'business-bay': 'Business Bay',
  palm: 'Palm Jumeirah',
  hills: 'Dubai Hills Estate',
  other: 'Other'
} as const

// Export constants for use in components
export { INQUIRY_TYPES, BUDGET_RANGES, LOCATIONS }