import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import cloudinary from '@/lib/cloudinary'

// Validation function for blog data
function validateBlogData(data: any) {
  const errors: string[] = []

  // Required fields
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required')
  }

  if (
    !data.body ||
    (typeof data.body === 'object' && Object.keys(data.body).length === 0) ||
    (typeof data.body === 'string' && data.body.trim().length === 0)
  ) {
    errors.push('Content is required')
  }

  // URL validation for author profile link
  if (data.author_profile_link) {
    const urlRegex = /^https?:\/\/.+/
    if (!urlRegex.test(data.author_profile_link)) {
      errors.push('Invalid author profile link format')
    }
  }

  // URL validation for featured image
  if (data.featured_image_url) {
    const urlRegex = /^https?:\/\/.+/
    if (!urlRegex.test(data.featured_image_url)) {
      errors.push('Invalid featured image URL format')
    }
  }

  // URL validation for author image
  if (data.author_image_url) {
    const urlRegex = /^https?:\/\/.+/
    if (!urlRegex.test(data.author_image_url)) {
      errors.push('Invalid author image URL format')
    }
  }

  // Read time validation
  if (data.read_time && (data.read_time < 1 || data.read_time > 60)) {
    errors.push('Read time must be between 1 and 60 minutes')
  }

  return errors
}


// GET method to retrieve a specific blog post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Database error:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Blog post not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to fetch blog post' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      data,
      message: 'Blog post retrieved successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT method to update a specific blog post by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
      )
    }

    // First, check if the blog post exists
    const { data: existingBlog, error: fetchError } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Database error fetching blog:', fetchError)
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Blog post not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to fetch blog post' },
        { status: 500 }
      )
    }

    // Parse FormData
    const formData = await request.formData()
    
    
    // Extract form fields
    const title = formData.get('title') as string
    const body = formData.get('body') as string
    const author_name = formData.get('author_name') as string
    const author_profile_link = formData.get('author_profile_link') as string
    const category = formData.get('category') as string
    const status = formData.get('status') as string
    const read_time = formData.get('read_time') as string
    const tags = formData.get('tags') as string
    
    // Extract image files
    const featuredImageFile = formData.get('featured_image') as File | null
    const authorImageFile = formData.get('author_image') as File | null
    
    
    // Interpret body: accept raw HTML string (from Quill) or JSON (legacy)
    let parsedBody: any = null
    if (typeof body === 'string') {
      const trimmed = body.trim()
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          parsedBody = JSON.parse(trimmed)
        } catch (error) {
          return NextResponse.json(
            { error: 'Invalid JSON format for blog body' },
            { status: 400 }
          )
        }
      } else {
        parsedBody = trimmed // treat as HTML
      }
    } else {
      parsedBody = body
    }
    
    // Parse tags
    let parsedTags: string[] = []
    if (tags) {
      parsedTags = tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
    }
    
    // Prepare data object for validation
    const blogData = {
      title,
      body: parsedBody,
      author_name,
      author_profile_link,
      category,
      status: status || 'draft',
      read_time: read_time ? parseInt(read_time) : null,
      tags: parsedTags
    }
    
    // Validate input data
    const validationErrors = validateBlogData(blogData)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationErrors 
        },
        { status: 400 }
      )
    }

    // Prepare update data starting with existing values
    const updateData: any = {
      title: title.trim(),
      body: parsedBody,
      author_name: author_name?.trim() || null,
      author_profile_link: author_profile_link?.trim() || null,
      category: category?.trim() || null,
      status: status || 'draft',
      read_time: read_time ? parseInt(read_time) : null,
      tags: parsedTags.length > 0 ? parsedTags : null,
      updated_at: new Date().toISOString()
    }

    // Handle images - keep existing URLs unless new images are provided
    let featuredImageUrl = existingBlog.featured_image_url
    let featuredImagePublicId = existingBlog.featured_image_public_id
    let authorImageUrl = existingBlog.author_image_url
    let authorImagePublicId = existingBlog.author_image_public_id

    // Upload new featured image if provided
    if (featuredImageFile && featuredImageFile.size > 0) {
      try {
        // Delete existing featured image from Cloudinary if it exists
        if (existingBlog.featured_image_public_id) {
          await cloudinary.uploader.destroy(existingBlog.featured_image_public_id)
        }

        // Convert File to Buffer
        const bytes = await featuredImageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Convert buffer to base64 string for Cloudinary upload
        const base64String = buffer.toString('base64')
        const dataURI = `data:${featuredImageFile.type};base64,${base64String}`
        
        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(dataURI, {
          folder: 'blogs/featured-images',
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 630, crop: 'fill', gravity: 'auto' },
            { quality: 'auto' }
          ]
        })

        featuredImageUrl = uploadResult.secure_url
        featuredImagePublicId = uploadResult.public_id
      } catch (uploadError: any) {
        console.error('Cloudinary upload error:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload featured image', details: uploadError.message },
          { status: 500 }
        )
      }
    }

    // Upload new author image if provided
    if (authorImageFile && authorImageFile.size > 0) {
      try {
        // Delete existing author image from Cloudinary if it exists
        if (existingBlog.author_image_public_id) {
          await cloudinary.uploader.destroy(existingBlog.author_image_public_id)
        }

        // Convert File to Buffer
        const bytes = await authorImageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Convert buffer to base64 string for Cloudinary upload
        const base64String = buffer.toString('base64')
        const dataURI = `data:${authorImageFile.type};base64,${base64String}`
        
        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(dataURI, {
          folder: 'blogs/author-images',
          resource_type: 'image',
          transformation: [
            { width: 200, height: 200, crop: 'fill', gravity: 'face' },
            { quality: 'auto' }
          ]
        })

        authorImageUrl = uploadResult.secure_url
        authorImagePublicId = uploadResult.public_id
      } catch (uploadError: any) {
        console.error('Cloudinary upload error:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload author image', details: uploadError.message },
          { status: 500 }
        )
      }
    }

    // Add image URLs to update data
    updateData.featured_image_url = featuredImageUrl
    updateData.featured_image_public_id = featuredImagePublicId
    updateData.author_image_url = authorImageUrl
    updateData.author_image_public_id = authorImagePublicId

    // Handle published_at timestamp
    if (status === 'published' && existingBlog.status !== 'published') {
      updateData.published_at = new Date().toISOString()
    } else if (status !== 'published' && existingBlog.status === 'published') {
      updateData.published_at = null
    }

    // Update blog post in database
    const { data, error } = await supabase
      .from('blogs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update blog post', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Blog post updated successfully', 
        data,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE method to delete a specific blog post by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
      )
    }

    // First, fetch the blog post to get image public IDs for cleanup
    const { data: existingBlog, error: fetchError } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Database error fetching blog:', fetchError)
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Blog post not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to fetch blog post' },
        { status: 500 }
      )
    }

    // Delete images from Cloudinary if they exist
    const deletePromises = []
    
    if (existingBlog.featured_image_public_id) {
      deletePromises.push(
        cloudinary.uploader.destroy(existingBlog.featured_image_public_id)
      )
    }
    
    if (existingBlog.author_image_public_id) {
      deletePromises.push(
        cloudinary.uploader.destroy(existingBlog.author_image_public_id)
      )
    }

    // Wait for all image deletions to complete (don't fail if images don't exist)
    await Promise.all(deletePromises)

    // Delete blog post from database
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to delete blog post', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Blog post deleted successfully',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
