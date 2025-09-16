"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { getQuranLine, updateQuranLine } from "@/lib/api/quran"
import { QuranLineForm } from "@/components/quran-form"

interface QuranLine {
  pageNumber: number
  lineNumber: number
  textAr: string
  createdAt: string
  updatedAt: string
}

export default function EditQuranLinePage() {
  const params = useParams()
  const pageNumber = Number(params.pageNumber)
  const lineNumber = Number(params.lineNumber)
  const router = useRouter()

  const [line, setLine] = useState<QuranLine | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLine = async () => {
      setIsLoading(true)
      try {
        const response = await getQuranLine(pageNumber, lineNumber)
        if (response.success && response.data) {
          setLine(response.data)
        } else {
          setError(response.message || "Failed to load line")
        }
      } catch {
        setError("Network error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    if (pageNumber && lineNumber) fetchLine()
  }, [pageNumber, lineNumber])

  if (isLoading) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-islamic text-primary mb-2">Edit Quran Line</h1>
              <p className="text-muted-foreground">Update Quran line information</p>
            </div>
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    )
  }

  if (error || !line) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-islamic text-primary mb-2">Edit Quran Line</h1>
              <p className="text-muted-foreground">Update Quran line information</p>
            </div>
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Error: {error || "Line not found"}</p>
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
            <h1 className="text-3xl font-islamic text-primary mb-2">Edit Quran Line</h1>
            <p className="text-muted-foreground">Update Quran line information</p>
          </div>
          <QuranLineForm line={line} mode="edit" />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
