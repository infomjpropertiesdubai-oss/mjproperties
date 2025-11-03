"use client"
import { TeamMemberCard } from "@/components/team-member-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useEffect, useCallback, useMemo } from "react"

export function TeamMembers() {
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTeamMembers = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/team-members?active=true&limit=50&offset=0")
      const data = await response.json()
      setTeamMembers(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch team members'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTeamMembers()
  }, [fetchTeamMembers])

  const skeletonCards = useMemo(() => {
    return Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="w-[370px] h-[500px] border border-mj-gold/30 hover:border-mj-gold hover:shadow-lg hover:shadow-mj-gold/20 transition-all duration-300 cursor-pointer group rounded-2xl overflow-hidden">
        <div className="relative h-full flex flex-col">
          {/* Image Section Skeleton */}
          <div className="relative w-full h-80 overflow-hidden">
            <Skeleton className="w-full h-full" />
            {/* Gradient overlay skeleton */}
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" /> */}
          </div>
          
          {/* Content Section Skeleton */}
          <div className="flex-1 p-4 space-y-3 bg-mj-dark">
            {/* Name and Title */}
            <div className="text-center space-y-1">
              <Skeleton className="h-6 w-32 mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
            
            {/* Quick Stats - Compact */}
            <div className="flex justify-center gap-4 py-2 border-t border-mj-gold/20">
              <div className="flex flex-col justify-center items-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-3 w-6" />
                </div>
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="flex flex-col justify-center items-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-3 w-6" />
                </div>
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="flex flex-col justify-center items-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-3 w-6" />
                </div>
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            
            {/* Social Links - Compact */}
            <div className="flex justify-center gap-3 mt-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    ))
  }, [])

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {skeletonCards}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error.message}</p>
              <button 
                onClick={fetchTeamMembers}
                className="bg-mj-gold text-mj-teal px-4 py-2 rounded-md hover:bg-mj-gold/80 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-6">
          {teamMembers.map((member: any) => (
            <TeamMemberCard
              key={member.id}
              slug={member.slug}
              name={member.name}
              title={member.title}
              image={member.image_url || ""}
              facebook={member.facebook_url || ""}
              linkedin={member.linkedin_url || ""}
              twitter={member.twitter_url || ""}
              instagram={member.instagram_url || ""}
              tiktok={member.tiktok_url || ""}
              whatsapp={member.whatsapp_url ? `https://wa.me/${member.whatsapp_url.replace(/[^\d]/g, '')}` : ""}
              social_media_links={member.social_media_links}
              propertiesSold={member.statistics?.properties_sold ?? member.properties_sold}
              satisfiedClients={member.statistics?.satisfied_clients ?? member.satisfied_clients}
              yearsExperience={member.statistics?.experience ?? member.years_experience}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
