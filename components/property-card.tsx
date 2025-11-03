"use client";

import Image from "next/image";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart, FaShareAlt, FaEye, FaImage } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import { ShareModal } from "./share-modal";
import { toast } from "@/hooks/use-toast";

interface PropertyCardProps {
    id: string;
    title: string;
    location: string;
    price: string;
    pricePerSqft?: string;
    bedrooms: number;
    bathrooms: number;
    area: string;
    image: string;
    type: string;
    status: string;
    featured?: boolean;
    priority?: boolean;
}

export function PropertyCard({
    id,
    title,
    location,
    price,
    pricePerSqft,
    bedrooms,
    bathrooms,
    area,
    image,
    type,
    status,
    featured = false,
    priority = false
}: PropertyCardProps) {
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    
    const propertyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/properties/${id}`;
    

    const shareData = {
        title: title,
        text: `${type} in ${location} - ${price} | ${bedrooms} bed, ${bathrooms} bath, ${area} sqft`,
        url: propertyUrl
    };

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsShareModalOpen(true);
    };
    return (
        <Link href={`/properties/${id}`}>
            <div className="max-w-[570px] border border-mj-gold/30 hover:border-mj-gold hover:shadow-lg hover:shadow-mj-gold/20 transition-all duration-300 cursor-pointer group rounded-2xl overflow-hidden bg-mj-teal-dark/80">
                <div className="relative">
                    {/* Image Section */}
                    <div className="relative w-full h-52 overflow-hidden">
                        {image && image.trim() && !imageError ? (
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            priority={priority}
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            onError={() => setImageError(true)}
                          />
                        ) : (
                          <div className="w-full h-52 bg-gradient-to-br from-mj-gold/30 via-mj-gold/20 to-mj-gold/10 flex flex-col items-center justify-center gap-3">
                            <FaImage className="text-5xl text-mj-gold/60" />
                            <p className="text-mj-gold/70 text-sm font-medium">No Image Available</p>
                          </div>
                        )}
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        
                        {/* Status Badge */}
                        <div className="absolute top-4 left-4">
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                status === 'For Sale' 
                                    ? 'bg-mj-gold text-mj-teal' 
                                    : status === 'For Rent'
                                    ? 'bg-mj-teal text-mj-gold'
                                    : 'bg-mj-dark text-mj-gold'
                            }`}>
                                {status}
                            </div>
                        </div>

                        {/* Featured Badge */}
                        {featured && (
                            <div className="absolute top-4 right-4 bg-mj-gold/90 backdrop-blur-sm rounded-full px-3 py-1">
                                <div className="flex items-center gap-1 text-mj-teal text-xs font-semibold">
                                    <FaHeart className="text-xs" />
                                    <span>Featured</span>
                                </div>
                            </div>
                        )}

                        {/* Property Type */}
                        <div className="absolute bottom-4 left-4">
                            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                                <span className="text-mj-gold text-xs font-medium">{type}</span>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="absolute bottom-4 right-4 flex gap-2">
                            <button 
                                className="p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-mj-gold/20 transition-colors duration-300 cursor-pointer"
                                onClick={handleShare}
                                title="Share property"
                            >
                                <FaShareAlt className="text-mj-gold text-sm" />
                            </button>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-4">
                        {/* Title and Location */}
                        <div className="space-y-2">
                            <h3 className="text-base lg:text-lg xl:text-xl font-bold text-mj-white group-hover:text-mj-gold transition-colors duration-300 line-clamp-1">
                                {title}
                            </h3>
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-mj-gold text-sm" />
                                <p className="text-mj-gold/80 text-xs lg:text-sm">
                                    {location}
                                </p>
                            </div>
                        </div>

                        {/* Price Section */}
                        <div className="space-y-1">
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl lg:text-2xl font-bold text-mj-gold">
                                    {price}
                                </span>
                                {pricePerSqft && (
                                    <span className="text-mj-gold/70 text-xs">
                                        ({pricePerSqft}/sqft)
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Property Details */}
                        <div className="flex justify-between items-center py-3 border-t border-mj-gold/20">
                            <div className="flex items-center gap-1">
                                <FaBed className="text-mj-gold text-sm" />
                                <span className="text-mj-white font-semibold text-xs lg:text-sm xl:text-base">
                                    {bedrooms}
                                </span>
                                <span className="text-mj-gold/70 text-xs">Bed</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FaBath className="text-mj-gold text-sm" />
                                <span className="text-mj-white font-semibold text-xs lg:text-sm xl:text-base">
                                    {bathrooms}
                                </span>
                                <span className="text-mj-gold/70 text-xs">Bath</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FaRulerCombined className="text-mj-gold text-sm" />
                                <span className="text-mj-white font-semibold text-xs lg:text-sm xl:text-base">
                                    {area}
                                </span>
                                <span className="text-mj-gold/70 text-xs">Sqft</span>
                            </div>
                        </div>

                        {/* View Property Button */}
                        <div className="pt-2">
                            <button 
                                className="w-full bg-mj-gold/20 hover:bg-mj-gold/30 text-mj-gold font-semibold py-2 px-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // Navigate to property details
                                    window.location.href = `/properties/${id}`;
                                }}
                            >
                                <FaEye className="text-xs" />
                                <span>View Property</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Share Modal */}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                shareData={shareData}
            />
        </Link>
    )
}
