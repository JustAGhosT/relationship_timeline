"use client"

import type { BlogPost } from "@/lib/blog-types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash, Calendar, User } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"

interface BlogPostProps {
  post: BlogPost
  onEdit: (post: BlogPost) => void
  onDelete: (postId: string) => void
}

export default function BlogPostCard({ post, onEdit, onDelete }: BlogPostProps) {
  const { isLoggedIn } = useAuth()
  
  // Format the date nicely
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <Card className="h-full flex flex-col overflow-hidden card-hover border border-border">
      <div className="relative w-full h-48 overflow-hidden bg-muted">
        <Image 
          src={post.imageUrl || "/placeholder.svg?height=300&width=600"} 
          alt={post.title} 
          fill 
          className="object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=300&width=600"
          }}
        />
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="blog-post-title">{post.title}</h3>
        <div className="flex items-center text-sm text-muted-foreground gap-4">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        <p className="text-muted-foreground line-clamp-4">{post.content}</p>
      </CardContent>
      
      {isLoggedIn && (
        <CardFooter className="border-t pt-4 flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(post)} 
            className="gap-1 hover:bg-secondary"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(post.id)}
            className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash className="h-4 w-4" />
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}