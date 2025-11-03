"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddSocialMedia, type SocialMediaEntry } from "@/components/addSocialMedia"
import { toast } from "sonner"
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Facebook,
  Linkedin,
  Instagram,
  Image as ImageIcon,
  Save,
  X,
  Upload,
  Link
} from "lucide-react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { type TeamMember } from "@/lib/team-members"
import { createTeamMember } from "@/lib/team-members"

export default function AddTeamMemberPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<TeamMember>({
    name: "",
    slug: "", // Will be auto-generated from name
    title: "",
    specialization: "",
    bio: "",
    personal_message: "",
    image_url: "",
    email: "",
    phone: "",
    facebook_url: "",
    linkedin_url: "",
    twitter_url: "",
    instagram_url: "",
    // Professional Stats
    years_experience: 0,
    properties_sold: 0,
    satisfied_clients: 0,
    performance_rating: 0,
    // Additional fields
    is_active: true,
    display_order: 0
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url')
  const [socialMediaEntries, setSocialMediaEntries] = useState<SocialMediaEntry[]>([])

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image file size must be less than 5MB')
        return
      }

      setSelectedFile(file)
      // Create local preview URL for immediate display
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const handleImageUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }))
    setImagePreview(url)
    setSelectedFile(null) // Clear any selected file when using URL
  }

  const handleImageClick = () => {
    if (uploadMode === 'file') {
      fileInputRef.current?.click()
    }
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous messages
    setIsSubmitting(true)
    try {
      // Filter social media entries to only include those with platform and url, and no errors
      const validSocialMedia = socialMediaEntries.filter(entry => entry.platform && entry.url && !entry.error)
      
      // Show error if any social media entries have validation errors
      const entriesWithErrors = socialMediaEntries.filter(entry => entry.error)
      if (entriesWithErrors.length > 0) {
        toast.error('Please fix social media URL validation errors before submitting')
        setIsSubmitting(false)
        return
      }
      
      // Remove only error field before sending to API (dbId not needed for new entries)
      const cleanSocialMedia = validSocialMedia.map(({ error, ...entry }) => entry)
      
      const result = await createTeamMember(formData, selectedFile || undefined, cleanSocialMedia)

      if (!result.data) {
        throw new Error(result.message || 'Failed to create team member')
      }
      toast.success('Team member added successfully!')
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push('/admin/team')
      }, 1500)
      
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred. Please try again.'
      console.error('Error adding team member:', error)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mj-teal via-mj-teal-light to-mj-dark text-mj-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="border-mj-gold text-mj-gold hover:bg-mj-gold hover:text-mj-teal"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
                  <h1 className="text-3xl font-bold text-mj-gold mb-2">Add New Team Member</h1>
        <p className="text-mj-white/80">Create a new team member profile</p>
      </div>


      {/* Form */}
        <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-mj-gold">Team Member Information</CardTitle>
            <CardDescription className="text-mj-white/80">
              Fill in all the details for the new team member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-mj-gold font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name" className="text-mj-white/80 pl-2">Full Name *</Label>
                    <Input 
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter full name (e.g., John Smith)"
                      className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="title" className="text-mj-white/80 pl-2">Job Title *</Label>
                    <Input 
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g., Senior Real Estate Agent, Property Consultant"
                      className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="specialization" className="text-mj-white/80 pl-2">Specialization</Label>
                    <Input 
                      id="specialization"
                      value={formData.specialization}
                      onChange={(e) => handleInputChange("specialization", e.target.value)}
                      placeholder="e.g., Luxury Properties, Commercial Real Estate, Investment Properties"
                      className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-mj-gold font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email" className="text-mj-white/80 pl-2">Email Address *</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="agent@mjproperties.com"
                      className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone" className="text-mj-white/80 pl-2">Phone Number</Label>
                    <Input 
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+971 50 123 4567"
                      className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              {/* <div>
                <h3 className="text-mj-gold font-semibold mb-4">Social Media Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="facebook_url" className="text-mj-white/80 pl-2">Facebook URL</Label>
                    <Input 
                      id="facebook_url"
                      type="url"
                      value={formData.facebook_url}
                      onChange={(e) => handleInputChange("facebook_url", e.target.value)}
                      placeholder="https://facebook.com/username"
                      className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="linkedin_url" className="text-mj-white/80 pl-2">LinkedIn URL</Label>
                    <Input 
                      id="linkedin_url"
                      type="url"
                      value={formData.linkedin_url}
                      onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="twitter_url" className="text-mj-white/80 pl-2">Twitter URL</Label>
                    <Input 
                      id="twitter_url"
                      type="url"
                      value={formData.twitter_url}
                      onChange={(e) => handleInputChange("twitter_url", e.target.value)}
                      placeholder="https://twitter.com/username"
                      className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="instagram_url" className="text-mj-white/80 pl-2">Instagram URL</Label>
                    <Input 
                      id="instagram_url"
                      type="url"
                      value={formData.instagram_url}
                      onChange={(e) => handleInputChange("instagram_url", e.target.value)}
                      placeholder="https://instagram.com/username"
                      className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20"
                    />
                  </div>
                </div>
              </div> */}
              <AddSocialMedia onDataChange={setSocialMediaEntries} />

              {/* Image and Bio */}
              <div>
                <h3 className="text-mj-gold font-semibold mb-4">Profile Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <Label className="text-mj-white/80 pl-2">Profile Image</Label>
                    
                    {/* Upload Mode Toggle */}
                    <div className="flex gap-2 mb-3">
                      <Button
                        type="button"
                        variant={uploadMode === 'url' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setUploadMode('url')}
                        className={uploadMode === 'url' ? 'bg-mj-gold text-mj-teal' : 'border-mj-gold text-mj-gold hover:bg-mj-gold'}
                      >
                        <Link className="h-3 w-3 mr-1" />
                        URL
                      </Button>
                      <Button
                        type="button"
                        variant={uploadMode === 'file' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setUploadMode('file')}
                        className={uploadMode === 'file' ? 'bg-mj-gold text-mj-teal' : 'border-mj-gold text-mj-gold hover:bg-mj-gold'}
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        Upload
                      </Button>
                    </div>

                    {/* Image Upload/URL Input */}
                    <div className="flex flex-col gap-3">
                      {uploadMode === 'url' ? (
                        <Input 
                          type="url"
                          value={formData.image_url}
                          onChange={(e) => handleImageUrlChange(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20"
                        />
                      ) : (
                        <div className="flex flex-col gap-2">
                          <div 
                            className="flex items-center justify-center border-2 border-dashed border-mj-gold/50 rounded-md p-4 cursor-pointer hover:border-mj-gold/70 transition-colors"
                            onClick={handleImageClick}
                          >
                            <div className="text-center">
                              <Upload className="h-8 w-8 mx-auto mb-2 text-mj-gold" />
                              <p className="text-mj-white/80 text-sm">Click to select image</p>
                              <p className="text-mj-white/60 text-xs">Image will be uploaded on submit</p>
                            </div>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </div>
                      )}

                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="mt-3">
                          <Label className="text-mj-white/80 text-sm mb-2 block">Preview:</Label>
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-mj-gold/30">
                            <Image
                              src={imagePreview}
                              alt="Preview"
                              fill
                              className="object-cover"
                              onError={() => setImagePreview(null)}
                            />
                          </div>
                          {selectedFile && uploadMode === 'file' && (
                            <p className="text-xs text-mj-white/60 mt-1">
                              📁 {selectedFile.name} (will be uploaded on submit)
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="personal_message" className="text-mj-white/80 pl-2">Personal Message</Label>
                    <Textarea 
                      id="personal_message"
                      rows={4}
                      value={formData.personal_message}
                      onChange={(e) => handleInputChange("personal_message", e.target.value)}
                      placeholder="Write a personal welcome message that will be displayed prominently on the team member's profile..."
                      className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20"
                    />
                    <p className="text-xs text-mj-white/60 pl-2">
                      This message will be displayed as a quote on the team member's profile page.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-2">
                  <Label htmlFor="bio" className="text-mj-white/80 pl-2">Bio / About</Label>
                  <Textarea 
                    id="bio"
                    rows={6}
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Write a detailed bio about the team member, including their experience, achievements, and what makes them special. This will be displayed on their profile page..."
                    className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20"
                  />
                  <p className="text-xs text-mj-white/60 pl-2">
                    This bio will be displayed on the team member's profile page and should highlight their expertise and personality.
                  </p>
                </div>
              </div>

              {/* Professional Stats */}
              <div>
                <h3 className="text-mj-gold font-semibold mb-4">Professional Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="years_experience" className="text-mj-white/80 pl-2">Years Experience</Label>
                    <Input 
                      id="years_experience"
                      type="number"
                      min="0"
                      value={formData.years_experience}
                      onChange={(e) => handleInputChange("years_experience", parseInt(e.target.value) || 0)}
                      placeholder="8"
                      className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="properties_sold" className="text-mj-white/80 pl-2">Properties Sold</Label>
                    <Input 
                      id="properties_sold"
                      type="number"
                      min="0"
                      value={formData.properties_sold}
                      onChange={(e) => handleInputChange("properties_sold", parseInt(e.target.value) || 0)}
                      placeholder="500"
                      className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="satisfied_clients" className="text-mj-white/80 pl-2">Satisfied Clients</Label>
                    <Input 
                      id="satisfied_clients"
                      type="number"
                      min="0"
                      value={formData.satisfied_clients}
                      onChange={(e) => handleInputChange("satisfied_clients", parseInt(e.target.value) || 0)}
                      placeholder="300"
                      className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="performance_rating" className="text-mj-white/80 pl-2">Performance Rating (0-5)</Label>
                    <Input 
                      id="performance_rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.performance_rating}
                      onChange={(e) => handleInputChange("performance_rating", parseFloat(e.target.value) || 0)}
                      placeholder="4.8"
                      className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20"
                    />
                  </div>
                </div>
                <p className="text-xs text-mj-white/60 pl-2 mt-2">
                  These statistics will be displayed on the team member's profile to showcase their achievements.
                </p>
              </div>


              {/* Additional Information */}
              <div>
                <h3 className="text-mj-gold font-semibold mb-4">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="is_active" className="text-mj-white/80 pl-2">Status</Label>
                    <Select 
                      value={formData.is_active ? "active" : "inactive"}
                      onValueChange={(value) => handleInputChange("is_active", value === "active")}
                    >
                      <SelectTrigger className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20 cursor-pointer">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-mj-dark border-mj-gold/30 cursor-pointer ">
                        <SelectItem value="active">Active (Visible to public)</SelectItem>
                        <SelectItem value="inactive">Inactive (Hidden from public)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-mj-white/60 pl-2">
                      Active team members will be visible on the public team page.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="display_order" className="text-mj-white/80 pl-2">Display Order</Label>
                    <Input 
                      id="display_order"
                      type="number"
                      min="0"
                      value={formData.display_order}
                      onChange={(e) => handleInputChange("display_order", parseInt(e.target.value) || 0)}
                      placeholder="Order in team listing (0 = first)"
                      className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20"
                    />
                    <p className="text-xs text-mj-white/60 pl-2">
                      Lower numbers appear first in the team listing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-mj-gold hover:bg-mj-gold-light text-mj-teal shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-mj-teal mr-2"></div>
                      {selectedFile ? 'Uploading Image & Saving...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Add Team Member
                    </>
                  )}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                  className="flex-1 border-mj-gold text-mj-gold hover:bg-mj-gold  cursor-pointer disabled:opacity-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
