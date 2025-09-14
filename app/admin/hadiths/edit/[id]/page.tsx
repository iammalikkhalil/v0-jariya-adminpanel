"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { HadithForm } from "@/components/hadith-form"
import { getHadithById, type Hadith } from "@/lib/api/hadith"

export default function EditHadithPage() {
  const params = useParams()
  const id = params.id as string
  const [hadith, setHadith] = useState<Hadith | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHadith = async () => {
      try {
        const response = await getHadithById(id)
        if (response.success && response.data) {
          setHadith(response.data)
        } else {
          setError(response.message || "Failed to load hadith")
        }
      } catch (err) {
        setError("Network error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchHadith()
    }
  }, [id])

  if (isLoading) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-islamic text-primary mb-2">Edit Hadith</h1>
              <p className="text-muted-foreground">Update hadith information</p>
            </div>
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    )
  }

  if (error || !hadith) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-islamic text-primary mb-2">Edit Hadith</h1>
              <p className="text-muted-foreground">Update hadith information</p>
            </div>
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Error: {error || "Hadith not found"}</p>
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
            <h1 className="text-3xl font-islamic text-primary mb-2">Edit Hadith</h1>
            <p className="text-muted-foreground">Update hadith information</p>
          </div>
          <HadithForm hadith={hadith} mode="edit" />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
