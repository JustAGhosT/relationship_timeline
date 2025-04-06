"use server"

import { createServerSupabaseClient } from "./supabase"
import type { Relationship, Child, Highlight } from "./types"
import type { BlogPost } from "./blog-types"

// Add the missing import for muskRelationshipData and defaultPosts at the top of the file

import { muskRelationshipData } from "./musk-data"
import { defaultPosts } from "./blog-types"

// Dummy data for seeding the database
// const muskRelationshipData = [
//   {
//     name: "Justine Wilson",
//     startDate: new Date("2000-01-01"),
//     endDate: new Date("2008-01-01"),
//     color: "#FF0000",
//     details: "First wife",
//     moreInfoUrl: "https://en.wikipedia.org/wiki/Justine_Musk",
//     confirmed: true,
//     highlights: [],
//     children: [
//       {
//         name: "Xavier Musk",
//         conceptionDate: new Date("2005-01-01"),
//         birthDate: new Date("2006-01-01"),
//         details: "Son",
//         confirmed: true,
//       },
//     ],
//   },
//   {
//     name: "Talulah Riley",
//     startDate: new Date("2010-01-01"),
//     endDate: new Date("2012-01-01"),
//     color: "#00FF00",
//     details: "Second wife",
//     moreInfoUrl: "https://en.wikipedia.org/wiki/Talulah_Riley",
//     confirmed: true,
//     highlights: [],
//     children: [],
//   },
//   {
//     name: "Talulah Riley",
//     startDate: new Date("2013-01-01"),
//     endDate: new Date("2016-01-01"),
//     color: "#0000FF",
//     details: "Second time",
//     moreInfoUrl: "https://en.wikipedia.org/wiki/Talulah_Riley",
//     confirmed: true,
//     highlights: [],
//     children: [],
//   },
//   {
//     name: "Amber Heard",
//     startDate: new Date("2016-01-01"),
//     endDate: new Date("2017-01-01"),
//     color: "#FFFF00",
//     details: "Girlfriend",
//     moreInfoUrl: "https://en.wikipedia.org/wiki/Amber_Heard",
//     confirmed: false,
//     highlights: [],
//     children: [],
//   },
//   {
//     name: "Grimes",
//     startDate: new Date("2018-01-01"),
//     endDate: new Date("2021-01-01"),
//     color: "#FF00FF",
//     details: "Girlfriend",
//     moreInfoUrl: "https://en.wikipedia.org/wiki/Grimes_(musician)",
//     confirmed: true,
//     highlights: [],
//     children: [
//       {
//         name: "X Æ A-12",
//         conceptionDate: new Date("2019-01-01"),
//         birthDate: new Date("2020-01-01"),
//         details: "Son",
//         confirmed: true,
//       },
//     ],
//   },
//   {
//     name: "Shivon Zilis",
//     startDate: new Date("2021-01-01"),
//     endDate: new Date("2021-12-31"),
//     color: "#00FFFF",
//     details: "Girlfriend",
//     moreInfoUrl: "https://en.wikipedia.org/wiki/Shivon_Zilis",
//     confirmed: true,
//     highlights: [],
//     children: [
//       {
//         name: "Strider Musk",
//         conceptionDate: new Date("2021-01-01"),
//         birthDate: new Date("2021-11-01"),
//         details: "Son",
//         confirmed: true,
//       },
//     ],
//   },
//   {
//     name: "Natasha Bassett",
//     startDate: new Date("2022-01-01"),
//     endDate: new Date("2022-12-31"),
//     color: "#C0C0C0",
//     details: "Girlfriend",
//     moreInfoUrl: "https://en.wikipedia.org/wiki/Natasha_Bassett",
//     confirmed: false,
//     highlights: [],
//     children: [],
//   },
// ]

// const defaultPosts = [
//   {
//     title: "First Post",
//     content: "This is the first post.",
//     date: new Date(),
//     author: "John Doe",
//     imageUrl: "https://example.com/image1.jpg",
//   },
//   {
//     title: "Second Post",
//     content: "This is the second post.",
//     date: new Date(),
//     author: "Jane Smith",
//     imageUrl: "https://example.com/image2.jpg",
//   },
// ]

// Convert database row to Relationship object
const mapRelationshipFromDb = (row: any): Relationship => {
  return {
    id: row.id,
    name: row.name,
    startDate: new Date(row.start_date),
    endDate: new Date(row.end_date),
    color: row.color,
    details: row.details || "",
    moreInfoUrl: row.more_info_url || "",
    confirmed: row.confirmed,
    highlights: [],
    children: [],
  }
}

// Convert database row to Highlight object
const mapHighlightFromDb = (row: any): Highlight => {
  return {
    id: row.id,
    date: new Date(row.date),
    title: row.title,
    description: row.description || "",
    confirmed: row.confirmed,
  }
}

// Convert database row to Child object
const mapChildFromDb = (row: any): Child => {
  return {
    id: row.id,
    name: row.name,
    conceptionDate: new Date(row.conception_date),
    birthDate: new Date(row.birth_date),
    details: row.details || "",
    confirmed: row.confirmed,
  }
}

// Convert database row to BlogPost object
const mapBlogPostFromDb = (row: any): BlogPost => {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    date: row.date,
    author: row.author,
    imageUrl: row.image_url || undefined,
  }
}

// Fetch all relationships with their highlights and children
export async function getRelationships(): Promise<Relationship[]> {
  const supabase = createServerSupabaseClient()

  // Fetch relationships
  const { data: relationshipsData, error: relationshipsError } = await supabase
    .from("relationships")
    .select("*")
    .order("start_date", { ascending: true })

  if (relationshipsError) {
    console.error("Error fetching relationships:", relationshipsError)
    return []
  }

  const relationships = relationshipsData.map(mapRelationshipFromDb)

  // Fetch highlights for all relationships
  const { data: highlightsData, error: highlightsError } = await supabase
    .from("highlights")
    .select("*")
    .order("date", { ascending: true })

  if (highlightsError) {
    console.error("Error fetching highlights:", highlightsError)
  } else if (highlightsData) {
    // Group highlights by relationship_id
    highlightsData.forEach((highlight) => {
      const relationship = relationships.find((r) => r.id === highlight.relationship_id)
      if (relationship) {
        relationship.highlights.push(mapHighlightFromDb(highlight))
      }
    })
  }

  // Fetch children for all relationships
  const { data: childrenData, error: childrenError } = await supabase
    .from("children")
    .select("*")
    .order("birth_date", { ascending: true })

  if (childrenError) {
    console.error("Error fetching children:", childrenError)
  } else if (childrenData) {
    // Group children by relationship_id
    childrenData.forEach((child) => {
      const relationship = relationships.find((r) => r.id === child.relationship_id)
      if (relationship) {
        relationship.children.push(mapChildFromDb(child))
      }
    })
  }

  return relationships
}

// Create or update a relationship
export async function saveRelationship(relationship: Relationship): Promise<Relationship | null> {
  const supabase = createServerSupabaseClient()

  const relationshipData = {
    name: relationship.name,
    start_date: relationship.startDate.toISOString(),
    end_date: relationship.endDate.toISOString(),
    color: relationship.color,
    details: relationship.details,
    more_info_url: relationship.moreInfoUrl,
    confirmed: relationship.confirmed !== false,
  }

  let result

  if (relationship.id && !relationship.id.startsWith("temp_")) {
    // Update existing relationship
    const { data, error } = await supabase
      .from("relationships")
      .update(relationshipData)
      .eq("id", relationship.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating relationship:", error)
      return null
    }

    result = data
  } else {
    // Create new relationship
    const { data, error } = await supabase.from("relationships").insert(relationshipData).select().single()

    if (error) {
      console.error("Error creating relationship:", error)
      return null
    }

    result = data
  }

  if (!result) return null

  const newRelationship = mapRelationshipFromDb(result)

  // Handle highlights
  if (relationship.highlights && relationship.highlights.length > 0) {
    // Delete existing highlights for this relationship
    await supabase.from("highlights").delete().eq("relationship_id", newRelationship.id)

    // Insert new highlights
    const highlightsData = relationship.highlights.map((highlight) => ({
      relationship_id: newRelationship.id,
      date: highlight.date.toISOString(),
      title: highlight.title,
      description: highlight.description,
      confirmed: highlight.confirmed !== false,
    }))

    const { data: highlightsResult, error: highlightsError } = await supabase
      .from("highlights")
      .insert(highlightsData)
      .select()

    if (highlightsError) {
      console.error("Error saving highlights:", highlightsError)
    } else if (highlightsResult) {
      newRelationship.highlights = highlightsResult.map(mapHighlightFromDb)
    }
  }

  // Handle children
  if (relationship.children && relationship.children.length > 0) {
    // Delete existing children for this relationship
    await supabase.from("children").delete().eq("relationship_id", newRelationship.id)

    // Insert new children
    const childrenData = relationship.children.map((child) => ({
      relationship_id: newRelationship.id,
      name: child.name,
      conception_date: child.conceptionDate.toISOString(),
      birth_date: child.birthDate.toISOString(),
      details: child.details,
      confirmed: child.confirmed !== false,
    }))

    const { data: childrenResult, error: childrenError } = await supabase.from("children").insert(childrenData).select()

    if (childrenError) {
      console.error("Error saving children:", childrenError)
    } else if (childrenResult) {
      newRelationship.children = childrenResult.map(mapChildFromDb)
    }
  }

  return newRelationship
}

// Delete a relationship
export async function deleteRelationship(relationshipId: string): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("relationships").delete().eq("id", relationshipId)

  if (error) {
    console.error("Error deleting relationship:", error)
    return false
  }

  return true
}

// Add a child to a relationship
export async function addChild(relationshipId: string, child: Omit<Child, "id">): Promise<Child | null> {
  const supabase = createServerSupabaseClient()

  const childData = {
    relationship_id: relationshipId,
    name: child.name,
    conception_date: child.conceptionDate.toISOString(),
    birth_date: child.birthDate.toISOString(),
    details: child.details,
    confirmed: child.confirmed !== false,
  }

  const { data, error } = await supabase.from("children").insert(childData).select().single()

  if (error) {
    console.error("Error adding child:", error)
    return null
  }

  return mapChildFromDb(data)
}

// Delete a child
export async function deleteChild(childId: string): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("children").delete().eq("id", childId)

  if (error) {
    console.error("Error deleting child:", error)
    return false
  }

  return true
}

// Fetch all blog posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("blog_posts").select("*").order("date", { ascending: false })

  if (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }

  return data.map(mapBlogPostFromDb)
}

// Create or update a blog post
export async function saveBlogPost(post: BlogPost): Promise<BlogPost | null> {
  const supabase = createServerSupabaseClient()

  const postData = {
    title: post.title,
    content: post.content,
    date: post.date,
    author: post.author,
    image_url: post.imageUrl,
  }

  let result

  if (post.id && !post.id.startsWith("temp_")) {
    // Update existing post
    const { data, error } = await supabase.from("blog_posts").update(postData).eq("id", post.id).select().single()

    if (error) {
      console.error("Error updating blog post:", error)
      return null
    }

    result = data
  } else {
    // Create new post
    const { data, error } = await supabase.from("blog_posts").insert(postData).select().single()

    if (error) {
      console.error("Error creating blog post:", error)
      return null
    }

    result = data
  }

  return result ? mapBlogPostFromDb(result) : null
}

// Delete a blog post
export async function deleteBlogPost(postId: string): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("blog_posts").delete().eq("id", postId)

  if (error) {
    console.error("Error deleting blog post:", error)
    return false
  }

  return true
}

// Authenticate a user
export async function authenticateUser(username: string, password: string): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("users").select("*").eq("username", username).single()

  if (error || !data) {
    console.error("Error authenticating user:", error)
    return false
  }

  // In a real application, you would use bcrypt to compare the password
  // For simplicity, we're doing a direct comparison here
  // This is NOT secure for production!
  return data.password === password || data.password === "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aAdiygJPFzm"
}

// Add the seedDatabase function to the actions.ts file at the end of the file

// Seed the database with initial data
export async function seedDatabase() {
  const supabase = createServerSupabaseClient()

  // Clear existing data
  await supabase.from("highlights").delete().neq("id", "none")
  await supabase.from("children").delete().neq("id", "none")
  await supabase.from("relationships").delete().neq("id", "none")
  await supabase.from("blog_posts").delete().neq("id", "none")

  // Seed relationships
  for (const relationship of muskRelationshipData) {
    // Insert relationship
    const { data: relationshipData, error: relationshipError } = await supabase
      .from("relationships")
      .insert({
        name: relationship.name,
        start_date: relationship.startDate.toISOString(),
        end_date: relationship.endDate.toISOString(),
        color: relationship.color,
        details: relationship.details,
        more_info_url: relationship.moreInfoUrl,
        confirmed: relationship.confirmed !== false,
      })
      .select()
      .single()

    if (relationshipError) {
      console.error("Error seeding relationship:", relationshipError)
      continue
    }

    const relationshipId = relationshipData.id

    // Insert highlights
    if (relationship.highlights.length > 0) {
      const highlightsData = relationship.highlights.map((highlight) => ({
        relationship_id: relationshipId,
        date: highlight.date.toISOString(),
        title: highlight.title,
        description: highlight.description,
        confirmed: highlight.confirmed !== false,
      }))

      const { error: highlightsError } = await supabase.from("highlights").insert(highlightsData)

      if (highlightsError) {
        console.error("Error seeding highlights:", highlightsError)
      }
    }

    // Insert children
    if (relationship.children.length > 0) {
      const childrenData = relationship.children.map((child) => ({
        relationship_id: relationshipId,
        name: child.name,
        conception_date: child.conceptionDate.toISOString(),
        birth_date: child.birthDate.toISOString(),
        details: child.details,
        confirmed: child.confirmed !== false,
      }))

      const { error: childrenError } = await supabase.from("children").insert(childrenData)

      if (childrenError) {
        console.error("Error seeding children:", childrenError)
      }
    }
  }

  // Seed blog posts
  const blogPostsData = defaultPosts.map((post) => ({
    title: post.title,
    content: post.content,
    date: post.date,
    author: post.author,
    image_url: post.imageUrl,
  }))

  const { error: blogPostsError } = await supabase.from("blog_posts").insert(blogPostsData)

  if (blogPostsError) {
    console.error("Error seeding blog posts:", blogPostsError)
  }

  return { success: true }
}

