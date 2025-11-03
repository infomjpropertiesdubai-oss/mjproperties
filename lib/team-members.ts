// Team Member API utility functions

// Social media platforms and their icons
export const SOCIAL_MEDIA = {
  facebook: {
    name: 'Facebook',
    icon: 'facebook', // For use with icon libraries like react-icons/fa - FaFacebook
  },
  linkedin: {
    name: 'LinkedIn', 
    icon: 'linkedin', // FaLinkedin
  },
  twitter: {
    name: 'Twitter',
    icon: 'twitter', // FaTwitter
  },
  instagram: {
    name: 'Instagram',
    icon: 'instagram', // FaInstagram
  },
  youtube: {
    name: 'YouTube',
    icon: 'youtube', // FaYoutube
  },
  tiktok: {
    name: 'TikTok',
    icon: 'tiktok', // FaTiktok
  },
  whatsapp: {
    name: 'WhatsApp',
    icon: 'whatsapp', // FaWhatsapp
  },
  telegram: {
    name: 'Telegram',
    icon: 'telegram', // FaTelegram
  },
  pinterest: {
    name: 'Pinterest',
    icon: 'pinterest', // FaPinterest
  }
} as const
export interface TeamMember {
  id?: string
  slug: string
  name: string
  title: string
  specialization?: string
  bio?: string
  personal_message?: string
  image_url?: string
  email: string
  phone?: string
  facebook_url?: string
  linkedin_url?: string
  twitter_url?: string
  instagram_url?: string
  // Dynamic social media links (from team_member_socials)
  social_media_links?: Array<{ id: string; platform: string; url: string }>
  // Professional Stats
  years_experience?: number
  properties_sold?: number
  satisfied_clients?: number
  performance_rating?: number
  // Aggregated statistics object (from team_member_statistics)
  statistics?: TeamMemberStatistics
  // Additional fields
  is_active: boolean
  display_order: number
  created_at?: string
  updated_at?: string
}

export interface TeamMemberResponse {
  data: TeamMember
  message?: string
  timestamp?: string
}

export interface TeamMembersListResponse {
  data: TeamMember[]
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

// Team member statistics types
export interface TeamMemberStatistics {
  id: string
  team_member_id: string
  experience: number
  properties_sold: number
  satisfied_clients: number
  performance_rating: number
  created_at: string
  updated_at: string
}

export interface TeamMemberStatisticsResponse {
  data: TeamMemberStatistics
  message?: string
  timestamp?: string
}

// Create a new team member
export async function createTeamMember(
  teamMember: TeamMember, 
  imageFile?: File,
  socialMediaEntries?: Array<{ platform: string; url: string }>
): Promise<TeamMemberResponse> {
  
  // Create FormData for the API
  const formData = new FormData()
  
  // Add all form fields
  formData.append('name', teamMember.name)
  formData.append('title', teamMember.title)
  formData.append('specialization', teamMember.specialization || '')
  formData.append('bio', teamMember.bio || '')
  formData.append('personal_message', teamMember.personal_message || '')
  formData.append('email', teamMember.email)
  formData.append('phone', teamMember.phone || '')
  formData.append('facebook_url', teamMember.facebook_url || '')
  formData.append('linkedin_url', teamMember.linkedin_url || '')
  formData.append('twitter_url', teamMember.twitter_url || '')
  formData.append('instagram_url', teamMember.instagram_url || '')
  // Professional Stats
  formData.append('years_experience', teamMember.years_experience?.toString() || '0')
  formData.append('properties_sold', teamMember.properties_sold?.toString() || '0')
  formData.append('satisfied_clients', teamMember.satisfied_clients?.toString() || '0')
  formData.append('performance_rating', teamMember.performance_rating?.toString() || '0')
  // Additional fields
  formData.append('is_active', teamMember.is_active.toString())
  formData.append('display_order', teamMember.display_order.toString())
  
  // Add social media entries as JSON string
  if (socialMediaEntries && socialMediaEntries.length > 0) {
    formData.append('social_media_entries', JSON.stringify(socialMediaEntries))
  }
  
  // Add image file if provided
  if (imageFile) {
    formData.append('image', imageFile)
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/team-members`, {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create team member')
  }

  return data
}

// Get all team members with optional filtering and pagination
export async function getTeamMembers(options?: {
  active?: boolean
  limit?: number
  offset?: number
}): Promise<TeamMembersListResponse> {
  const params = new URLSearchParams()
  
  if (options?.active !== undefined) {
    params.append('active', options.active.toString())
  }
  if (options?.limit) {
    params.append('limit', options.limit.toString())
  }
  if (options?.offset) {
    params.append('offset', options.offset.toString())
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
  const response = await fetch(`${baseUrl}/api/team-members?${params.toString()}`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch team members')
  }

  return data
}

// Get a specific team member by slug
export async function getTeamMember(slug: string): Promise<TeamMemberResponse> {
  
  // For server-side execution, use Supabase directly
  if (typeof window === 'undefined') {
    const { supabase } = await import('@/lib/supabase')
    
    // Get team member by slug
    const { data: teamMemberData, error: teamMemberError } = await supabase
      .from('team_members')
      .select('*')
      .eq('slug', slug)
      .single()

    if (teamMemberError) {
      console.error('Error fetching team member:', teamMemberError)
      throw new Error(`Failed to fetch team member: ${teamMemberError.message}`)
    }

    if (!teamMemberData) {
      console.error('Team member not found for slug:', slug)
      throw new Error('Team member not found')
    }

    const id = teamMemberData.id

    // Get social links (all links for this team member)
    const { data: socialData, error: socialError } = await supabase
      .from('team_member_socials')
      .select('id, platform, url')
      .eq('team_member_id', id)

    if (socialError) {
      console.error('Error fetching social links:', socialError)
    }

    // Get professional statistics
    const { data: statsData } = await supabase
      .from('team_member_statistics')
      .select('experience, properties_sold, satisfied_clients, performance_rating')
      .eq('team_member_id', id)
      .single()

    // Flatten the data - include all social media links
    const flattenedData = {
      ...teamMemberData,
      // Social media links (first occurrence for backward compatibility)
      facebook_url: socialData?.find(s => s.platform === 'facebook')?.url || null,
      linkedin_url: socialData?.find(s => s.platform === 'linkedin')?.url || null,
      twitter_url: socialData?.find(s => s.platform === 'twitter')?.url || null,
      instagram_url: socialData?.find(s => s.platform === 'instagram')?.url || null,
      // All social media links (for dynamic display)
      social_media_links: socialData || [],
      // Professional statistics
      years_experience: statsData?.experience || 0,
      properties_sold: statsData?.properties_sold || 0,
      satisfied_clients: statsData?.satisfied_clients || 0,
      performance_rating: statsData?.performance_rating || 0
    }

    return {
      data: flattenedData,
      message: 'Team member retrieved successfully',
      timestamp: new Date().toISOString()
    }
  }

  // For client-side execution, use fetch
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
  const response = await fetch(`${baseUrl}/api/team-members/${slug}`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch team member')
  }

  return data
}

// Update a team member
export async function updateTeamMember(id: string, teamMember: Partial<TeamMember>): Promise<TeamMemberResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/team-members`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...teamMember, id }),
  })

  const data = await response.json()

  if (!response.ok) {
    // If there are validation details, show them
    if (data.details && Array.isArray(data.details)) {
      throw new Error(data.details.join(', ') || data.error || 'Failed to update team member')
    }
    throw new Error(data.error || 'Failed to update team member')
  }

  return data
}

// Delete a team member
export async function deleteTeamMember(id: string): Promise<{ message: string; deletedMember: { id: string; name: string } }> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/team-members?id=${id}`, {
    method: 'DELETE',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete team member')
  }

  return data
}


// Validation helper function
export function validateTeamMemberForm(data: TeamMember): string[] {
  const errors: string[] = []

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required')
  }
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required')
  }
  if (!data.email || data.email.trim().length === 0) {
    errors.push('Email is required')
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (data.email && !emailRegex.test(data.email)) {
    errors.push('Invalid email format')
  }

  // Phone validation (if provided)
  if (data.phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.push('Invalid phone number format')
    }
  }

  // URL validation for social media links
  const urlRegex = /^https?:\/\/.+/
  if (data.facebook_url && !urlRegex.test(data.facebook_url)) {
    errors.push('Invalid Facebook URL format')
  }
  if (data.linkedin_url && !urlRegex.test(data.linkedin_url)) {
    errors.push('Invalid LinkedIn URL format')
  }
  if (data.instagram_url && !urlRegex.test(data.instagram_url)) {
    errors.push('Invalid Instagram URL format')
  }
  if (data.twitter_url && !urlRegex.test(data.twitter_url)) {
    errors.push('Invalid Twitter URL format')
  }

  // Image URL validation (if provided)
  if (data.image_url && !urlRegex.test(data.image_url)) {
    errors.push('Invalid image URL format')
  }

  // Professional statistics validation
  if (data.years_experience !== undefined && (isNaN(data.years_experience) || data.years_experience < 0)) {
    errors.push('Years of experience must be a non-negative number')
  }
  if (data.properties_sold !== undefined && (isNaN(data.properties_sold) || data.properties_sold < 0)) {
    errors.push('Properties sold must be a non-negative number')
  }
  if (data.satisfied_clients !== undefined && (isNaN(data.satisfied_clients) || data.satisfied_clients < 0)) {
    errors.push('Satisfied clients must be a non-negative number')
  }
  if (data.performance_rating !== undefined && (isNaN(data.performance_rating) || data.performance_rating < 0 || data.performance_rating > 5)) {
    errors.push('Performance rating must be a number between 0 and 5')
  }

  return errors
}
