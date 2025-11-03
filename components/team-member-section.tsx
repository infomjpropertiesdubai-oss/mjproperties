"use client";
import { TeamMemberCard } from "@/components/team-member-card";
import { TeamMember, TeamMembersListResponse } from "@/lib/team-members";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useState, useEffect, useCallback, useMemo } from "react";

export function TeamMemberSection() {
  const [teamMembers, setTeamMembers] = useState<TeamMembersListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTeamMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/team-members");
      const data = await response.json();
      setTeamMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch team members'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  const memoizedTeamMembers = useMemo(() => {
    if (!teamMembers?.data) return null;
    
    return teamMembers.data
      .slice(0, 3)
      .filter((m: TeamMember) => !(m.title ?? "").toLowerCase().includes("ceo"))
      .map((member: TeamMember) => (
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
          social_media_links={member.social_media_links}
          propertiesSold={member.properties_sold}
          satisfiedClients={member.satisfied_clients}
          yearsExperience={member.years_experience}
        />
      ));
  }, [teamMembers?.data]); 
  const skeletonCards = useMemo(() => {
    return Array.from({ length: 4 }).map((_, index) => (
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
    ));
  }, []);

  if (isLoading) {
    return (
      <section className="py-4 md:py-16 bg-mj-teal flex flex-col items-center justify-center gap-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Our <span className="text-mj-gold">Professional Team</span>
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the dedicated professionals who will help you achieve your real
              estate goals
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {skeletonCards}
          </div>
          <div className="w-full flex flex-row items-center justify-center mt-8">
            <Skeleton className="h-10 w-52 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-red-500">{error.message}</p>
      </div>
    );
  }
  if (!teamMembers) {
    return null;
  }
  return (
    <section className=" py-4 md:py-16 bg-mj-teal flex flex-col items-center justify-center gap-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Our <span className="text-mj-gold">Professional Team</span>
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the dedicated professionals who will help you achieve your real
            estate goals
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {memoizedTeamMembers}
        </div>
        <div className="w-full flex flex-row items-center justify-center mt-8">
          <Link href="/team" className=" border-1 border-mj-gold/50 text-mj-gold hover:border-mj-gold font-semibold cursor-pointer px-4 py-2 rounded-md">
            View All Team Members
          </Link>
        </div>
      </div>
    </section>
  );
}
