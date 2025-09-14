"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { ZikrTranslationForm } from "@/components/zikr-translation-form"
import { getZikrTranslationById, type ZikrTranslation } from "@/lib/api/translation"

export default function EditZikrTranslationPage() {
  const params = useParams()
  const router = useRouter()
  const [translation, setTranslation] = useState<ZikrTranslation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const translationId = params.id as string

  useEffect(() => {
    const fetchTranslation = async () => {
      if (!translationId) return

      try {
        setIsLoading(true)
        const response = await getZikrTranslationById(translationId)
        
        if (response.success && response.data) {
          setTranslation(response.data)
        } else {
          setError(response.message || "Failed to load translation")
        }
      } catch (err) {
        setError("Network error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTranslation()
  }, [translationId])

  if (isLoading) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading translation...</p>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    )
  }

  if (error || !translation) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-islamic text-primary mb-2">Edit Zikr Translation</h1>
              <p className="text-muted-foreground">Update translation information</p>
            </div>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-destructive mb-2">Error</h1>
              <p className="text-muted-foreground mb-4">
                {error || "Translation not found"}
              </p>
              <button 
                onClick={() => router.push("/admin/translations/zikr")}
                className="text-primary hover:underline"
              >
                Go to Translations List
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
            <h1 className="text-3xl font-islamic text-primary mb-2">Edit Zikr Translation</h1>
            <p className="text-muted-foreground">Update translation information</p>
          </div>
          <ZikrTranslationForm translation={translation} mode="edit" />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
