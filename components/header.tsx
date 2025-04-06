"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Home, Calendar, Users, BookOpen, LogIn, LogOut } from "lucide-react"

export default function Header() {
  const pathname = usePathname()
  const { isLoggedIn, login, logout } = useAuth()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const success = login(username, password)
    if (success) {
      setShowLoginDialog(false)
      setLoginError(false)
      setUsername("")
      setPassword("")
    } else {
      setLoginError(true)
    }
  }

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4 mr-1" /> },
    { href: "/timeline", label: "Timeline", icon: <Calendar className="h-4 w-4 mr-1" /> },
    { href: "/relationship", label: "Relationships", icon: <Users className="h-4 w-4 mr-1" /> },
    { href: "/blog", label: "Blog", icon: <BookOpen className="h-4 w-4 mr-1" /> },
  ]

  return (
    <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Link href="/" className="text-xl font-bold text-gray-800 flex items-center">
            <span className="text-primary mr-1">Elon</span> Musk Timeline
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center",
                pathname === item.href ? "text-primary" : "text-gray-600",
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <Button variant="outline" size="sm" onClick={logout} className="gap-1">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setShowLoginDialog(true)} className="gap-1">
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          )}
        </nav>

        {/* Mobile navigation */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="sm" onClick={() => setShowLoginDialog(true)}>
            {isLoggedIn ? <LogOut className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile navigation menu */}
      <div className="md:hidden border-t">
        <div className="container mx-auto px-4 py-2">
          <div className="grid grid-cols-4 gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 text-xs font-medium rounded-md",
                  pathname === item.href ? "text-primary bg-primary/10" : "text-gray-600 hover:bg-gray-100",
                )}
              >
                {React.cloneElement(item.icon, { className: "h-5 w-5 mb-1" })}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {loginError && <p className="text-sm text-red-500">Invalid username or password. Try admin/password.</p>}
            <div className="flex justify-end">
              <Button type="submit">Login</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  )
}

