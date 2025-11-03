import { z } from 'zod'

export const newsletterSubscriptionSchema = z.object({
  email: z.string().email('Invalid email address').max(255, 'Email is too long'),
})

export type NewsletterSubscriptionData = z.infer<typeof newsletterSubscriptionSchema>