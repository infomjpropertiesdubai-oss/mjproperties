import type { Database } from '@/database.types'
import type { NewsletterSubscriptionData } from '@/lib/schemas/newsletter'

type NewsletterSubscriptionRow = Database['public']['Tables']['newsletter_subscriptions']['Row']

export interface NewsletterSubscriptionResponse {
  success: boolean
  data?: NewsletterSubscriptionRow
  error?: string
  message?: string
}

// Create a newsletter subscription (minimal consultation request)
export async function createNewsletterSubscription(subscriptionData: NewsletterSubscriptionData): Promise<NewsletterSubscriptionResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')
  const response = await fetch(`${baseUrl}/api/newsletter-subscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscriptionData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to subscribe to newsletter')
  }

  return data
}

// Validation function for newsletter subscription
export function validateNewsletterSubscription(data: NewsletterSubscriptionData): string[] {
  const errors: string[] = []

  if (!data.email || data.email.trim().length === 0) {
    errors.push('Email is required')
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      errors.push('Invalid email format')
    }
  }

  return errors
}