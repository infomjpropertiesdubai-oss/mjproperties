// Blog API utility functions
export interface Blog {
  id?: string
  title: string
  body: any // JSONB for rich text content (Tiptap JSON format)
  featured_image_url?: string
  featured_image_public_id?: string
  author_name?: string
  author_profile_link?: string
  author_image_url?: string
  author_image_public_id?: string
  category?: string
  status?: 'draft' | 'published' | 'archived'
  read_time?: number
  view_count?: number
  tags?: string[]
  published_at?: string
  created_at?: string
  updated_at?: string
}

export interface BlogResponse {
  data: Blog
  message?: string
  timestamp?: string
}

export interface BlogsListResponse {
  data: Blog[]
  pagination: {
    limit: number
    offset: number
    total: number
  }
}

export interface ApiError {
  error: string
  details?: string[]
}

// Create a new blog post with FormData (supports file uploads)
export async function createBlog(blogData: {
  blog: Blog
  featuredImageFile?: File
  authorImageFile?: File
}): Promise<BlogResponse> {
  const formData = new FormData()
  
  // Add blog data fields
  const { blog, featuredImageFile, authorImageFile } = blogData
  
  if (blog.title) formData.append('title', blog.title)
  if (blog.body) formData.append('body', JSON.stringify(blog.body))
  if (blog.author_name) formData.append('author_name', blog.author_name)
  if (blog.author_profile_link) formData.append('author_profile_link', blog.author_profile_link)
  if (blog.category) formData.append('category', blog.category)
  if (blog.status) formData.append('status', blog.status)
  if (blog.read_time) formData.append('read_time', blog.read_time.toString())
  if (blog.tags) formData.append('tags', blog.tags.join(','))
  
  // Add files if provided
  if (featuredImageFile) formData.append('featured_image', featuredImageFile)
  if (authorImageFile) formData.append('author_image', authorImageFile)

  const response = await fetch('/api/blogs', {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create blog post')
  }

  return data
}

// Create a blog post without files (JSON only) - for testing or simple operations
export async function createBlogJson(
  blog: Blog,
  featuredImageUrl?: string,
  authorImageUrl?: string
): Promise<BlogResponse> {
  const createData = { ...blog }
  
  // Add image URLs if provided
  if (featuredImageUrl) createData.featured_image_url = featuredImageUrl
  if (authorImageUrl) createData.author_image_url = authorImageUrl

  const response = await fetch('/api/blogs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create blog post')
  }

  return data
}

// Get all blog posts with optional filtering and pagination
export async function getBlogs(options?: {
  status?: 'draft' | 'published' | 'archived'
  category?: string
  limit?: number
  offset?: number
  search?: string
}): Promise<BlogsListResponse> {
  const params = new URLSearchParams()
  
  if (options?.status) {
    params.append('status', options.status)
  }
  if (options?.category) {
    params.append('category', options.category)
  }
  if (options?.limit) {
    params.append('limit', options.limit.toString())
  }
  if (options?.offset) {
    params.append('offset', options.offset.toString())
  }
  if (options?.search) {
    params.append('search', options.search)
  }

  const response = await fetch(`/api/blogs?${params.toString()}`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch blog posts')
  }

  return data
}

// Get a specific blog post by ID
export async function getBlog(id: string): Promise<Blog> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${id}`)
  const data = await response.json()
  const filteredData = data.data
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch blog post')
  }

  return filteredData
}

// Update a blog post with FormData (supports file uploads)
export async function updateBlog(id: string, blogData: {
  blog: Partial<Blog>
  featuredImageFile?: File
  authorImageFile?: File
}): Promise<BlogResponse> {
  const formData = new FormData()
  
  // Add blog data fields
  const { blog, featuredImageFile, authorImageFile } = blogData
  
  if (blog.title) formData.append('title', blog.title)
  if (blog.body) formData.append('body', JSON.stringify(blog.body))
  if (blog.author_name) formData.append('author_name', blog.author_name)
  if (blog.author_profile_link) formData.append('author_profile_link', blog.author_profile_link)
  if (blog.category) formData.append('category', blog.category)
  if (blog.status) formData.append('status', blog.status)
  if (blog.read_time) formData.append('read_time', blog.read_time.toString())
  if (blog.tags) formData.append('tags', blog.tags.join(','))
  
  // Add files if provided
  if (featuredImageFile) formData.append('featured_image', featuredImageFile)
  if (authorImageFile) formData.append('author_image', authorImageFile)

  const response = await fetch(`/api/blogs/${id}`, {
    method: 'PUT',
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update blog post')
  }

  return data
}

// Update a blog post without files (JSON only)
export async function updateBlogJson(
  id: string, 
  blog: Partial<Blog>,
  featuredImageUrl?: string,
  authorImageUrl?: string
): Promise<BlogResponse> {
  const updateData = { ...blog }
  
  // Add image URLs if provided
  if (featuredImageUrl) updateData.featured_image_url = featuredImageUrl
  if (authorImageUrl) updateData.author_image_url = authorImageUrl

  const response = await fetch(`/api/blogs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update blog post')
  }

  return data
}

// Delete a blog post
export async function deleteBlog(id: string): Promise<{ message: string }> {
  const response = await fetch(`/api/blogs/${id}`, {
    method: 'DELETE',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete blog post')
  }

  return data
}

// Validation helper function
export function validateBlogForm(data: Blog): string[] {
  const errors: string[] = []

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required')
  }

  if (!data.body || (typeof data.body === 'object' && Object.keys(data.body).length === 0)) {
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

