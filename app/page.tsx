"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Calendar, Users, BookOpen, Github, AlertTriangle, Info, RefreshCw } from "lucide-react"
import BlogPostCard from "@/components/blog-post"
import type { BlogPost } from "@/lib/blog-types"
import { getBlogPosts, seedDatabase } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const { isLoggedIn } = useAuth()
  const { toast } = useToast()
  const [posts, setPosts] = useState<BlogPost[]>([])
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

  const handleSeedDatabase = async () => {
    try {
      setLoading(true)
      await seedDatabase()

      // Reload blog posts
      const data = await getBlogPosts()
      setPosts(data)

      toast({
        title: "Success",
        description: "Database seeded successfully",
      })
    } catch (error) {
      console.error("Error seeding database:", error)
      toast({
        title: "Error",
        description: "Failed to seed database",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 hero-section mb-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none hero-title">
                  The Complete Elon Musk Timeline
                </h1>
                <p className="max-w-[600px] hero-description md:text-xl">
                  Explore the most comprehensive interactive timeline of Elon Musk's life, career, and
                  relationships—including confirmed events, rumored connections, and speculative future developments
                  through April 2025.
                </p>
                <div className="flex items-center gap-2 mt-4 alert-warning p-3 rounded-lg border">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">
                    This timeline includes both verified facts and unconfirmed reports. Future events and some
                    relationships are speculative and included for analytical purposes.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row mt-4">
                <Link href="/timeline" passHref>
                  <Button className="gap-1">
                    Explore Timeline <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/relationship" passHref>
                  <Button variant="outline" className="gap-1">
                    View Relationships <Users className="h-4 w-4" />
                  </Button>
                </Link>
                {isLoggedIn && (
                  <Button variant="outline" onClick={handleSeedDatabase} disabled={loading} className="gap-1">
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    Seed Database
                  </Button>
                )}
              </div>
            </div>
            <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last border border-border">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Elon Musk Timeline"
                width={600}
                height={400}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Explore the Application</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="h-full">
            <CardHeader>
              <Calendar className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Timeline View</CardTitle>
              <CardDescription>Chronological view of Elon Musk's personal and professional life</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Explore key events in Elon Musk's life and career through an interactive timeline. Toggle between
                personal and career events.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/timeline" passHref>
                <Button variant="outline" className="w-full">
                  View Timeline
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Relationship Analysis</CardTitle>
              <CardDescription>Interactive visualization of Elon Musk's relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Visualize Elon Musk's relationships and children with detailed analysis of overlaps and timeline
                inconsistencies.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/relationship" passHref>
                <Button variant="outline" className="w-full">
                  View Relationships
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Blog Posts</CardTitle>
              <CardDescription>Latest news and articles about Elon Musk</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Read and manage blog posts about Elon Musk's companies, achievements, and latest news.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/blog" passHref>
                <Button variant="outline" className="w-full">
                  View Blog
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Timeline Stats Section */}
      <section className="mb-16 stats-section p-8 rounded-xl border">
        <h2 className="text-2xl font-bold text-center mb-8">Timeline Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold stats-number mb-2">7+</div>
            <div className="text-sm stats-text">Major Relationships</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold stats-number mb-2">12+</div>
            <div className="text-sm stats-text">Children</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold stats-number mb-2">30+</div>
            <div className="text-sm stats-text">Career Milestones</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold stats-number mb-2">50+</div>
            <div className="text-sm stats-text">Key Life Events</div>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2 alert-info p-3 rounded-lg border max-w-2xl">
            <Info className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              Our timeline includes both verified public information and speculative data based on reports and analysis.
              Some future events and relationships are included for analytical purposes.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Recent Blog Posts</h2>
          <Link href="/blog" passHref>
            <Button variant="outline" size="sm">
              View All Posts
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.slice(0, 3).map((post) => (
              <BlogPostCard key={post.id} post={post} onEdit={() => {}} onDelete={() => {}} />
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="stats-section p-8 rounded-xl border mb-16">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-4">About This Project</h2>
            <p className="text-muted-foreground mb-4">
              This interactive application provides a comprehensive view of Elon Musk's life, career, and relationships.
              It features timeline visualizations, relationship analysis, and a blog with the latest news.
            </p>
            <p className="text-muted-foreground">
              The application is built with Next.js and uses Supabase for data storage, providing a responsive and
              interactive user experience with persistent data.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="flex flex-col items-center">
              <Github className="h-16 w-16 text-foreground mb-4" />
              <Button variant="outline">View Source Code</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}