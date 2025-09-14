"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { HadithTable } from "@/components/hadith-table"
import { getAllHadiths, type Hadith } from "@/lib/api/hadith"

export default function HadithsPage() {
  const [hadiths, setHadiths] = useState<Hadith[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHadiths = async () => {
      try {
        const response = await getAllHadiths()
        if (response.success && response.data) {
          setHadiths(response.data)
        } else {
          setError(response.message || "Failed to load hadiths")
        }
      } catch (err) {
        setError("Network error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchHadiths()
  }, [])

  const handleHadithDeleted = (id: string) => {
    setHadiths((prev) => prev.filter((hadith) => hadith.id !== id))
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-islamic text-primary mb-2">All Hadiths</h1>
              <p className="text-muted-foreground">Manage hadith collection</p>
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
              <h1 className="text-3xl font-islamic text-primary mb-2">All Hadiths</h1>
              <p className="text-muted-foreground">Manage hadith collection</p>
            </div>
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Error: {error}</p>
              <button onClick={() => window.location.reload()} className="text-primary hover:underline">
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
            <h1 className="text-3xl font-islamic text-primary mb-2">All Hadiths</h1>
            <p className="text-muted-foreground">Manage hadith collection</p>
          </div>
          <HadithTable hadiths={hadiths} onHadithDeleted={handleHadithDeleted} />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
