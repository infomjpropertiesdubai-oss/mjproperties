"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Heart } from "lucide-react"
import { toast } from "sonner"
import { Property } from "@/lib/properties"


export function PropertyContact({ property }: { property: Property }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    inquiryType: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error' | '', text: string }>({ type: '', text: '' })

  // Format price for display
  const formattedPrice = new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(property.price)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage({ type: '', text: '' })

    try {
      const response = await fetch('/api/property-inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          inquiry_type: formData.inquiryType,
          message: formData.message,
          property_id: property.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit inquiry')
      }

      setSubmitMessage({ 
        type: 'success', 
        text: 'Thank you for your inquiry! We will contact you soon.' 
      })
      toast.success('Thank you for your inquiry! We will contact you soon.')
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        inquiryType: "",
      })
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to submit inquiry. Please try again.'
      console.error('Error submitting inquiry:', error)
      setSubmitMessage({ 
        type: 'error', 
        text: errorMessage
      })
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Contact Form */}
      <Card className="border-mj-gold/20 pt-6">
        <CardHeader>
          <CardTitle>Send Inquiry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-mj-gold/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border-mj-gold/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="border-mj-gold/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inquiryType">Inquiry Type</Label>
              <Select
                value={formData.inquiryType}
                onValueChange={(value) => setFormData({ ...formData, inquiryType: value })}
              >
                <SelectTrigger className="border-mj-gold/20 w-full cursor-pointer">
                  <SelectValue placeholder="Select inquiry type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewing">Schedule Viewing</SelectItem>
                  <SelectItem value="info">Request Information</SelectItem>
                  <SelectItem value="financing">Financing Options</SelectItem>
                  <SelectItem value="offer">Make an Offer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="border-mj-gold/20"
                placeholder={`I'm interested in ${property.title} priced at ${formattedPrice}. Please contact me with more details.`}
                rows={4}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-mj-gold text-mj-teal hover:bg-mj-gold/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Send Inquiry'}
            </Button>
          </form>

      
        </CardContent>
      </Card>
    </div>
  )
}
