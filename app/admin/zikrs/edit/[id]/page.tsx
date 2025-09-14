"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { ZikrForm } from "@/components/zikr-form"
import { getZikrById, type Zikr } from "@/lib/api/zikr"

export default function EditZikrPage() {
  const params = useParams()
  const id = params.id as string
  const [zikr, setZikr] = useState<Zikr | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchZikr = async () => {
      try {
        const response = await getZikrById(id)
        if (response.success && response.data) {
          setZikr(response.data)
        } else {
          setError(response.message || "Failed to load zikr")
        }
      } catch (err) {
        setError("Network error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchZikr()
    }
  }, [id])

  if (isLoading) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-islamic text-primary mb-2">Edit Zikr</h1>
              <p className="text-muted-foreground">Update zikr information</p>
            </div>
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    )
  }

  if (error || !zikr) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-islamic text-primary mb-2">Edit Zikr</h1>
              <p className="text-muted-foreground">Update zikr information</p>
            </div>
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Error: {error || "Zikr not found"}</p>
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
            <h1 className="text-3xl font-islamic text-primary mb-2">Edit Zikr</h1>
            <p className="text-muted-foreground">Update zikr information</p>
          </div>
          <ZikrForm zikr={zikr} mode="edit" />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
