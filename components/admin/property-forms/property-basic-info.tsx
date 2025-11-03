"use client"

import { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { PropertyFormData } from "@/lib/schemas/property"
import { PROPERTY_TYPES, PROPERTY_STATUS } from "@/lib/properties"

interface PropertyBasicInfoProps {
  form: UseFormReturn<PropertyFormData>
}

export function PropertyBasicInfo({ form }: PropertyBasicInfoProps) {
  return (
    <Card className="bg-mj-teal-light border-mj-gold/20 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-mj-gold">Basic Information</CardTitle>
        <CardDescription className="text-mj-white/80">Enter the basic details of the property</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mj-white/80">Property Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Luxury Penthouse - Downtown Dubai"
                    className="bg-mj-dark border-mj-gold/30 text-mj-white placeholder:text-mj-white/50 focus:border-mj-gold focus:ring-mj-gold/20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mj-white/80">Price (AED)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 8500000"
                    className="bg-mj-dark border-mj-gold/30 text-mj-white placeholder:text-mj-white/50 focus:border-mj-gold focus:ring-mj-gold/20"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-mj-white/80">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the property..."
                  rows={4}
                  className="bg-mj-dark border-mj-gold/30 text-mj-white placeholder:text-mj-white/50 focus:border-mj-gold focus:ring-mj-gold/20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="property_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mj-white/80">Property Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-mj-dark border-mj-gold/30">
                    {PROPERTY_TYPES.map((type) => (
                      <SelectItem key={type} value={type} className="text-mj-white">
                        {type}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mj-white/80">Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-mj-dark border-mj-gold/30">
                    {PROPERTY_STATUS.map((status) => (
                      <SelectItem key={status} value={status} className="text-mj-white capitalize">
                        {status.replace('-', ' ')}
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
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mj-white/80">Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Downtown Dubai"
                    className="bg-mj-dark border-mj-gold/30 text-mj-white placeholder:text-mj-white/50 focus:border-mj-gold focus:ring-mj-gold/20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
