"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddSocialMedia, type SocialMediaEntry } from "@/components/addSocialMedia"
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
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"
import { validateTeamMemberForm, type TeamMember } from "@/lib/team-members"

export default function EditTeamMemberPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<TeamMember>(JSON.parse(sessionStorage.getItem('editingMember') || '{}'))
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url')
  const [socialMediaEntries, setSocialMediaEntries] = useState<SocialMediaEntry[]>([])
  
  useEffect(() => {
    // Extract social media links from formData
    const entries: SocialMediaEntry[] = []
    
    // Check for social_media_links array first (from API)
    if ((formData as any).social_media_links && Array.isArray((formData as any).social_media_links)) {
      (formData as any).social_media_links.forEach((link: any, index: number) => {
        entries.push({
          id: link.id || `existing-${index}-${Date.now()}`,
          platform: link.platform || '',
          url: link.url || '',
          dbId: link.id // Preserve the database ID for deletion tracking
        })
      })
    } else {
      // Fall back to individual social media fields
      if (formData.facebook_url) {
        entries.push({
          id: `existing-facebook-${Date.now()}`,
          platform: 'Facebook',
          url: formData.facebook_url
        })
      }
      if (formData.linkedin_url) {
        entries.push({
          id: `existing-linkedin-${Date.now()}`,
          platform: 'LinkedIn',
          url: formData.linkedin_url
        })
      }
      if (formData.twitter_url) {
        entries.push({
          id: `existing-twitter-${Date.now()}`,
          platform: 'Twitter',
          url: formData.twitter_url
        })
      }
      if (formData.instagram_url) {
        entries.push({
          id: `existing-instagram-${Date.now()}`,
          platform: 'Instagram',
          url: formData.instagram_url
        })
      }
    }
    
    setSocialMediaEntries(entries)
  }, [formData])

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
      
      // Validate file size (max 15MB)
      if (file.size > 15 * 1024 * 1024) {
        toast.error('Image file size must be less than 15MB')
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
    
    // Client-side validation
    const validationErrors = validateTeamMemberForm(formData)
    if (validationErrors.length > 0) {
      toast.error(validationErrors.join(', '))
      return
    }

    setIsUpdating(true)
    try {
      // Filter valid social media entries and check for validation errors
      const entriesWithErrors = socialMediaEntries.filter(entry => entry.error)
      if (entriesWithErrors.length > 0) {
        toast.error('Please fix social media URL validation errors before submitting')
        setIsUpdating(false)
        return
      }
      
      const validSocialMedia = socialMediaEntries.filter(entry => entry.platform && entry.url)
      
      let response: Response
      
      if (selectedFile && uploadMode === 'file') {
        // Send FormData when image file is selected
        const formDataToSend = new FormData()
        formDataToSend.append('id', (formData.id ?? '').toString())
        formDataToSend.append('name', formData.name || '')
        formDataToSend.append('title', formData.title || '')
        formDataToSend.append('specialization', formData.specialization || '')
        formDataToSend.append('bio', formData.bio || '')
        formDataToSend.append('personal_message', formData.personal_message || '')
        formDataToSend.append('email', formData.email || '')
        formDataToSend.append('phone', formData.phone || '')
        formDataToSend.append('facebook_url', formData.facebook_url || '')
        formDataToSend.append('linkedin_url', formData.linkedin_url || '')
        formDataToSend.append('twitter_url', formData.twitter_url || '')
        formDataToSend.append('instagram_url', formData.instagram_url || '')
        // Professional Stats
        formDataToSend.append('years_experience', formData.years_experience?.toString() || '0')
        formDataToSend.append('properties_sold', formData.properties_sold?.toString() || '0')
        formDataToSend.append('satisfied_clients', formData.satisfied_clients?.toString() || '0')
        formDataToSend.append('performance_rating', formData.performance_rating?.toString() || '0')
        // Additional fields
        formDataToSend.append('is_active', (formData.is_active ?? false).toString())
        formDataToSend.append('display_order', (formData.display_order ?? 0).toString())
        
        // Add social media entries (remove only error field, keep dbId for deletion tracking)
        if (validSocialMedia.length > 0) {
          const cleanSocialMedia = validSocialMedia.map(({ error, ...entry }) => entry)
          formDataToSend.append('social_media_entries', JSON.stringify(cleanSocialMedia))
        }
        
        formDataToSend.append('image', selectedFile)
        
        response = await fetch(`/api/team-members`, {
          method: 'PUT',
          body: formDataToSend
        })
      } else {
        // Send JSON when no image file is selected
        const body = {
          ...formData,
          social_media_entries: validSocialMedia.length > 0 ? validSocialMedia.map(({ error, ...entry }) => entry) : undefined
        }
        
        response = await fetch(`/api/team-members`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        })
      }

      const result = await response.json()

      if (!response.ok) {
        // If there are validation details, show them
        if (result.details && Array.isArray(result.details)) {
          throw new Error(result.details.join(', ') || result.error || 'Failed to update team member')
        }
        throw new Error(result.error || 'Failed to update team member')
      }
      
      toast.success('Team member updated successfully!')
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push('/admin/team')
      }, 1500)
      
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred. Please try again.'
      console.error('Error updating team member:', error)
      toast.error(errorMessage)
    } finally {
      setIsUpdating(false)
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
                  <h1 className="text-3xl font-bold text-mj-gold mb-2">Edit Team Member</h1>
        <p className="text-mj-white/80">Edit the team member information</p>
      </div>



      {/* Form */}
        <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-mj-gold">Team Member Information</CardTitle>
            <CardDescription className="text-mj-white/80">
              Fill in all the details for the team member
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
                      placeholder="e.g., Residential Properties, Commercial Real Estate"
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
                      className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
             
              <AddSocialMedia 
                onDataChange={setSocialMediaEntries}
                initialEntries={socialMediaEntries}
              />
              {/* Image and Bio */}
              <div>
                <h3 className="text-mj-gold font-semibold mb-4">Profile Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <Label className="text-mj-white/80 pl-2">Profile Image</Label>
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-mj-gold/30">
                        <Image
                          src={formData.image_url || "/images/default-profile.png"}
                          alt="Profile Image"
                          fill
                          className="object-cover"
                        />
                      </div>
                   
                    {/* Upload Mode Toggle */}
                    <div className="flex gap-2 mb-3">
                      <Button
                        type="button"
                        variant={uploadMode === 'url' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setUploadMode('url')}
                        className={uploadMode === 'url' ? 'bg-mj-gold text-mj-teal' : 'border-mj-gold text-mj-gold hover:bg-mj-gold hover:text-mj-teal'}
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
                          value={formData.image_url || "/images/default-profile.png"}
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

              {/* Professional Statistics */}
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
                    <Label htmlFor="display_order" className="text-mj-white/80 pl-2">Display Order *</Label>
                    <Input 
                      id="display_order"
                      type="number"
                      min="0"
                      value={formData.display_order}
                      placeholder="Order in team listing (0 = first)"
                      onChange={(e) => handleInputChange("display_order", parseInt(e.target.value) || 0)}
                      className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20"
                      required
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
                  disabled={isUpdating}
                  className="flex-1 bg-mj-gold hover:bg-mj-gold-light text-mj-teal shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-mj-teal mr-2"></div>
                      {selectedFile ? 'Uploading Image & Saving...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Edit Team Member
                    </>
                  )}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => router.back()}
                  disabled={isUpdating}
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
