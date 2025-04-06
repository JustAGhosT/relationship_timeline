import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Check for environment variables
const getSupabaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined in environment variables")
  }
  return url
}

const getSupabaseAnonKey = () => {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in environment variables")
  }
  return key
}

// Create a singleton client for client-side usage
let clientInstance: ReturnType<typeof createClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (!clientInstance) {
    clientInstance = createClient<Database>(getSupabaseUrl(), getSupabaseAnonKey())
  }
  return clientInstance
}

// Create a server-side client (for server components and server actions)
export const createServerSupabaseClient = () => {
  // For server components, use either the server-specific env vars or fall back to the public ones
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL is not defined in environment variables")
  }
  
  if (!supabaseKey) {
    throw new Error("SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in environment variables")
  }
  
  return createClient<Database>(supabaseUrl, supabaseKey)
}