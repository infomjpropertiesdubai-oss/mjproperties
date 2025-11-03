"use client"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight, Clock } from "lucide-react"
import { Blog } from "@/lib/blogs"
import { highlightSearchTerm, extractTextFromTiptap } from "@/lib/search-utils"

interface BlogCardProps {
  post: Blog
  hasSearched?: boolean
  searchQuery?: string
}

export function BlogCard({ post, hasSearched = false, searchQuery = "" }: BlogCardProps) {
  const titleEncoded = post.title.replace(/\s+/g, '-')
  return (
      <Link
        href={`/blog/${post.id || ""}?title=${titleEncoded}`}
        onClick={() => {
        }}
        className={`block rounded-2xl overflow-hidden h-full pt-0 group border border-mj-gold/30 hover:border-mj-gold hover:shadow-lg hover:shadow-mj-gold/20 transition-colors cursor-pointer ${
          post.featured_image_url ? "ring-1 ring-mj-gold/20" : ""
        }`}
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-[40%] h-64  overflow-hidden">
            <img
              src={post.featured_image_url || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* {post.featured_image_url && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-mj-gold text-mj-teal">Featured</Badge>
              </div>
            )} */}
          </div>

          <div className="md:w-2/3 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Badge variant="outline">{post.category || "No category"}</Badge>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.published_at || "").toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.read_time || "No read time"}
                </div>
              </div>

              <div>
                <h3 
                  className="text-xl font-semibold mb-2 group-hover:text-mj-gold transition-colors line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: hasSearched && searchQuery 
                      ? highlightSearchTerm(post.title, searchQuery)
                      : post.title
                  }}
                />
                <p 
                  className="text-muted-foreground leading-relaxed line-clamp-1"
                  dangerouslySetInnerHTML={{
                    __html: (() => {
                      const previewText = typeof post.body === 'string'
                        ? post.body.replace(/<[^>]+>/g, ' ').slice(0, 200)
                        : extractTextFromTiptap(post.body).slice(0, 200)
                      return hasSearched && searchQuery
                        ? highlightSearchTerm(previewText, searchQuery)
                        : previewText
                    })()
                  }}
                />
              </div>

              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-mj-gold" />
                <span>By {post.author_name || "No author"}</span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-mj-gold/20">
            <div className="flex items-center text-mj-gold cursor-pointer hover:underline">
              Go to blog post
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
              {/* <Button variant="ghost" className="p-0 h-auto text-mj-gold hover:text-mj-gold/80 cursor-pointer">
                Go to blog post
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button> */}
            </div>
          </div>
        </div>
      </Link>
 
  )
}
