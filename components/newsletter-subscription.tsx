"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

import { 
  newsletterSubscriptionSchema, 
  type NewsletterSubscriptionData
} from "@/lib/schemas/newsletter"
import { createNewsletterSubscription } from "@/lib/newsletter"

export function NewsletterSubscription() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<NewsletterSubscriptionData>({
    resolver: zodResolver(newsletterSubscriptionSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: NewsletterSubscriptionData) => {
    setIsSubmitting(true)
    try {
      const response = await createNewsletterSubscription(data)
      toast.success(response.message || "Successfully subscribed to our newsletter!")
      form.reset()
    } catch (error) {
      console.error('Error subscribing to newsletter:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to subscribe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-background border-mj-gold/20"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit"
          className="w-full bg-mj-gold text-mj-teal hover:bg-mj-gold/90" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    </Form>
  )
}