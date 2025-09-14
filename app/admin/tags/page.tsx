"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { TagTable } from "@/components/tag-table"
import { getAllTags, type Tag } from "@/lib/api/tag"

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTags = async () => {
    try {
      const response = await getAllTags()
      if (response.success && response.data) {
        setTags(response.data)
      } else {
        setError(response.message || "Failed to load tags")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  if (isLoading) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-islamic text-primary mb-2">All Tags</h1>
              <p className="text-muted-foreground">Manage tags for organizing zikrs</p>
            </div>
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    )
  }

  if (error) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-islamic text-primary mb-2">All Tags</h1>
              <p className="text-muted-foreground">Manage tags for organizing zikrs</p>
            </div>
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Error: {error}</p>
              <button onClick={fetchTags} className="text-primary hover:underline">
                Try again
              </button>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-islamic text-primary mb-2">All Tags</h1>
            <p className="text-muted-foreground">Manage tags for organizing zikrs</p>
          </div>
          <TagTable tags={tags} onTagChanged={fetchTags} />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
