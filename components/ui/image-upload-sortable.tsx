"use client"

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from './button'
import { Card, CardContent } from './card'
import { Progress } from './progress'
import { X, GripVertical, Upload, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface UploadedImage {
  id: string
  image_url: string
  image_alt: string
  order: number
  file?: File
}

interface ImageUploadSortableProps {
  images: UploadedImage[]
  onImagesChange: (images: UploadedImage[]) => void
  maxImages?: number
  acceptedTypes?: { [key: string]: string[] }
  maxSize?: number
  folder?: string
  className?: string
}

interface SortableImageItemProps {
  image: UploadedImage
  onRemove: (id: string) => void
  isUploading?: boolean
  uploadProgress?: number
}

// Individual sortable image item component
function SortableImageItem({ 
  image, 
  onRemove, 
  isUploading = false, 
  uploadProgress = 0 
}: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative bg-mj-dark border border-mj-gold/20 rounded-lg overflow-hidden",
        isDragging && "opacity-50 z-50"
      )}
    >
      <div className="aspect-video relative">
        {image.image_url ? (
          <img
            src={image.image_url}
            alt={image.image_alt || `Property image ${image.order + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-mj-dark border-2 border-dashed border-mj-gold/30 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-mj-gold/50" />
          </div>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="mb-2">Uploading...</div>
              <Progress value={uploadProgress} className="w-24" />
            </div>
          </div>
        )}

        {/* Order badge */}
        <div className="absolute top-2 left-2 bg-mj-gold text-mj-teal text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {image.order + 1}
        </div>

        {/* Remove button */}
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onRemove(image.id)}
        >
          <X className="w-3 h-3" />
        </Button>

        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute bottom-2 right-2 w-6 h-6 bg-mj-gold/80 rounded cursor-grab active:cursor-grabbing flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-3 h-3 text-mj-teal" />
        </div>
      </div>

      {/* Image info */}
      <div className="p-2">
        <p className="text-xs text-mj-white/60 truncate">
          {image.file?.name || 'Uploaded image'}
        </p>
      </div>
    </div>
  )
}

export function ImageUploadSortable({
  images,
  onImagesChange,
  maxImages = 10,
  acceptedTypes = {
    'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
  },
  maxSize = 5 * 1024 * 1024, // 5MB
  folder = 'properties',
  className
}: ImageUploadSortableProps) {
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set())
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Upload image to Cloudinary via our API
  const uploadToCloudinary = async (file: File): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('folder', folder)

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const data = await response.json()
    return {
      url: data.imageUrl,
      publicId: data.publicId,
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    for (const file of acceptedFiles) {
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Add temporary image to state
      const tempImage: UploadedImage = {
        id: tempId,
        image_url: URL.createObjectURL(file), // Temporary URL for preview
        image_alt: '',
        order: images.length,
        file,
      }

      // Add to images immediately for preview
      const newImages = [...images, tempImage]
      onImagesChange(newImages)
      
      // Start upload
      setUploadingFiles(prev => new Set(prev).add(tempId))
      setUploadProgress(prev => ({ ...prev, [tempId]: 0 }))

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => ({
            ...prev,
            [tempId]: Math.min((prev[tempId] || 0) + 10, 90)
          }))
        }, 200)

        const { url } = await uploadToCloudinary(file)

        clearInterval(progressInterval)
        
        // Update with real URL
        const updatedImages = newImages.map((img: UploadedImage) => 
          img.id === tempId 
            ? { ...img, image_url: url, image_alt: '' } // Empty alt text as requested
            : img
        )
        onImagesChange(updatedImages)

        setUploadProgress(prev => ({ ...prev, [tempId]: 100 }))
        
        // Remove from uploading set after a brief delay
        setTimeout(() => {
          setUploadingFiles(prev => {
            const newSet = new Set(prev)
            newSet.delete(tempId)
            return newSet
          })
          setUploadProgress(prev => {
            const newProgress = { ...prev }
            delete newProgress[tempId]
            return newProgress
          })
        }, 1000)

      } catch (error) {
        console.error('Upload failed:', error)
        
        // Remove failed upload
        const filteredImages = newImages.filter((img: UploadedImage) => img.id !== tempId)
        onImagesChange(filteredImages)
        setUploadingFiles(prev => {
          const newSet = new Set(prev)
          newSet.delete(tempId)
          return newSet
        })
        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[tempId]
          return newProgress
        })
        
        alert('Failed to upload image. Please try again.')
      }
    }
  }, [images, maxImages, onImagesChange, folder])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxSize,
    disabled: images.length >= maxImages,
  })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex(img => img.id === active.id)
      const newIndex = images.findIndex(img => img.id === over.id)

      const newImages = arrayMove(images, oldIndex, newIndex).map((img, index) => ({
        ...img,
        order: index,
      }))

      onImagesChange(newImages)
    }
  }

  const removeImage = (id: string) => {
    const newImages = images
      .filter(img => img.id !== id)
      .map((img, index) => ({ ...img, order: index }))
    
    onImagesChange(newImages)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload area */}
      <Card className="bg-mj-dark border-mj-gold/20">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive 
                ? "border-mj-gold bg-mj-gold/10" 
                : "border-mj-gold/30 hover:border-mj-gold/50",
              images.length >= maxImages && "opacity-50 cursor-not-allowed"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-mj-gold mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-mj-white">Drop the images here...</p>
            ) : (
              <div className="text-mj-white">
                <p className="text-lg font-medium mb-2">
                  Drag & drop images here, or click to select
                </p>
                <p className="text-sm text-mj-white/60">
                  {images.length}/{maxImages} images • Max {maxSize / 1024 / 1024}MB per image
                </p>
                <p className="text-xs text-mj-white/40 mt-1">
                  Supports: JPG, PNG, WebP, GIF
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Images grid */}
      {images.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map(img => img.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <SortableImageItem
                  key={image.id}
                  image={image}
                  onRemove={removeImage}
                  isUploading={uploadingFiles.has(image.id)}
                  uploadProgress={uploadProgress[image.id] || 0}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-mj-white/60">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-mj-gold/30" />
          <p>No images uploaded yet</p>
        </div>
      )}
    </div>
  )
}
