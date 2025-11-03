import type { Database } from '@/database.types'
import type { ConsultationRequestData } from '@/lib/schemas/consultation'

type ConsultationRequestInsert = Database['public']['Tables']['consultation_requests']['Insert']
type ConsultationRequestRow = Database['public']['Tables']['consultation_requests']['Row']

export interface CreateConsultationRequestData extends Omit<ConsultationRequestInsert, 'id' | 'created_at' | 'updated_at' | 'is_active'> {}

export interface ConsultationRequestResponse {
  success: boolean
  data?: ConsultationRequestRow
  error?: string
}

// Create a new consultation request
export async function createConsultationRequest(consultationData: ConsultationRequestData): Promise<ConsultationRequestResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')
  const response = await fetch(`${baseUrl}/api/consultation-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(consultationData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit consultation request')
  }

  return data
}

// Validation function for consultation request form
export function validateConsultationRequestForm(data: CreateConsultationRequestData): string[] {
  const errors: string[] = []

  if (!data.first_name || data.first_name.trim().length === 0) {
    errors.push('First name is required')
  }

  if (!data.last_name || data.last_name.trim().length === 0) {
    errors.push('Last name is required')
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.push('Email is required')
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      errors.push('Invalid email format')
    }
  }

  if (!data.phone || data.phone.trim().length === 0) {
    errors.push('Phone number is required')
  }

  if (!data.type_of_inquiry) {
    errors.push('Type of inquiry is required')
  }

  return errors
}