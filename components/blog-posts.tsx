"use client"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Blog } from "@/lib/blogs"
import { useEffect, useState } from "react"
import { useSearch } from "@/lib/search-context"
import { BlogCard } from "@/components/blog-card"
import { Skeleton } from "@/components/ui/skeleton"


export function BlogPosts() {
  const [blogPosts, setBlogPosts] = useState<Blog[]>([])
  const { searchResults, isLoading, hasSearched, searchQuery } = useSearch()
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const fetchBlogPosts = async () => {
      // setIsFetching(true)
      const response = await fetch('/api/blogs')
      const data = await response.json()
      setBlogPosts(data.data)
      setIsFetching(false)
    }
    fetchBlogPosts()
  }, [])

  // Determine which posts to display
  const displayPosts = hasSearched ? searchResults : blogPosts
  const isSearching = hasSearched && isLoading

  return (
    <div className="space-y-8">
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {hasSearched ? (
            searchQuery ? (
              <>
                <Search className="inline h-6 w-6 mr-2 text-mj-gold" />
                Search Results for "{searchQuery}"
              </>
            ) : (
              "Latest Articles"
            )
          ) : (
            "Latest Articles"
          )}
        </h2>
        <p className="text-muted-foreground">
          {isSearching ? "Searching..." : `${displayPosts.length} articles found`}
        </p>
      </div>

      {isSearching || isFetching ? (
        <div className="space-y-6">
          {Array.from({ length: 1 }).map((_, i) => (
            <div key={i} className="border border-mj-gold/30 rounded-2xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <Skeleton className="md:w-[40%] h-64" />
                <div className="md:w-2/3 p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="pt-4 border-t border-mj-gold/30">
                    <Skeleton className="h-5 w-32" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : displayPosts.length === 0 && hasSearched ? (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No articles found</h3>
          <p className="text-muted-foreground">
            Try searching with different keywords or check your spelling.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {displayPosts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              hasSearched={hasSearched}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}

      {/* Pagination would go here */}
      {/* {!hasSearched && (
        <div className="flex justify-center pt-8">
          <Button variant="outline" className="border-mj-gold/40 hover:bg-mj-gold/10 bg-transparent">
            Load More Articles
          </Button>
        </div>
      )} */}
    </div>
  )
}
