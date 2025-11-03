import { getProperty, Property } from "../properties"
import type { Metadata } from "next"

export interface PropertyMetadata {
    title: string
    description: string
    openGraph?: any
    twitter?: any
    alternates?: any
    keywords?: string[]
}

export const generatePropertyMetadata = async (id: string): Promise<Metadata> => {
  try {
    const { data: property } = await getProperty(id)
    
    if (!property) {
      return {
        title: "Property - MJ Properties",
        description: "Premium property in Dubai",
      }
    }

    const { 
      title, 
      description, 
      price, 
      property_type, 
      location, 
      bedrooms, 
      bathrooms, 
      area_value, 
      area_unit,
      status,
      images
    } = property

    // Format price
    const formattedPrice = new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
    }).format(price)

    // Build SEO-friendly title
    const seoTitle = `${title} - ${property_type} in ${location} | ${formattedPrice} | MJ Properties`
    
    // Build rich description
    const seoDescription = description 
      ? `${description.substring(0, 120)}... ${bedrooms} bed, ${bathrooms} bath ${property_type.toLowerCase()} in ${location}. ${status.toLowerCase()} - Contact MJ Properties for viewing.`
      : `${bedrooms} bedroom, ${bathrooms} bathroom ${property_type.toLowerCase()} for ${status === 'rent' ? 'rent' : 'sale'} in ${location}. ${area_value} ${area_unit}. ${formattedPrice}. Premium property by MJ Properties.`

    // Build keywords
    const keywords = [
      property_type,
      location,
      `${bedrooms} bedroom`,
      `${bathrooms} bathroom`,
      status === 'rent' ? 'rent Dubai' : 'buy Dubai',
      'real estate Dubai',
      'MJ Properties',
      property_type === 'Apartment' ? 'apartment Dubai' : property_type.toLowerCase() + ' Dubai',
      formattedPrice,
      location.split(',')[0] // First part of location
    ].filter(Boolean)

    const canonicalUrl = `https://www.mjproperties.com/properties/${id}`
    const mainImage = images && images.length > 0 
      ? images[0].image_url 
      : '/placeholder-property.jpg'

    return {
      title: seoTitle,
      description: seoDescription,
      keywords: keywords.join(', '),
      authors: [{ name: "MJ Properties" }],
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        url: canonicalUrl,
        siteName: "MJ Properties",
        locale: "en_US",
        type: "website",
        images: [
          {
            url: mainImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: seoTitle,
        description: seoDescription.substring(0, 200),
        images: [mainImage],
      },
      other: {
        'property:type': property_type,
        'property:price': formattedPrice,
        'property:location': location,
        'property:bedrooms': bedrooms?.toString(),
        'property:bathrooms': bathrooms?.toString(),
      }
    }
  } catch (error) {
    console.error("Error generating property metadata:", error)
    return {
      title: "Property - MJ Properties",
      description: "Premium property in Dubai",
    }
  }
}

export interface PropertyContact {
    id: string
    title: string
    price: number
}

export const generatePropertyContactData = async ( property: Property): Promise<PropertyContact> => {

    return {
        id: property.id,
        title: property.title,
        price: property.price,
    }
}