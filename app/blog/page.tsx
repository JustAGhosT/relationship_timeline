"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PlusCircle, RefreshCw } from "lucide-react"
import BlogPostCard from "@/components/blog-post"
import BlogForm from "@/components/blog-form"
import type { BlogPost } from "@/lib/blog-types"
import { getBlogPosts, saveBlogPost, deleteBlogPost } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

export default function BlogPage() {
  const { isLoggedIn } = useAuth()
  const { toast } = useToast()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Load posts from Supabase
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true)
      try {
        const data = await getBlogPosts()
        setPosts(data)
      } catch (error) {
        console.error("Error loading blog posts:", error)
        toast({
          title: "Error",
          description: "Failed to load blog posts",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [toast])

  const handleAddPost = async (post: BlogPost) => {
    try {
      const savedPost = await saveBlogPost(post)

      if (!savedPost) {
        toast({
          title: "Error",
          description: "Failed to save blog post",
          variant: "destructive",
        })
        return
      }

      setPosts([savedPost, ...posts.filter((p) => p.id !== savedPost.id)])
      setShowAddForm(false)

      toast({
        title: "Success",
        description: "Blog post added successfully",
      })
    } catch (error) {
      console.error("Error adding blog post:", error)
      toast({
        title: "Error",
        description: "Failed to add blog post",
        variant: "destructive",
      })
    }
  }

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post)
  }

  const handleUpdatePost = async (updatedPost: BlogPost) => {
    try {
      const savedPost = await saveBlogPost(updatedPost)

      if (!savedPost) {
        toast({
          title: "Error",
          description: "Failed to update blog post",
          variant: "destructive",
        })
        return
      }

      setPosts(posts.map((p) => (p.id === savedPost.id ? savedPost : p)))
      setEditingPost(null)

      toast({
        title: "Success",
        description: "Blog post updated successfully",
      })
    } catch (error) {
      console.error("Error updating blog post:", error)
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      })
    }
  }

  const handleDeletePost = (postId: string) => {
    setPostToDelete(postId)
  }

  const confirmDeletePost = async () => {
    if (postToDelete) {
      try {
        const success = await deleteBlogPost(postToDelete)

        if (!success) {
          toast({
            title: "Error",
            description: "Failed to delete blog post",
            variant: "destructive",
          })
          return
        }

        setPosts(posts.filter((p) => p.id !== postToDelete))
        setPostToDelete(null)

        toast({
          title: "Success",
          description: "Blog post deleted successfully",
        })
      } catch (error) {
        console.error("Error deleting blog post:", error)
        toast({
          title: "Error",
          description: "Failed to delete blog post",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Elon Musk Blog</h1>
        {isLoggedIn && (
          <Button onClick={() => setShowAddForm(true)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Post
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No blog posts yet. {isLoggedIn && "Click 'Add Post' to create one."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} onEdit={handleEditPost} onDelete={handleDeletePost} />
          ))}
        </div>
      )}

      {/* Add Post Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Blog Post</DialogTitle>
          </DialogHeader>
          <BlogForm onSubmit={handleAddPost} onCancel={() => setShowAddForm(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          {editingPost && (
            <BlogForm initialData={editingPost} onSubmit={handleUpdatePost} onCancel={() => setEditingPost(null)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this blog post. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePost} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

