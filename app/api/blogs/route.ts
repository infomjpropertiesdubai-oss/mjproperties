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

export async function POST(request: NextRequest) {
  try {
    
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

    let featuredImageUrl = null
    let featuredImagePublicId = null
    let authorImageUrl = null
    let authorImagePublicId = null

    // Upload featured image to Cloudinary if provided
    if (featuredImageFile && featuredImageFile.size > 0) {
      try {
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

    // Upload author image to Cloudinary if provided
    if (authorImageFile && authorImageFile.size > 0) {
      try {
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

    // Prepare data for insertion
    const finalBlogData = {
      title: title.trim(),
      body: parsedBody,
      author_name: author_name?.trim() || null,
      author_profile_link: author_profile_link?.trim() || null,
      author_image_url: authorImageUrl,
      category: category?.trim() || null,
      status: status || 'draft',
      read_time: read_time ? parseInt(read_time) : null,
      tags: parsedTags.length > 0 ? parsedTags : null,
      featured_image_url: featuredImageUrl,
      featured_image_public_id: featuredImagePublicId,
      author_image_public_id: authorImagePublicId,
      published_at: status === 'published' ? new Date().toISOString() : null
    }

    // Insert blog post into database
    const { data, error } = await supabase
      .from('blogs')
      .insert(finalBlogData)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create blog post', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Blog post created successfully', 
        data,
        timestamp: new Date().toISOString()
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET method to retrieve blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })

    // Filter by status if specified
    if (status) {
      query = query.eq('status', status)
    }

    // Filter by category if specified
    if (category) {
      query = query.eq('category', category)
    }

    // Search functionality
    if (search) {
      query = query.or(`title.ilike.%${search}%,author_name.ilike.%${search}%`)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch blog posts' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data,
      pagination: {
        limit,
        offset,
        total: count || 0
      }
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


