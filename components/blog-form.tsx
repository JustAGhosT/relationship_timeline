"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { BlogPost } from "@/lib/blog-types"

interface BlogFormProps {
  initialData?: BlogPost
  onSubmit: (post: BlogPost) => void
  onCancel: () => void
}

export default function BlogForm({ initialData, onSubmit, onCancel }: BlogFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "/placeholder.svg?height=300&width=600")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const post: BlogPost = {
      id: initialData?.id || Date.now().toString(),
      title,
      content,
      date: initialData?.date || new Date().toISOString().split("T")[0],
      author: initialData?.author || "Admin",
      imageUrl,
    }

    onSubmit(post)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter post content"
          rows={6}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image URL (Optional)</Label>
        <Input
          id="image"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter image URL"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Update Post" : "Add Post"}</Button>
      </div>
    </form>
  )
}

