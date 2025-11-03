import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"

const relatedPosts = [
  {
    id: 2,
    title: "Top 5 Luxury Neighborhoods in Dubai for High-End Property Investment",
    excerpt: "Discover the most prestigious areas in Dubai that offer exceptional returns and lifestyle benefits.",
    image: "/blog-luxury-neighborhoods-dubai.png",
    category: "Investment Guide",
    date: "2024-01-12",
  },
  {
    id: 3,
    title: "Understanding Dubai's Off-Plan Property Investment: Risks and Rewards",
    excerpt: "A comprehensive guide to off-plan property investments in Dubai, covering benefits and risks.",
    image: "/blog-off-plan-investment-dubai.png",
    category: "Investment Guide",
    date: "2024-01-10",
  },
  {
    id: 4,
    title: "Dubai Marina vs Downtown Dubai: Which Location Offers Better ROI?",
    excerpt: "Compare two of Dubai's most popular investment destinations and discover which offers better returns.",
    image: "/blog-marina-vs-downtown-dubai.png",
    category: "Location Guide",
    date: "2024-01-08",
  },
]

interface RelatedPostsProps {
  currentPostId: number
}

export function RelatedPosts({ currentPostId }: RelatedPostsProps) {
  const filteredPosts = relatedPosts.filter((post) => post.id !== currentPostId)

  return (
    <section className="py-16 bg-mj-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Related <span className="text-mj-gold">Articles</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Continue reading with these related insights and expert analysis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="group overflow-hidden border-mj-gold/20 hover:border-mj-gold/40 transition-colors"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary">{post.category}</Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-mj-gold transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                  </div>

                  <Link href={`/blog/${post.id}`}>
                    <Button variant="ghost" className="p-0 h-auto text-mj-gold hover:text-mj-gold/80">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
