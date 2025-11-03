"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  X
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import { getHeroSections, deleteHeroSection, HeroSection } from "@/lib/hero-sections"

export default function HeroSectionsPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [heroSectionToDelete, setHeroSectionToDelete] = useState<{ id: string; title: string; index: number } | null>(null)
  const [heroSections, setHeroSections] = useState<HeroSection[]>([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeletingIndex, setIsDeletingIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [editingHeroSection, setEditingHeroSection] = useState<HeroSection | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: ''
  })

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('file')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchHeroSections = async () => {
    try {
      setIsLoading(true)
      const response = await getHeroSections({ limit: 100 })
      setHeroSections(response.data)
    } catch (error) {
      console.error('Error fetching hero sections:', error)
      toast.error('Failed to fetch hero sections')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHeroSections()
  }, [])

  const handleDeleteHeroSection = async (heroSectionId: string, index: number) => {
    setIsDeleting(true)
    setIsDeletingIndex(index)
    try {
      await deleteHeroSection(heroSectionId)
      toast.success('Hero section deleted successfully')
      fetchHeroSections()
      setDeleteDialogOpen(false)
      setHeroSectionToDelete(null)
      setIsDeletingIndex(null)
    } catch (error) {
      console.error('Error deleting hero section:', error)
      toast.error('Failed to delete hero section')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleOpenEditDialog = (heroSection?: HeroSection) => {
    if (heroSection) {
      setEditingHeroSection(heroSection)
      setFormData({
        title: heroSection.title,
        subtitle: heroSection.subtitle || '',
        image_url: heroSection.image_url || ''
      })
      setImagePreview(heroSection.image_url || null)
      setSelectedFile(null)
      setUploadMode(heroSection.image_url && !heroSection.image_public_id ? 'url' : 'file')
    } else {
      setEditingHeroSection(null)
      setFormData({
        title: '',
        subtitle: '',
        image_url: ''
      })
      setImagePreview(null)
      setSelectedFile(null)
      setUploadMode('file')
    }
    setEditDialogOpen(true)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('Image size should be less than 10MB')
        return
      }

      setSelectedFile(file)
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const handleImageUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }))
    setImagePreview(url)
    setSelectedFile(null)
  }

  const handleImageClick = () => {
    if (uploadMode === 'file') {
      fileInputRef.current?.click()
    }
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setImagePreview(null)
    setFormData(prev => ({ ...prev, image_url: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSaveHeroSection = async () => {
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }

    if (uploadMode === 'file' && !selectedFile && !imagePreview) {
      toast.error('Please select an image')
      return
    }

    if (uploadMode === 'url' && !formData.image_url.trim()) {
      toast.error('Please provide an image URL')
      return
    }

    setIsSaving(true)
    try {
      // Create FormData for the API request
      const submitFormData = new FormData()

      submitFormData.append('title', formData.title)
      submitFormData.append('subtitle', formData.subtitle || '')

      // Add image file or URL
      if (uploadMode === 'file' && selectedFile) {
        submitFormData.append('image', selectedFile)
      } else if (uploadMode === 'url' && formData.image_url) {
        submitFormData.append('image_url', formData.image_url)
      }

      let response
      if (editingHeroSection) {
        // Update existing hero section
        response = await fetch(`/api/hero-sections/${editingHeroSection.id}`, {
          method: 'PATCH',
          body: submitFormData,
        })
      } else {
        // Create new hero section
        response = await fetch('/api/hero-sections', {
          method: 'POST',
          body: submitFormData,
        })
      }

      if (response.ok) {
        toast.success(editingHeroSection ? 'Hero section updated successfully' : 'Hero section created successfully')
        fetchHeroSections()
        setEditDialogOpen(false)
        setEditingHeroSection(null)
        setFormData({ title: '', subtitle: '', image_url: '' })
        setSelectedFile(null)
        setImagePreview(null)
      } else {
        const error = await response.json()
        console.error('API Error:', error)
        const errorMessage = error.details
          ? `${error.error}: ${typeof error.details === 'string' ? error.details : error.details.join(', ')}`
          : error.error || 'Failed to save hero section'
        toast.error(errorMessage, { duration: 5000 })

        // Show hint if available
        if (error.hint) {
          toast.info(error.hint, { duration: 7000 })
        }
      }
    } catch (error) {
      console.error('Error saving hero section:', error)
      toast.error(`Failed to save hero section: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mj-teal via-mj-teal-light to-mj-dark text-mj-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 mt-16">
          <div>
            <h1 className="text-3xl font-bold text-mj-gold">Hero Sections</h1>
            <p className="text-mj-white/80 mt-2">
              Manage hero slider sections for your homepage
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={fetchHeroSections}
              disabled={isLoading}
              className="border-mj-gold text-mj-gold hover:bg-mj-gold"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={() => handleOpenEditDialog()} className="bg-mj-gold text-mj-teal hover:bg-mj-gold/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Hero Section
            </Button>
          </div>
        </div>

        {/* Table Card */}
        <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-mj-gold">All Hero Sections</CardTitle>
            <CardDescription className="text-mj-white/80">
              {heroSections.length} {heroSections.length === 1 ? 'section' : 'sections'} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-mj-gold" />
              </div>
            ) : heroSections.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-mj-white/80 mb-4">No hero sections found</p>
                <Button onClick={() => handleOpenEditDialog()} className="bg-mj-gold text-mj-teal hover:bg-mj-gold/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Hero Section
                </Button>
              </div>
            ) : (
              <div className="rounded-md border border-mj-gold/20">
                <Table>
                  <TableHeader>
                    <TableRow className="border-mj-gold/20 hover:bg-mj-dark/50">
                      <TableHead className="text-mj-gold w-20">Image</TableHead>
                      <TableHead className="text-mj-gold">Title</TableHead>
                      <TableHead className="text-mj-gold">Subtitle</TableHead>
                      <TableHead className="text-mj-gold">Created</TableHead>
                      <TableHead className="text-mj-gold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {heroSections.map((heroSection, index) => (
                      <TableRow key={heroSection.id} className="border-mj-gold/20 hover:bg-mj-dark/50">
                        <TableCell>
                          {heroSection.image_url ? (
                            <div className="relative w-16 h-10 rounded overflow-hidden border border-mj-gold/30">
                              <Image
                                src={heroSection.image_url}
                                alt={heroSection.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-10 rounded bg-mj-dark flex items-center justify-center border border-mj-gold/30">
                              <ImageIcon className="h-4 w-4 text-mj-gold/50" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-mj-white">{heroSection.title}</TableCell>
                        <TableCell className="max-w-xs truncate text-mj-white/80">
                          {heroSection.subtitle || '-'}
                        </TableCell>
                        <TableCell className="text-mj-white/80">
                          {heroSection.created_at
                            ? format(new Date(heroSection.created_at), 'MMM d, yyyy')
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEditDialog(heroSection)}
                              className="text-mj-gold hover:text-mj-gold hover:bg-mj-gold/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setHeroSectionToDelete({
                                  id: heroSection.id,
                                  title: heroSection.title,
                                  index
                                })
                                setDeleteDialogOpen(true)
                              }}
                              disabled={isDeleting && isDeletingIndex === index}
                              className="text-red-400 hover:text-red-400 hover:bg-red-400/10"
                            >
                              {isDeleting && isDeletingIndex === index ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-mj-teal-light border-mj-gold/20 text-mj-white">
          <DialogHeader>
            <DialogTitle className="text-mj-gold">
              {editingHeroSection ? 'Edit Hero Section' : 'Add Hero Section'}
            </DialogTitle>
            <DialogDescription className="text-mj-white/80">
              {editingHeroSection
                ? 'Update the hero section details below'
                : 'Create a new hero section for your homepage slider'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-mj-gold">Title *</Label>
              <Input
                id="title"
                placeholder="Premium Properties in Dubai"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-mj-dark/50 border-mj-gold/30 text-mj-white placeholder:text-mj-white/40"
              />
            </div>

            {/* Subtitle */}
            <div className="grid gap-2">
              <Label htmlFor="subtitle" className="text-mj-gold">Subtitle</Label>
              <Input
                id="subtitle"
                placeholder="Discover your dream home in the heart of luxury"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="bg-mj-dark/50 border-mj-gold/30 text-mj-white placeholder:text-mj-white/40"
              />
            </div>

            {/* Image Upload */}
            <div className="grid gap-2">
              <Label className="text-mj-gold">Hero Image *</Label>
              <Tabs value={uploadMode} onValueChange={(value) => setUploadMode(value as 'url' | 'file')}>
                <TabsList className="grid w-full grid-cols-2 bg-mj-dark/50">
                  <TabsTrigger value="file" className="data-[state=active]:bg-mj-gold data-[state=active]:text-mj-teal">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </TabsTrigger>
                  <TabsTrigger value="url" className="data-[state=active]:bg-mj-gold data-[state=active]:text-mj-teal">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Image URL
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="file" className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {imagePreview ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-mj-gold/30">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      onClick={handleImageClick}
                      className="w-full h-48 rounded-lg border-2 border-dashed border-mj-gold/30 hover:border-mj-gold/50 flex flex-col items-center justify-center cursor-pointer bg-mj-dark/30 hover:bg-mj-dark/50 transition-colors"
                    >
                      <Upload className="h-12 w-12 text-mj-gold/50 mb-2" />
                      <p className="text-sm text-mj-white/60">Click to upload image</p>
                      <p className="text-xs text-mj-white/40 mt-1">Max size: 10MB</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="url" className="space-y-4">
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image_url}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    className="bg-mj-dark/50 border-mj-gold/30 text-mj-white placeholder:text-mj-white/40"
                  />
                  {imagePreview && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-mj-gold/30">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                        onError={() => toast.error('Invalid image URL')}
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={isSaving}
              className="border-mj-gold text-mj-gold hover:bg-mj-gold hover:text-mj-teal"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveHeroSection} disabled={isSaving} className="bg-mj-gold text-mj-teal hover:bg-mj-gold/90">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingHeroSection ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-mj-teal-light border-mj-gold/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-mj-gold">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-mj-white/80">
              This will permanently delete the hero section &quot;{heroSectionToDelete?.title}&quot;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="border-mj-gold text-mj-gold hover:bg-mj-gold hover:text-mj-teal">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (heroSectionToDelete) {
                  handleDeleteHeroSection(heroSectionToDelete.id, heroSectionToDelete.index)
                }
              }}
              disabled={isDeleting}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
