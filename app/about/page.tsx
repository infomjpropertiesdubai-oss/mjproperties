import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AboutHero } from "@/components/about-hero"
import { AboutStory } from "@/components/about-story"
import { ServicesSection } from "@/components/services-section"

export const metadata = {
  title: "About Us - MJ Properties | Leading Real Estate Agency in Dubai",
  description:
    "Learn about MJ Properties, Dubai's premier real estate agency. Discover our story, values, and commitment to exceptional service in luxury property sales.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <AboutHero />
        <AboutStory />
        <ServicesSection />
      </main>
      <Footer />
    </div>
  )
}
