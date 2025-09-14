"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { HadithTranslationTable } from "@/components/hadith-translation-table"
import { getAllHadithTranslations, type HadithTranslation } from "@/lib/api/translation"

export default function HadithTranslationsPage() {
  const [translations, setTranslations] = useState<HadithTranslation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTranslations = async () => {
    try {
      const response = await getAllHadithTranslations()
      if (response.success && response.data) {
        setTranslations(response.data)
      } else {
        setError(response.message || "Failed to load translations")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTranslations()
  }, [])

  if (isLoading) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-islamic text-primary mb-2">Hadith Translations</h1>
              <p className="text-muted-foreground">Manage translations for hadiths</p>
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
              <h1 className="text-3xl font-islamic text-primary mb-2">Hadith Translations</h1>
              <p className="text-muted-foreground">Manage translations for hadiths</p>
            </div>
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Error: {error}</p>
              <button onClick={fetchTranslations} className="text-primary hover:underline">
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
            <h1 className="text-3xl font-islamic text-primary mb-2">Hadith Translations</h1>
            <p className="text-muted-foreground">Manage translations for hadiths</p>
          </div>
          <HadithTranslationTable translations={translations} onTranslationChanged={fetchTranslations} />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
