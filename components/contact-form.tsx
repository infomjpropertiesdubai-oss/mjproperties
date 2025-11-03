"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Send, Mail } from "lucide-react"

import { 
  consultationRequestSchema, 
  type ConsultationRequestData,
  INQUIRY_TYPES,
  BUDGET_RANGES,
  LOCATIONS,
  INQUIRY_TYPE_LABELS,
  BUDGET_RANGE_LABELS,
  LOCATION_LABELS
} from "@/lib/schemas/consultation"
import { createConsultationRequest } from "@/lib/consultation-requests"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ConsultationRequestData>({
    resolver: zodResolver(consultationRequestSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      type_of_inquiry: undefined,
      budget_range: "",
      preferred_location: "",
      message: "",
      subscribe_to_newsletter: false,
    },
  })

  const onSubmit = async (data: ConsultationRequestData) => {
    setIsSubmitting(true)
    try {
      await createConsultationRequest(data)
      toast.success("Thank you for your inquiry! Our team will reach out to you within 24 hours.")
      form.reset()
    } catch (error) {
      console.error('Error submitting consultation request:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to submit your inquiry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-mj-gold/20 pt-8">
      <CardHeader>
        <CardTitle className="flex items-center text-lg sm:text-xl gap-2">
          <Mail className="h-5 w-5 text-mj-gold" />
          Consultation Request
        </CardTitle>
        <p className="text-muted-foreground">
          Fill out the form below and our expert team will contact you within 24 hours.
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your first name"
                        className="border-mj-gold/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your last name"
                        className="border-mj-gold/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        className="border-mj-gold/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+971 50 123 4567"
                        className="border-mj-gold/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Inquiry Type and Location */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type_of_inquiry"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Type of Inquiry *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-mj-gold/20 cursor-pointer w-full">
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full">
                        {INQUIRY_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {INQUIRY_TYPE_LABELS[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferred_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Location</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-mj-gold/20 cursor-pointer w-full">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LOCATIONS.map((location) => (
                          <SelectItem key={location} value={location}>
                            {LOCATION_LABELS[location]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Budget Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budget_range"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Range (AED)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-mj-gold/20 cursor-pointer w-full">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full">
                        {BUDGET_RANGES.map((range) => (
                          <SelectItem key={range} value={range}>
                            {BUDGET_RANGE_LABELS[range]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us more about your requirements..."
                      className="border-mj-gold/20"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Newsletter Checkbox */}
            <FormField
              control={form.control}
              name="subscribe_to_newsletter"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm">
                    Subscribe to our newsletter for market updates and exclusive property listings
                  </FormLabel>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-mj-gold text-mj-teal hover:bg-mj-gold/90" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Inquiry
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By submitting this form, you agree to our privacy policy and terms of service.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
