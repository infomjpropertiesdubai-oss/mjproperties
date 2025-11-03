import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero/intro skeleton */}
        <section className="py-16 bg-mj-dark">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="h-10 md:h-12 w-2/3 mx-auto bg-mj-gold/20 animate-pulse rounded mb-4" />
              <div className="h-5 w-1/2 mx-auto bg-mj-gold/20 animate-pulse rounded" />
            </div>
          </div>
        </section>

        {/* Content skeleton blocks */}
        <section className="py-12 bg-mj-dark">
          <div className="container mx-auto px-4 space-y-6">
            <div className="h-32 bg-mj-gold/20 animate-pulse rounded" />
            <div className="h-32 bg-mj-gold/20 animate-pulse rounded" />
            <div className="h-32 bg-mj-gold/20 animate-pulse rounded" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}


