"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { TagMappingTable } from "@/components/tag-mapping-table"
import { getAllTagMaps, type TagMap } from "@/lib/api/tag"

export default function TagMappingPage() {
  const [tagMaps, setTagMaps] = useState<TagMap[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTagMaps = async () => {
    try {
      const response = await getAllTagMaps()
      if (response.success && response.data) {
        setTagMaps(response.data)
      } else {
        setError(response.message || "Failed to load tag mappings")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTagMaps()
  }, [])

  if (isLoading) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-islamic text-primary mb-2">Map Tags to Zikr</h1>
              <p className="text-muted-foreground">Associate tags with zikrs for better organization</p>
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
              <h1 className="text-3xl font-islamic text-primary mb-2">Map Tags to Zikr</h1>
              <p className="text-muted-foreground">Associate tags with zikrs for better organization</p>
            </div>
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Error: {error}</p>
              <button onClick={fetchTagMaps} className="text-primary hover:underline">
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
            <h1 className="text-3xl font-islamic text-primary mb-2">Map Tags to Zikr</h1>
            <p className="text-muted-foreground">Associate tags with zikrs for better organization</p>
          </div>
          <TagMappingTable tagMaps={tagMaps} onTagMapChanged={fetchTagMaps} />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
