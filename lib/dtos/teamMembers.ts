import { getTeamMember } from "../team-members"
import type { Metadata } from "next"

export interface TeamMemberMetadata {
  title: string
  description: string
  openGraph?: any
  twitter?: any
  alternates?: any
  keywords?: string[]
}

export const generateTeamMemberMetadata = async (slug: string): Promise<Metadata> => {
  try {
    const { data: teamMember } = await getTeamMember(slug)
    
    if (!teamMember) {
      return {
        title: "Team Member - MJ Properties",
        description: "Expert real estate professional at MJ Properties",
      }
    }

    const { name, title, bio, specialization, image_url, email, phone, years_experience, properties_sold, satisfied_clients } = teamMember
    
    // Build SEO-friendly title
    const seoTitle = `${name} - ${title} | Expert Real Estate Professional | MJ Properties`
    
    // Build rich description
    const description = bio 
      ? `${bio.substring(0, 155)}... Contact ${name} for expert real estate services in Dubai with MJ Properties.`
      : `Meet ${name}, ${title}${specialization ? ` specializing in ${specialization}` : ''} at MJ Properties. ${years_experience ? `${years_experience}+ years` : ''} experience${properties_sold ? `, ${properties_sold}+ properties sold` : ''}${satisfied_clients ? `, ${satisfied_clients}+ satisfied clients` : ''}. Expert real estate services in Dubai.`

    const keywords = [
      name,
      title,
      specialization || '',
      'real estate Dubai',
      'MJ Properties',
      'Dubai property expert',
      'real estate agent',
      'property consultant',
      'Dubai real estate professional'
    ].filter(Boolean)

    const canonicalUrl = `https://www.mjproperties.com/team/${slug}`
    const imageUrl = image_url || '/placeholder-user.jpg'

    return {
      title: seoTitle,
      description,
      keywords: keywords.join(', '),
      authors: [{ name: "MJ Properties" }],
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: seoTitle,
        description,
        url: canonicalUrl,
        siteName: "MJ Properties",
        locale: "en_US",
        type: "profile",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${name} - ${title} at MJ Properties`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${name} - ${title}`,
        description: description.substring(0, 200),
        images: [imageUrl],
      },
      other: {
        'article:author': name,
        'profile:first_name': name.split(' ')[0],
        'profile:last_name': name.split(' ').slice(1).join(' '),
      }
    }
  } catch (error) {
    console.error("Error generating team member metadata:", error)
    return {
      title: "Team Member - MJ Properties",
      description: "Expert real estate professional at MJ Properties in Dubai.",
    }
  }
}