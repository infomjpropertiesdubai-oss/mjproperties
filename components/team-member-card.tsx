'use client'
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaStar, FaHome, FaUsers, FaTiktok, FaWhatsapp, FaYoutube, FaTelegram, FaPinterest, FaImage } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";

interface SocialLink {
    id?: string;
    platform: string;
    url: string;
}

interface TeamMemberCardProps {
    name: string;
    slug: string;
    title: string;
    image: string;
    facebook: string;
    linkedin: string;
    twitter: string;
    instagram: string;
    tiktok?: string;
    whatsapp?: string; // wa.me full URL or tel
    social_media_links?: SocialLink[]; // Dynamic social media links
    // Optional statistics
    propertiesSold?: number;
    satisfiedClients?: number;
    yearsExperience?: number;
}

// Social media platform icon mapping
const socialMediaIcons: Record<string, any> = {
    'facebook': FaFacebookF,
    'linkedin': FaLinkedinIn,
    'twitter': FaTwitter,
    'instagram': FaInstagram,
    'youtube': FaYoutube,
    'tiktok': FaTiktok,
    'whatsapp': FaWhatsapp,
    'telegram': FaTelegram,
    'pinterest': FaPinterest
}

// Get icon for a platform
const getIcon = (platform: string) => {
    return socialMediaIcons[platform.toLowerCase()]
}

export function TeamMemberCard(
    { name, slug, title, image, facebook, linkedin, twitter, instagram, tiktok, whatsapp, social_media_links, propertiesSold, satisfiedClients, yearsExperience }: TeamMemberCardProps) {
    
    const [imageError, setImageError] = useState(false);
    
    // Get all social media links (use social_media_links if available, otherwise fall back to individual fields)
    const allSocialLinks: SocialLink[] = social_media_links && social_media_links.length > 0 
        ? social_media_links 
        : [
            ...(facebook ? [{ id: 'facebook', platform: 'facebook', url: facebook }] : []),
            ...(linkedin ? [{ id: 'linkedin', platform: 'linkedin', url: linkedin }] : []),
            ...(twitter ? [{ id: 'twitter', platform: 'twitter', url: twitter }] : []),
            ...(instagram ? [{ id: 'instagram', platform: 'instagram', url: instagram }] : []),
            ...(tiktok ? [{ id: 'tiktok', platform: 'tiktok', url: tiktok }] : []),
            ...(whatsapp ? [{ id: 'whatsapp', platform: 'whatsapp', url: whatsapp }] : [])
        ]
    
    return (
        <Link href={`/team/${slug}`}>
        <div className="w-[370px] h-[500px] border border-mj-gold/30 hover:border-mj-gold hover:shadow-lg hover:shadow-mj-gold/20 transition-all duration-300 cursor-pointer group rounded-2xl overflow-hidden">
            <div className="relative h-full flex flex-col">
                {/* Image Section - Increased height */}
                <div className="relative w-full h-80 overflow-hidden">
                    {image && image.trim() && !imageError ? (
                        <Image
                            src={image}
                            alt={name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 370px"
                            onError={() => setImageError(true)}
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-mj-gold/30 via-mj-gold/20 to-mj-gold/10 flex flex-col items-center justify-center gap-3">
                            <FaImage className="text-6xl text-mj-gold/60" />
                            <p className="text-mj-gold/70 text-sm font-medium">No Image</p>
                        </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Content Section - Minimized */}
                <div className="flex-1 p-4 space-y-3 bg-mj-dark">
                    {/* Name and Title */}
                    <div className="text-center space-y-1">
                        <h3 className="text-lg font-bold text-mj-white group-hover:text-mj-gold transition-colors duration-300">
                            {name}
                        </h3>
                        <p className="text-mj-gold font-semibold text-sm">
                            {title}
                        </p>
                    </div>

                    {/* Quick Stats - Compact */}
                    <div className="flex justify-center gap-4 py-2 border-t border-mj-gold/20">
                      
                        <div className="flex flex-col justify-center items-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <FaHome className="text-mj-gold text-xs" />
                                <span className="text-mj-white font-semibold text-xs">{propertiesSold || "10+" }</span>
                            </div>
                            <p className="text-mj-gold/70 text-xs">Properties</p>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <FaUsers className="text-mj-gold text-xs" />
                                <span className="text-mj-white font-semibold text-xs">{satisfiedClients ||" 10+" }</span>
                            </div>
                            <p className="text-mj-gold/70 text-xs">Clients</p>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <FaStar className="text-mj-gold text-xs" />
                                <span className="text-mj-white font-semibold text-xs">{yearsExperience || "2+" }</span>
                            </div>
                            <p className="text-mj-gold/70 text-xs">Years</p>
                        </div>
                    </div>

                    {/* Social Links - Compact (conditionally rendered) */}
                    {allSocialLinks.length > 0 && (
                        <div className="flex justify-center gap-2 flex-wrap">
                            {allSocialLinks.map((link) => {
                                const Icon = getIcon(link.platform)
                                if (!Icon) return null

                                // Format WhatsApp URL if needed
                                let url = link.url
                                if (link.platform.toLowerCase() === 'whatsapp') {
                                    // If URL doesn't start with http/https, assume it's a phone number
                                    if (!url.startsWith('http')) {
                                        // Remove any non-numeric characters
                                        const phone = url.replace(/\D/g, '')
                                        url = `https://wa.me/${phone}`
                                    }
                                }

                                return (
                                    <div
                                        key={link.id || link.platform}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            window.open(url, '_blank')
                                        }}
                                        className="p-1.5 bg-mj-gold/20 rounded-lg hover:bg-mj-gold/30 transition-colors duration-300 cursor-pointer"
                                    >
                                        <Icon className="text-mj-gold text-xs" />
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
        </Link>
    )
}