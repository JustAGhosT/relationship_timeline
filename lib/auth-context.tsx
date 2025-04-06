"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authenticateUser } from "./actions"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType {
  isLoggedIn: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { toast } = useToast()

  // Check localStorage on initial load
  useEffect(() => {
    const storedAuthState = localStorage.getItem("isLoggedIn")
    if (storedAuthState === "true") {
      setIsLoggedIn(true)
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const success = await authenticateUser(username, password)

      if (success) {
        setIsLoggedIn(true)
        localStorage.setItem("isLoggedIn", "true")
        return true
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive",
      })
      return false
    }
  }

  const logout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem("isLoggedIn")
  }

  return <AuthContext.Provider value={{ isLoggedIn, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

