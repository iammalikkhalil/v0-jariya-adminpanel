"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getRecentZikrs, type RecentZikr } from "@/lib/api/dashboard"
import { CheckCircle, Clock } from "lucide-react"

export function RecentZikrs() {
  const [recentZikrs, setRecentZikrs] = useState<RecentZikr[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentZikrs = async () => {
      try {
        const response = await getRecentZikrs()
        if (response.success && response.data) {
          setRecentZikrs(response.data.slice(0, 5)) // Show only 5 most recent
        } else {
          setError(response.message || "Failed to load recent zikrs")
        }
      } catch (err) {
        setError("Network error")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentZikrs()
  }, [])

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} days ago`
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-islamic">Recent Zikrs</CardTitle>
          <CardDescription>Latest additions to the Zikr collection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-muted animate-pulse rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-islamic">Recent Zikrs</CardTitle>
          <CardDescription>Latest additions to the Zikr collection</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">Failed to load recent zikrs: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-islamic">Recent Zikrs</CardTitle>
        <CardDescription>Latest additions to the Zikr collection</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentZikrs.length > 0 ? (
            recentZikrs.map((zikr) => (
              <div
                key={zikr.id}
                className="flex items-start space-x-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium font-islamic truncate">{zikr.textArabic}</p>
                    {zikr.verified && <CheckCircle className="h-3 w-3 text-secondary flex-shrink-0" />}
                  </div>
                  {zikr.titleEn && <p className="text-xs text-muted-foreground mb-1">{zikr.titleEn}</p>}
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{formatTimeAgo(zikr.createdAt)}</p>
                    <Badge variant={zikr.verified ? "default" : "secondary"} className="text-xs">
                      {zikr.verified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No recent zikrs found</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
