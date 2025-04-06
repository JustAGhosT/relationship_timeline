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
  const [submitting, setSubmitting] = useState(false)

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
    setSubmitting(true)
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

      // Update posts state with the new post
      setPosts((prevPosts) => [savedPost, ...prevPosts.filter((p) => p.id !== savedPost.id)])
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
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post)
  }

  const handleUpdatePost = async (updatedPost: BlogPost) => {
    setSubmitting(true)
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

      setPosts((prevPosts) => prevPosts.map((p) => (p.id === savedPost.id ? savedPost : p)))
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
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeletePost = (postId: string) => {
    setPostToDelete(postId)
  }

  const confirmDeletePost = async () => {
    if (postToDelete) {
      setSubmitting(true)
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

        setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postToDelete))
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
      } finally {
        setSubmitting(false)
      }
    }
  }

  // Function to handle dialog open state changes with submitting check
  const handleAddDialogChange = (open: boolean) => {
    if (!submitting && !open) {
      setShowAddForm(false);
    } else if (open) {
      setShowAddForm(true);
    }
  };

  // Function to handle edit dialog open state changes with submitting check
  const handleEditDialogChange = (open: boolean) => {
    if (!submitting && !open) {
      setEditingPost(null);
    }
  };

  // Function to handle delete dialog open state changes with submitting check
  const handleDeleteDialogChange = (open: boolean) => {
    if (!submitting && !open) {
      setPostToDelete(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="gradient-title">Elon Musk Blog</h1>
        {isLoggedIn && (
          <Button onClick={() => setShowAddForm(true)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Post
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 loading-spinner" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg p-8 border border-border">
          <p className="text-lg">No blog posts yet.</p>
          {isLoggedIn && (
            <p className="mt-2">
              Click <span className="text-primary font-medium">'Add Post'</span> to create one.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} onEdit={handleEditPost} onDelete={handleDeletePost} />
          ))}
        </div>
      )}

      {/* Add Post Dialog - Fixed to prevent closing during submission */}
      <Dialog open={showAddForm} onOpenChange={handleAddDialogChange}>
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle className="dialog-title">Add New Blog Post</DialogTitle>
          </DialogHeader>
          <BlogForm 
            onSubmit={handleAddPost} 
            onCancel={() => !submitting && setShowAddForm(false)} 
            isSubmitting={submitting} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Post Dialog - Fixed to prevent closing during submission */}
      <Dialog open={!!editingPost} onOpenChange={handleEditDialogChange}>
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle className="dialog-title">Edit Blog Post</DialogTitle>
          </DialogHeader>
          {editingPost && (
            <BlogForm 
              initialData={editingPost} 
              onSubmit={handleUpdatePost} 
              onCancel={() => !submitting && setEditingPost(null)} 
              isSubmitting={submitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog - Fixed to prevent closing during submission */}
      <AlertDialog open={!!postToDelete} onOpenChange={handleDeleteDialogChange}>
        <AlertDialogContent className="dialog-content">
          <AlertDialogHeader>
            <AlertDialogTitle className="dialog-title">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="dialog-description">
              This will permanently delete this blog post. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeletePost} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={submitting}
            >
              {submitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}