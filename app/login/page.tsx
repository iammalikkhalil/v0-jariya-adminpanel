"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginAdmin } from "@/lib/api/auth"
import { setStoredAdmin, isAuthenticated } from "@/lib/auth"
import { BookOpen } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    console.log("[v0] Login page loaded, checking authentication status")

    // Redirect if already authenticated
    if (isAuthenticated()) {
      console.log("[v0] User already authenticated, redirecting to admin")
      router.push("/admin")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log("[v0] Login form submitted:", { email, hasPassword: !!password })

    try {
      const response = await loginAdmin({ email, password })
      console.log("[v0] Login response received:", JSON.stringify(response))

      if (response.success && response.data) {
        console.log("[v0] Login successful, storing admin data and redirecting")
        setStoredAdmin(response.data.admin)

        await new Promise((resolve) => setTimeout(resolve, 100))

        const storedAdmin = localStorage.getItem("jariya_admin")
        console.log("[v0] Verifying storage before redirect:", { hasStored: !!storedAdmin })

        router.push("/admin")
      } else {
        console.error("[v0] Login failed:", response.message)
        setError(response.message || "Login failed")
      }
    } catch (err) {
      console.error("[v0] Login network error:", err)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
      console.log("[v0] Login process completed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md islamic-card shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full border-2 border-primary/20">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-islamic text-primary mb-2">جاریہ</CardTitle>
          <CardTitle className="text-xl font-sans text-primary mb-1">Jariya Admin</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to manage Islamic Zikrs and Hadiths
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-destructive/50">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@jariya.net"
                required
                disabled={isLoading}
                className="border-border focus:ring-primary/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                className="border-border focus:ring-primary/30"
              />
            </div>

            <Button type="submit" className="w-full islamic-button text-lg py-3" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p className="font-medium">Islamic Zikr Management System</p>
            <p className="text-xs mt-2 italic">Built with respect and authenticity</p>
            <div className="mt-3 text-xs text-primary/60">
              <span className="font-islamic">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
