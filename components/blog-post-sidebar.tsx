import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
import { memo } from "react"

const categories = [
  { name: "Market Analysis", count: 12 },
  { name: "Investment Guide", count: 8 },
  { name: "Location Guide", count: 6 },
  { name: "Buyer's Guide", count: 10 },
  { name: "Sustainability", count: 4 },
  { name: "Legal Advice", count: 7 },
]

const popularPosts = [
  {
    id: 1,
    title: "Dubai Real Estate Market Outlook 2024",
    date: "Jan 15, 2024",
  },
  {
    id: 5,
    title: "Complete Guide to Buying Property as an Expat",
    date: "Jan 5, 2024",
  },
  {
    id: 2,
    title: "Top 5 Luxury Neighborhoods in Dubai",
    date: "Jan 12, 2024",
  },
]

const tags = [
  "Dubai Real Estate",
  "Property Investment",
  "Luxury Properties",
  "Off-Plan",
  "ROI",
  "Market Trends",
  "Expat Guide",
  "Downtown Dubai",
  "Dubai Marina",
  "Business Bay",
]

const BlogPostSidebarComponent = function BlogPostSidebar() {
  return (
    <div className="space-y-6">
      {/* Categories */}
      {/* <Card className="border-mj-gold/20">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.name}
                className="flex justify-between items-center py-2 border-b border-mj-gold/10 last:border-b-0"
              >
                <span className="text-sm hover:text-mj-gold cursor-pointer transition-colors">{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Popular Posts */}
      {/* <Card className="border-mj-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-mj-gold" />
            Popular Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularPosts.map((post) => (
              <div key={post.id} className="space-y-2">
                <h4 className="text-sm font-medium hover:text-mj-gold cursor-pointer transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-xs text-muted-foreground">{post.date}</p>
                {post.id !== popularPosts[popularPosts.length - 1].id && (
                  <div className="border-b border-mj-gold/10 pb-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Tags */}
      {/* <Card className="border-mj-gold/20">
        <CardHeader>
          <CardTitle>Popular Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer hover:bg-mj-gold/10 hover:border-mj-gold/40 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Newsletter */}
      <Card className="border-mj-gold/20">
        <CardHeader>
          <CardTitle>Stay Updated</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Subscribe to our newsletter for the latest real estate insights and market updates.
          </p>
          <div className="space-y-2">
            <Input placeholder="Your email address" className="border-mj-gold/20" />
            <Button className="w-full bg-mj-gold text-mj-teal hover:bg-mj-gold/90">Subscribe</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const BlogPostSidebar = memo(BlogPostSidebarComponent)
export default BlogPostSidebar
