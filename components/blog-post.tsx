"use client"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User, Clock, Share2, Heart, MessageCircle } from "lucide-react"
import { memo, useState } from "react"
import { ShareModal } from "./share-modal"

interface BlogPostProps {
  post: {
    id: string
    title: string
    body: any // Tiptap JSON format
    featured_image_url?: string
    featured_image_public_id?: string
    category?: string
    author_name?: string
    published_at?: string
    read_time?: number
    tags?: string[]
    view_count?: number
    like_count?: number
    author_profile_link?: string
    author_image_url?: string
    author_image_public_id?: string
    status?: 'draft' | 'published' | 'archived'
  }
}

const BlogPostComponent = function BlogPost({ post }: BlogPostProps) {
  // Support both HTML string and legacy Tiptap JSON
  const htmlContent = typeof post?.body === 'string' ? (post.body as string) : ""
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const shareData = {
    title: post?.title,
    text: `${post?.category} - ${post?.title}`,
    url: `${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${post?.id}`
  }

  return (
    <article className="space-y-8">
      {/* Post Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {post?.category && <Badge variant="outline">{post.category}</Badge>}
          {post?.published_at && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post?.published_at).toLocaleDateString()}
            </div>
          )}
          {post?.read_time && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post?.read_time} min read
            </div>
          )}
          {post?.view_count && (
            <div className="flex items-center gap-1">
              <span>{post?.view_count} views</span>
            </div>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-balance">{post?.title}</h1>

        <div className="flex items-center justify-between">
          {post?.author_name && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-mj-gold" />
              <span>By {post?.author_name}</span>
            </div>
          )}

          <div className="flex items-center gap-2">         
            <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => setIsShareModalOpen(true)}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post?.featured_image_url && post?.featured_image_url.trim() !== "" && (
        <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg">
          <Image src={post?.featured_image_url as string} alt={post?.title as string} fill className="object-cover" />
        </div>
      )}

      {/* Post Content */}
      <div
          className="blog-content"
          style={{
            // Fix Quill bullet lists
            counterReset: "list-counter",
          }}
          dangerouslySetInnerHTML={{
            __html: htmlContent.replace(
              /<span class="ql-ui"[^>]*><\/span>/g,
              ""
            ),
          }}
        />


      {/* Tags */}
      {post?.tags && post?.tags.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post?.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="hover:bg-mj-gold/10 hover:border-mj-gold/40 cursor-pointer">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Author Bio */}
      {post?.author_name && (
        <Card className="border-mj-gold/20 pt-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {post?.author_image_url && post?.author_image_url.trim() !== "" ? (
                <div className="relative w-16 h-16 overflow-hidden rounded-full">
                  <Image src={post?.author_image_url as string} alt={post?.author_name as string} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-mj-gold/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-mj-gold" />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{post?.author_name}</h4>
                <p className="text-muted-foreground text-sm mb-3">Property Consultant at MJ Properties</p>
                <p className="text-sm leading-relaxed">
                  Experienced real estate professional specializing in Dubai's luxury property market.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments Section */}
      {/* <Card className="border-mj-gold/20 pt-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-5 w-5 text-mj-gold" />
            <h3 className="text-lg font-semibold">Comments</h3>
          </div>
          <p className="text-muted-foreground text-center py-8">
            Comments are coming soon. For now, feel free to contact us directly with your thoughts and questions.
          </p>
        </CardContent>
      </Card> */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareData={{
          title: post?.title,
          text: `${post?.category} - ${post?.title}`,
          url: `${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${post?.id}`
        }}
      />
    </article>
    
    
  )
}

// Memoize the component to prevent unnecessary re-renders
const BlogPost = memo(BlogPostComponent)

export { BlogPost }