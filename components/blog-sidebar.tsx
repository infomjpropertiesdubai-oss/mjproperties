"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, X } from "lucide-react"
import { useSearch } from "@/lib/search-context"
import { useState, useEffect, useCallback } from "react"

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

export function BlogSidebar() {
  const { searchQuery, setSearchQuery, performSearch, isLoading, clearSearch, hasSearched } = useSearch()
  const [localQuery, setLocalQuery] = useState('')

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localQuery !== searchQuery) {
        setSearchQuery(localQuery)
        performSearch(localQuery)
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [localQuery, searchQuery, setSearchQuery, performSearch])

  const handleSearch = useCallback(() => {
    setSearchQuery(localQuery)
    performSearch(localQuery)
  }, [localQuery, setSearchQuery, performSearch])

  const handleClearSearch = useCallback(() => {
    setLocalQuery('')
    clearSearch()
  }, [clearSearch])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }, [handleSearch])

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card className="border-mj-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-mj-gold" />
            Search Articles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input 
                placeholder="Search blog posts..." 
                className="border-mj-gold/20" 
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button 
                className="bg-mj-gold text-mj-teal hover:bg-mj-gold/90"
                onClick={handleSearch}
                disabled={isLoading}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {hasSearched && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {isLoading ? 'Searching...' : `${searchQuery ? 'Search results' : 'All articles'}`}
                </span>
                {searchQuery && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClearSearch}
                    className="text-muted-foreground hover:text-foreground p-1 h-auto"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
            
            {/* Search suggestions */}
            {!hasSearched && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Popular searches:</p>
                <div className="flex flex-wrap gap-1">
                  {['Dubai Real Estate', 'Investment Guide', 'Market Analysis', 'Luxury Properties'].map((term) => (
                    <Button
                      key={term}
                      variant="ghost"
                      size="sm"
                      className="text-xs h-6 px-2 text-muted-foreground hover:text-mj-gold hover:bg-mj-gold/10"
                      onClick={() => {
                        setLocalQuery(term)
                        setSearchQuery(term)
                        performSearch(term)
                      }}
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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