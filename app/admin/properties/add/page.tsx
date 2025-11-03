"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ArrowLeft, Loader2, X } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { propertyFormSchema, PropertyFormData } from "@/lib/schemas/property"
import { createProperty, PROPERTY_TYPES, PROPERTY_STATUS, AREA_UNITS, COMMON_AMENITIES, COMMON_FEATURES } from "@/lib/properties"
import { ImageUploadSortable, UploadedImage } from "@/components/ui/image-upload-sortable"

export default function AddProperty() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<UploadedImage[]>([])

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      property_type: undefined,
      status: 'available',
      price: 0,
      area_value: 0,
      area_unit: 'sq ft',
      bedrooms: 0,
      bathrooms: 0,
      parking_spaces: 0,
      floor_number: 0,
      year_built: new Date().getFullYear(),
      display_order: 0,
      amenities: [],
      features: [],
      is_featured: false,
      is_hot_property: false,
      images: [],
    },
  })

  const handleImagesChange = (newImages: UploadedImage[]) => {
    setImages(newImages)
    // Convert UploadedImage[] to the format expected by the form schema
    const formImages = newImages.map(img => ({
      image_url: img.image_url,
      image_alt: img.image_alt || '',
      order: img.order
    }))
    form.setValue('images', formImages)
  }

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true)
    try {
      // Prepare the data for submission - images are already in the correct format
      await createProperty(data)
      toast.success('Property created successfully!')
      router.push('/admin/properties')
    } catch (error) {
      console.error('Error creating property:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create property')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mj-teal via-mj-teal-light to-mj-dark text-mj-white">
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8 ">
        <div className="flex flex-col items-start gap-4 mb-4">
          <Link href="/admin/properties">
            <Button
              variant="outline"
              size="sm"
              className="border-mj-gold text-mj-gold hover:bg-mj-gold hover:text-mj-white bg-transparent cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-mj-gold">Add New Property</h1>
            <p className="text-mj-white/80">Create a new property listing</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm shadow-lg">
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20 cursor-pointer w-full">
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20 cursor-pointer w-full">
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

          {/* Property Details */}
          <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm shadow-lg">
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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

          {/* Amenities */}
          <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm shadow-lg">
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
                                    className="border-mj-gold/30 data-[state=checked]:bg-mj-gold data-[state=checked]:text-mj-teal cursor-pointer"
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

          {/* Features */}
          <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm shadow-lg">
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
                                    className="border-mj-gold/30 data-[state=checked]:bg-mj-gold data-[state=checked]:text-mj-teal cursor-pointer"
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

          {/* Property Options */}
          <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm shadow-lg">
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
                        className="data-[state=checked]:bg-mj-gold cursor-pointer"
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
                        className="data-[state=checked]:bg-mj-gold cursor-pointer"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Property Images */}
          <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-mj-gold">Property Images</CardTitle>
              <CardDescription className="text-mj-white/80">
                Drag and drop images or click to upload. Images will be automatically uploaded to Cloudinary.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploadSortable
                        images={images}
                        onImagesChange={handleImagesChange}
                        maxImages={15}
                        folder="properties"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               {/* Submit */}
          <div className="w-full flex gap-4">
            <div className="w-full">
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-mj-gold hover:bg-mj-gold-light text-mj-teal shadow-lg cursor-pointer w-full"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Property
            </Button>
            </div>
            <div className="w-full">
               <Button 
              type="button" 
              variant="outline" 
              className="border-mj-gold text-mj-gold hover:bg-mj-gold  cursor-pointer w-full "
              onClick={() => router.push('/admin/properties')}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            </div>
           
          </div>
            </CardContent>
          </Card>

         
        </form>
      </Form>
      </div>
    </div>
  )
}
