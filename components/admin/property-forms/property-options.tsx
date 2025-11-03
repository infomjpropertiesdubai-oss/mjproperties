"use client"

import { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { PropertyFormData } from "@/lib/schemas/property"

interface PropertyOptionsProps {
  form: UseFormReturn<PropertyFormData>
}

export function PropertyOptions({ form }: PropertyOptionsProps) {
  return (
    <Card className="bg-mj-teal-light border-mj-gold/20 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-mj-gold">Property Options</CardTitle>
        <CardDescription className="text-mj-white/80">Special property settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="is_featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-mj-gold/20 p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base text-mj-white">
                  Featured Property
                </FormLabel>
                <FormDescription className="text-mj-white/60">
                  This property will be highlighted in featured sections
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-mj-gold"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_hot_property"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-mj-gold/20 p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base text-mj-white">
                  Hot Property
                </FormLabel>
                <FormDescription className="text-mj-white/60">
                  This property will be marked as a hot property
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-mj-gold"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
