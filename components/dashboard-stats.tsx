"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Tags, FolderOpen, CheckCircle } from "lucide-react"
import { getDashboardStats } from "@/lib/api/dashboard"

export function DashboardStatsComponent() {
  const [stats, setStats] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats()
        if (response.success && response.data) {
          setStats(response.data)
        } else {
          setError(response.message || "Failed to load stats")
        }
      } catch (err) {
        setError("Network error")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border col-span-full">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Failed to load dashboard stats: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Zikrs</CardTitle>
          <BookOpen className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.totalZikrs.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {stats.monthlyGrowth > 0 ? "+" : ""}
            {stats.monthlyGrowth}% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Verified Zikrs</CardTitle>
          <CheckCircle className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-secondary">{stats.verifiedZikrs.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">{Math.round(stats.verificationRate)}% verification rate</p>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Collections</CardTitle>
          <FolderOpen className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.totalCollections}</div>
          <p className="text-xs text-muted-foreground">+{stats.weeklyCollections} new this week</p>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tags</CardTitle>
          <Tags className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-secondary">{stats.totalTags}</div>
          <p className="text-xs text-muted-foreground">Organized categories</p>
        </CardContent>
      </Card>
    </div>
  )
}

export { DashboardStatsComponent as DashboardStats }
