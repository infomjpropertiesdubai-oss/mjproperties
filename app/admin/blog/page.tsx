"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { 
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  RefreshCw
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { format } from "date-fns"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getBlogs, deleteBlog, Blog } from "@/lib/blogs"


export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState<{ id: string; title: string; index: number } | null>(null)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeletingIndex, setIsDeletingIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const fetchBlogs = async () => {
    try {
      setIsLoading(true)
      const options = {
        search: searchTerm || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter as 'draft' | 'published' | 'archived',
        category: categoryFilter === 'all' ? undefined : categoryFilter,
      }

      const response = await getBlogs(options)
      setBlogs(response.data)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      toast.error('Failed to fetch blogs')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [searchTerm, statusFilter, categoryFilter])

  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleDeleteBlog = async (blogId: string, index: number) => {
    setIsDeleting(true)
    setIsDeletingIndex(index)
    try {
      await deleteBlog(blogId)
      toast.success('Blog post deleted successfully')
      fetchBlogs() // Refresh the list
      setDeleteDialogOpen(false)
      setBlogToDelete(null)
      setIsDeletingIndex(null)
    } catch (error) {
      console.error('Error deleting blog:', error)
      toast.error('Failed to delete blog post')
    } finally {
      setIsDeleting(false)
      setIsDeletingIndex(null)
    }
  }

  // Safe content extraction for display
  const getContentPreview = (body: any) => {
    try {
      if (body?.content && Array.isArray(body.content) && body.content[0]?.content) {
        return body.content[0].content[0]?.text || "No content preview"
      }
      return "No content preview"
    } catch {
      return "No content preview"
    }
  }

  const handleDelete = (blog: Blog, index: number) => {
    setBlogToDelete({
      id: blog.id || '',
      title: blog.title,
      index
    })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!blogToDelete) return
    handleDeleteBlog(blogToDelete.id, blogToDelete.index)
  }

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-mj-teal via-mj-teal-light to-mj-dark text-mj-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 mt-16">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-mj-gold mb-2">Blog Management</h1>
              <p className="text-mj-white/80">Manage your blog posts and content</p>
            </div>
           
          </div>
        </div>

        {/* Controls */}
        <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm shadow-lg mb-8">
          <CardContent className="">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-mj-white/60" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-mj-dark border-mj-gold/30 text-mj-white placeholder-mj-white/50 focus:border-mj-gold focus:ring-mj-gold/20"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20 cursor-pointer w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-mj-dark border-mj-gold/30">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20 cursor-pointer w-full">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-mj-dark border-mj-gold/30">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Market Analysis">Market Analysis</SelectItem>
                  <SelectItem value="Buyer Guide">Buyer Guide</SelectItem>
                  <SelectItem value="Luxury">Luxury</SelectItem>
                  <SelectItem value="Investment">Investment</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                className="w-full bg-mj-gold hover:bg-mj-gold-light text-mj-teal shadow-lg cursor-pointer "
                onClick={() => router.push("/admin/blog/add")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>
          </CardContent>
        </Card>


        {/* Blog Posts Table */}
        <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-mj-gold">All Blog Posts</CardTitle>
            <CardDescription className="text-mj-white/80">
              {blogs.length} posts found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12 gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mj-gold"></div>
                <p className="text-mj-white/80">Loading blog posts...</p>
              </div>
            ) : (
            <Table>
                <TableHeader>
                  <TableRow className="border-mj-gold/20">
                    <TableHead className="text-mj-gold">Post</TableHead>
                    <TableHead className="text-mj-gold">Category</TableHead>
                    <TableHead className="text-mj-gold">Author</TableHead>
                    <TableHead className="text-mj-gold">Status</TableHead>
                    <TableHead className="text-mj-gold">Views</TableHead>
                    <TableHead className="text-mj-gold">Date</TableHead>
                    <TableHead className="text-mj-gold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-mj-white/60">
                        No blog posts found. Try adjusting your filters or create a new post.
                      </TableCell>
                    </TableRow>
                  ) : (
                    blogs.map((post, index) => (
                      <TableRow key={post.id} className="border-mj-gold/20">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Image
                              src={post.featured_image_url || "/placeholder.svg"}
                              alt={post.title}
                              width={60}
                              height={40}
                              className="rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-semibold text-mj-white">{post.title}</p>
                              <p className="text-sm text-mj-white/60 max-w-[200px] truncate break-words overflow-hidden text-ellipsis">{getContentPreview(post.body)}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-mj-gold text-mj-gold">
                            {post.category || "No category"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-mj-white/80">{post.author_name || "No author"}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={post.status === "published" ? "default" : post.status === "draft" ? "secondary" : "destructive"}
                            className={post.status === "published" ? "bg-mj-gold text-mj-teal" : ""}
                          >
                            {post.status || "No status"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-mj-white/80">{post.view_count || 0}</TableCell>
                        <TableCell className="text-mj-white/80">
                          {post.published_at ? format(new Date(post.published_at), 'MMM dd, yyyy') : 'Not published'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-mj-gold text-mj-gold hover:bg-mj-gold hover:text-white cursor-pointer"
                              onClick={() => {
                                router.push(`/admin/blog/edit`)
                                sessionStorage.setItem('editingBlog', JSON.stringify(post))
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer"
                              onClick={() => handleDelete(post, index)}
                              disabled={isDeleting || isDeletingIndex === index}
                            >
                              {isDeletingIndex === index ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-mj-dark border-mj-gold/20">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-mj-gold">Delete Blog Post</AlertDialogTitle>
              <AlertDialogDescription className="text-mj-white/80">
                Are you sure you want to delete "{blogToDelete?.title}"? This action cannot be undone and will also remove all associated images.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                onClick={() => setDeleteDialogOpen(false)}
                className="bg-mj-teal-light border-mj-gold/30 text-mj-white hover:bg-mj-teal"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete}
                disabled={isDeleting || isDeletingIndex === blogToDelete?.index}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeletingIndex === blogToDelete?.index ? 'Deleting...' : 'Delete'}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
