"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { ZikrQualityForm } from "@/components/zikr-quality-form"
import { getZikrQualityById, type ZikrQuality } from "@/lib/api/quality"

export default function EditZikrQualityPage() {
  const params = useParams()
  const router = useRouter()
  const [quality, setQuality] = useState<ZikrQuality | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const qualityId = params.id as string

  useEffect(() => {
    const fetchQuality = async () => {
      if (!qualityId) return

      try {
        setIsLoading(true)
        const response = await getZikrQualityById(qualityId)
        
        if (response.success && response.data) {
          setQuality(response.data)
        } else {
          setError(response.message || "Failed to load quality")
        }
      } catch (err) {
        setError("Network error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuality()
  }, [qualityId])

  if (isLoading) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading quality...</p>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    )
  }

  if (error || !quality) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-islamic text-primary mb-2">Edit Zikr Quality</h1>
              <p className="text-muted-foreground">Update quality information</p>
            </div>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-destructive mb-2">Error</h1>
              <p className="text-muted-foreground mb-4">
                {error || "Quality not found"}
              </p>
              <button 
                onClick={() => router.push("/admin/rewards-qualities/qualities")}
                className="text-primary hover:underline"
              >
                Go to Qualities List
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
            <h1 className="text-3xl font-islamic text-primary mb-2">Edit Zikr Quality</h1>
            <p className="text-muted-foreground">Update quality information</p>
          </div>
          <ZikrQualityForm quality={quality} mode="edit" />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
