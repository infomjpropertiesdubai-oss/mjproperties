"use client"

import { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { PropertyFormData } from "@/lib/schemas/property"
import { COMMON_AMENITIES } from "@/lib/properties"

interface PropertyAmenitiesProps {
  form: UseFormReturn<PropertyFormData>
}

export function PropertyAmenities({ form }: PropertyAmenitiesProps) {
  return (
    <Card className="bg-mj-teal-light border-mj-gold/20 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-mj-gold">Amenities</CardTitle>
        <CardDescription className="text-mj-white/80">Select available amenities</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="amenities"
          render={() => (
            <FormItem>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {COMMON_AMENITIES.map((amenity) => (
                  <FormField
                    key={amenity}
                    control={form.control}
                    name="amenities"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={amenity}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(amenity)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, amenity])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== amenity
                                      )
                                    )
                              }}
                              className="border-mj-gold/30 data-[state=checked]:bg-mj-gold data-[state=checked]:text-mj-teal"
                            />
                          </FormControl>
                          <FormLabel className="text-sm text-mj-white/80 font-normal">
                            {amenity}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
