"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { RichTextEditor } from "@/components/ui/rich-text-editor"
import RichTextEditor from "@/components/ui/richText-editor"
import { 
  ArrowLeft,
  FileText,
  User,
  Calendar,
  Clock,
  Image as ImageIcon,
  Save,
  X,
  Tag,
  Upload,
  Link
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"
import { validateBlogForm, type Blog } from "@/lib/blogs"

export default function EditBlogPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const authorFileInputRef = useRef<HTMLInputElement>(null)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(JSON.parse(sessionStorage.getItem('editingBlog') || '{}'))
  const [formData, setFormData] = useState<Blog>(editingBlog || {
    title: "",
    body: "",
    featured_image_url: "",
    author_name: "",
    author_profile_link: "",
    author_image_url: "",
    category: "",
    status: "draft",
    read_time: 0,
    tags: [],
    published_at: ""
  })
  const [selectedFeaturedFile, setSelectedFeaturedFile] = useState<File | null>(null)
  const [selectedAuthorFile, setSelectedAuthorFile] = useState<File | null>(null)
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(editingBlog?.featured_image_url || null)
  const [authorImagePreview, setAuthorImagePreview] = useState<string | null>(editingBlog?.author_image_url || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url')
  const [authorUploadMode, setAuthorUploadMode] = useState<'url' | 'file'>('url')

  useEffect(() => {
    if (editingBlog) {
      setFormData({
        ...editingBlog,
        body: typeof editingBlog.body === 'string' ? editingBlog.body : JSON.stringify(editingBlog.body)
      })
      setFeaturedImagePreview(editingBlog.featured_image_url || null)
      setAuthorImagePreview(editingBlog.author_image_url || null)
    }
  }, [editingBlog])

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRichTextChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      body: content
    }))
  }


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'featured' | 'author') => {
    const file = event.target.files?.[0]
    if (file) {
      if (type === 'featured') {
        setSelectedFeaturedFile(file)
        const previewUrl = URL.createObjectURL(file)
        setFeaturedImagePreview(previewUrl)
      } else {
        setSelectedAuthorFile(file)
        const previewUrl = URL.createObjectURL(file)
        setAuthorImagePreview(previewUrl)
      }
    }
  }

  const handleImageUrlChange = (url: string, type: 'featured' | 'author') => {
    if (type === 'featured') {
      setFormData(prev => ({ ...prev, featured_image_url: url }))
      setFeaturedImagePreview(url)
      setSelectedFeaturedFile(null) // Clear any selected file when using URL
    } else {
      setFormData(prev => ({ ...prev, author_image_url: url }))
      setAuthorImagePreview(url)
      setSelectedAuthorFile(null) // Clear any selected file when using URL
    }
  }

  const handleImageClick = (type: 'featured' | 'author') => {
    if (type === 'featured' && uploadMode === 'file') {
      fileInputRef.current?.click()
    } else if (type === 'author' && authorUploadMode === 'file') {
      authorFileInputRef.current?.click()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form data
    const validationErrors = validateBlogForm(formData)
    if (validationErrors.length > 0) {
      toast.error(validationErrors.join(', '))
      return
    }

    setIsSubmitting(true)

    try {
      // Create FormData for the API request
      const submitFormData = new FormData()
      
      // Add text fields
      submitFormData.append('title', formData.title)
      submitFormData.append('body', typeof formData.body === 'string' ? formData.body : JSON.stringify(formData.body))
      submitFormData.append('author_name', formData.author_name || '')
      submitFormData.append('author_profile_link', formData.author_profile_link || '')
      submitFormData.append('category', formData.category || '')
      submitFormData.append('status', formData.status || 'draft')
      submitFormData.append('read_time', formData.read_time?.toString() || '')
      submitFormData.append('tags', formData.tags?.join(',') || '')

      // Add image files if selected
      if (selectedFeaturedFile && uploadMode === 'file') {
        submitFormData.append('featured_image', selectedFeaturedFile)
      } else if (formData.featured_image_url && uploadMode === 'url') {
        submitFormData.append('featured_image_url', formData.featured_image_url)
      }

      if (selectedAuthorFile && authorUploadMode === 'file') {
        submitFormData.append('author_image', selectedAuthorFile)
      } else if (formData.author_image_url && authorUploadMode === 'url') {
        submitFormData.append('author_image_url', formData.author_image_url)
      }

      // Send to our backend API
      const response = await fetch(`/api/blogs/${editingBlog?.id}`, {
        method: 'PUT',
        body: submitFormData, // No Content-Type header needed for FormData
      })

      if (response.ok) {
        const result = await response.json()
        toast.success('Blog post updated successfully!')
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/admin/blog')
        }, 1500)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update blog post. Please try again.')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
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
          <h1 className="text-3xl font-bold text-mj-gold mb-2">Edit Blog Post</h1>
          <p className="text-mj-white/80">Create a new blog post for your website</p>
        </div>

        {/* Form */}
        <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-mj-gold">Blog Post Information</CardTitle>
            <CardDescription className="text-mj-white/80">
              Fill in all the details for the blog post
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-mj-gold font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 md:space-y-2">
                    <Label htmlFor="title" className="text-mj-white/80">Blog Title *</Label>
                    <Input 
                      id="title"
                        value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20" 
                      required
                    />
                  </div>
                  <div className="md:space-y-2">
                    <Label htmlFor="category" className="text-mj-white/80">Category</Label>
                    <Select 
                      value={formData.category}
                      onValueChange={(value) => handleInputChange("category", value)}
                    >
                      <SelectTrigger className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20 cursor-pointer w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-mj-dark border-mj-gold/30">
                        <SelectItem value="real-estate">Real Estate</SelectItem>
                        <SelectItem value="investment">Investment</SelectItem>
                        <SelectItem value="market-trends">Market Trends</SelectItem>
                        <SelectItem value="property-guides">Property Guides</SelectItem>
                        <SelectItem value="dubai-properties">Dubai Properties</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:space-y-2">
                    <Label htmlFor="status" className="text-mj-white/80">Status</Label>
                    <Select 
                      value={formData.status}
                      onValueChange={(value) => handleInputChange("status", value)}
                    >
                      <SelectTrigger className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20 cursor-pointer w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-mj-dark border-mj-gold/30">
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Author Information */}
              <div>
                <h3 className="text-mj-gold font-semibold mb-4">Author Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:space-y-2">
                    <Label htmlFor="author_name" className="text-mj-white/80">Author Name</Label>
                    <Input 
                      id="author_name"
                      value={formData.author_name}
                      onChange={(e) => handleInputChange("author_name", e.target.value)}
                      className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20 cursor-pointer w-full" 
                    />
                  </div>
                  <div className="md:space-y-2">
                    <Label htmlFor="author_profile_link" className="text-mj-white/80">Author Profile Link</Label>
                    <Input 
                      id="author_profile_link"
                      type="url"
                      value={formData.author_profile_link}
                      onChange={(e) => handleInputChange("author_profile_link", e.target.value)}
                      placeholder="https://example.com/author"
                      className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20 cursor-pointer w-full" 
                    />
                  </div>
                  <div className="md:space-y-2">
                    <Label className="text-mj-white/80">Author Image</Label>
                    
                    {/* Author Upload Mode Toggle */}
                    <div className="flex gap-2 mb-3">
                      <Button
                        type="button"
                        variant={authorUploadMode === 'url' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAuthorUploadMode('url')}
                        className={authorUploadMode === 'url' ? 'bg-mj-gold text-mj-teal' : 'border-mj-gold text-mj-gold hover:bg-mj-gold'}
                      >
                        <Link className="h-3 w-3 mr-1" />
                        URL
                      </Button>
                      <Button
                        type="button"
                        variant={authorUploadMode === 'file' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAuthorUploadMode('file')}
                        className={authorUploadMode === 'file' ? 'bg-mj-gold text-mj-teal' : 'border-mj-gold text-mj-gold hover:bg-mj-gold '}
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        Upload
                      </Button>
                    </div>

                    {/* Author Image Upload/URL Input */}
                    <div className="flex flex-col gap-3">
                      {authorUploadMode === 'url' ? (
                        <Input 
                          type="url"
                          value={formData.author_image_url}
                          onChange={(e) => handleImageUrlChange(e.target.value, 'author')}
                          placeholder="https://example.com/author-image.jpg"
                          className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20 cursor-pointer w-full  " 
                        />
                      ) : (
                        <div className="flex flex-col gap-2">
                          <div 
                            className="flex items-center justify-center border-2 border-dashed border-mj-gold/50 rounded-md p-3 cursor-pointer hover:border-mj-gold/70 transition-colors"
                            onClick={() => handleImageClick('author')}
                          >
                            <div className="text-center">
                              <Upload className="h-6 w-6 mx-auto mb-1 text-mj-gold" />
                              <p className="text-mj-white/80 text-xs">Select author image</p>
                              <p className="text-mj-white/60 text-xs">Upload on submit</p>
                            </div>
                          </div>
                          <input
                            ref={authorFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e, 'author')}
                            className="hidden"
                          />
                        </div>
                      )}

                      {/* Author Image Preview */}
                      {authorImagePreview && (
                        <div className="mt-2">
                          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-mj-gold/30">
                            <Image
                              src={authorImagePreview}
                              alt="Author Preview"
                              fill
                              className="object-cover"
                              onError={() => setAuthorImagePreview(null)}
                            />
                          </div>
                          {selectedAuthorFile && authorUploadMode === 'file' && (
                            <p className="text-xs text-mj-white/60 mt-1">
                              📁 {selectedAuthorFile.name} (will be uploaded on submit)
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Media and Settings */}
              <div>
                <h3 className="text-mj-gold font-semibold mb-4">Media and Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 md:space-y-2">
                    <Label className="text-mj-white/80">Featured Image</Label>
                    
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

                    {/* Featured Image Upload/URL Input */}
                    <div className="flex flex-col gap-3">
                      {uploadMode === 'url' ? (
                        <Input 
                          type="url"
                          value={formData.featured_image_url}
                          onChange={(e) => handleImageUrlChange(e.target.value, 'featured')}
                          placeholder="https://example.com/featured-image.jpg"
                          className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20" 
                        />
                      ) : (
                        <div className="flex flex-col gap-2">
                          <div 
                            className="flex items-center justify-center border-2 border-dashed border-mj-gold/50 rounded-md p-4 cursor-pointer hover:border-mj-gold/70 transition-colors"
                            onClick={() => handleImageClick('featured')}
                          >
                            <div className="text-center">
                              <Upload className="h-8 w-8 mx-auto mb-2 text-mj-gold" />
                              <p className="text-mj-white/80 text-sm">Click to select featured image</p>
                              <p className="text-mj-white/60 text-xs">Image will be uploaded on submit</p>
                            </div>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e, 'featured')}
                            className="hidden"
                          />
                        </div>
                      )}

                      {/* Featured Image Preview */}
                      {featuredImagePreview && (
                        <div className="mt-3">
                          <Label className="text-mj-white/80 text-sm mb-2 block">Preview:</Label>
                          <div className="relative w-48 h-32 rounded-lg overflow-hidden border-2 border-mj-gold/30">
                            <Image
                              src={featuredImagePreview}
                              alt="Featured Preview"
                              fill
                              className="object-cover"
                              onError={() => setFeaturedImagePreview(null)}
                            />
                          </div>
                          {selectedFeaturedFile && uploadMode === 'file' && (
                            <p className="text-xs text-mj-white/60 mt-1">
                              📁 {selectedFeaturedFile.name} (will be uploaded on submit)
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="md:space-y-2">
                      <Label htmlFor="read_time" className="text-mj-white/80">Read Time (minutes)</Label>
                      <Input 
                        id="read_time"
                        type="number"
                        min="1"
                        value={formData.read_time}
                        onChange={(e) => handleInputChange("read_time", parseInt(e.target.value))}
                        className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20" 
                      />
                    </div>
                    <div className="md:space-y-2">
                      <Label htmlFor="published_at" className="text-mj-white/80">Publish Date</Label>
                      <Input 
                        id="published_at"
                        type="datetime-local"
                        value={formData.published_at}
                        onChange={(e) => handleInputChange("published_at", e.target.value)}
                        className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-mj-gold font-semibold mb-4">Tags</h3>
                  <div className="md:space-y-2">
                    <Label htmlFor="tags" className="text-mj-white/80">Tags (comma separated)</Label>
                    <Input 
                      id="tags"
                      value={formData.tags?.join(', ') || ''}
                      onChange={(e) => {
                        const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                        handleInputChange("tags", tagsArray)
                      }}
                      placeholder="real estate, dubai, investment, luxury properties"
                      className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20" 
                    />
                  </div>
              </div>

              {/* Blog Content */}
              <div className="md:space-y-2" >
                <h3 className="text-mj-gold font-semibold mb-4">Blog Content</h3>
                <div>
                  <Label htmlFor="body" className="text-mj-white/80 mb-2 block">Blog Content</Label>
                  <div className="bg-mj-dark border border-mj-gold/30 rounded-lg">
                    <RichTextEditor
                      value={formData.body}
                      onChange={handleRichTextChange}
                      placeholder="Start writing your blog content here..."
                      className="min-h-[300px]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-mj-gold hover:bg-mj-gold-light text-mj-teal shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-mj-teal mr-2"></div>
                      {(selectedFeaturedFile || selectedAuthorFile) ? 'Uploading Images & Editing Blog...' : 'Editing Blog Post...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Edit Blog Post
                    </>
                  )}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                  className="flex-1 border-mj-gold text-mj-gold hover:bg-mj-gold disabled:opacity-50 cursor-pointer"
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
