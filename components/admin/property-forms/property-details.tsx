"use client"

import { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { PropertyFormData } from "@/lib/schemas/property"
import { AREA_UNITS } from "@/lib/properties"

interface PropertyDetailsProps {
  form: UseFormReturn<PropertyFormData>
}

export function PropertyDetails({ form }: PropertyDetailsProps) {
  return (
    <Card className="bg-mj-teal-light border-mj-gold/20 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-mj-gold">Property Details</CardTitle>
        <CardDescription className="text-mj-white/80">Size, rooms, and specifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mj-white/80">Bedrooms</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="3"
                    className="bg-mj-dark border-mj-gold/30 text-mj-white placeholder:text-mj-white/50 focus:border-mj-gold focus:ring-mj-gold/20"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mj-white/80">Bathrooms</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2"
                    className="bg-mj-dark border-mj-gold/30 text-mj-white placeholder:text-mj-white/50 focus:border-mj-gold focus:ring-mj-gold/20"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parking_spaces"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mj-white/80">Parking Spaces</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1"
                    className="bg-mj-dark border-mj-gold/30 text-mj-white placeholder:text-mj-white/50 focus:border-mj-gold focus:ring-mj-gold/20"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="floor_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mj-white/80">Floor Number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="5"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="area_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mj-white/80">Area Size</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1800"
                    className="bg-mj-dark border-mj-gold/30 text-mj-white placeholder:text-mj-white/50 focus:border-mj-gold focus:ring-mj-gold/20"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="area_unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mj-white/80">Area Unit</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-mj-dark border-mj-gold/30">
                    {AREA_UNITS.map((unit) => (
                      <SelectItem key={unit} value={unit} className="text-mj-white">
                        {unit}
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
            name="year_built"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mj-white/80">Year Built</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2024"
                    className="bg-mj-dark border-mj-gold/30 text-mj-white placeholder:text-mj-white/50 focus:border-mj-gold focus:ring-mj-gold/20"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || new Date().getFullYear())}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="display_order"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-mj-white/80">Display Order</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  className="bg-mj-dark border-mj-gold/30 text-mj-white placeholder:text-mj-white/50 focus:border-mj-gold focus:ring-mj-gold/20 max-w-xs"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription className="text-mj-white/60">
                Lower numbers appear first in listings
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
