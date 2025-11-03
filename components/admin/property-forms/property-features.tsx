"use client"

import { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { PropertyFormData } from "@/lib/schemas/property"
import { COMMON_FEATURES } from "@/lib/properties"

interface PropertyFeaturesProps {
  form: UseFormReturn<PropertyFormData>
}

export function PropertyFeatures({ form }: PropertyFeaturesProps) {
  return (
    <Card className="bg-mj-teal-light border-mj-gold/20 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-mj-gold">Features</CardTitle>
        <CardDescription className="text-mj-white/80">Select property features</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="features"
          render={() => (
            <FormItem>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {COMMON_FEATURES.map((feature) => (
                  <FormField
                    key={feature}
                    control={form.control}
                    name="features"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={feature}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(feature)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, feature])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== feature
                                      )
                                    )
                              }}
                              className="border-mj-gold/30 data-[state=checked]:bg-mj-gold data-[state=checked]:text-mj-teal"
                            />
                          </FormControl>
                          <FormLabel className="text-sm text-mj-white/80 font-normal">
                            {feature}
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
