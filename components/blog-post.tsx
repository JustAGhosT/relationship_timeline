"use client"

import type { BlogPost } from "@/lib/blog-types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"

interface BlogPostProps {
  post: BlogPost
  onEdit: (post: BlogPost) => void
  onDelete: (postId: string) => void
}

export default function BlogPostCard({ post, onEdit, onDelete }: BlogPostProps) {
  const { isLoggedIn } = useAuth()

  return (
    <Card className="h-full flex flex-col">
      {post.imageUrl && (
        <div className="relative w-full h-48 overflow-hidden">
          <Image src={post.imageUrl || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>
      )}
      <CardHeader className="pb-2">
        <h3 className="text-xl font-bold">{post.title}</h3>
        <div className="text-sm text-muted-foreground">
          {post.author} • {new Date(post.date).toLocaleDateString()}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground">{post.content}</p>
      </CardContent>
      {isLoggedIn && (
        <CardFooter className="border-t pt-4 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(post)} className="gap-1">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(post.id)}
            className="gap-1 text-destructive hover:text-destructive"
          >
            <Trash className="h-4 w-4" />
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

