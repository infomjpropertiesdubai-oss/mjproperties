"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Award, Users, Building2, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
export function AboutHero() {
  const router = useRouter();
  return (
    <section className="relative  py-6 md:py-10 lg:py-20 flex items-center bg-gradient-to-br from-mj-teal via-mj-teal-light to-mj-dark overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <Image 
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Dubai Skyline" 
          fill 
          className="object-cover opacity-15" 
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-mj-teal/90 via-mj-teal-light/80 to-mj-dark/90" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-mj-gold/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-mj-gold/10 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-mj-gold/15 rounded-full blur-lg animate-pulse delay-500" />

      <div className="relative container mx-auto px-4 lg:py-20 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-mj-white leading-tight">
                About <span className="">MJ Properties</span>
              </h1>
              
              <p className="text-xl text-mj-gold max-w-2xl leading-relaxed">
                We specialize in connecting discerning clients with exceptional properties in Dubai's most prestigious
                locations. Our commitment to excellence and personalized service has made us a leading name in luxury real
                estate.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-mj-gold hover:bg-mj-gold-light text-mj-teal font-semibold shadow-lg group"
                onClick={() => {
                  const storySection = document.getElementById('our-story');
                  if (storySection) {
                    storySection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Explore Our Story
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-mj-gold/40 text-mj-gold hover:bg-mj-gold/10 bg-transparent"
              onClick={() => {
               router.push('/team');
              }}
              >
                Meet Our Team
              </Button>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative hidden lg:block">
            <div className="relative h-[600px] w-full rounded-2xl overflow-hidden">
              <Image
                src="/images/about-hero.avif"
                alt="About Hero"
                fill
                className="object-cover "
                priority
                sizes="(max-width: 1024px) 0vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-mj-dark/70 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
