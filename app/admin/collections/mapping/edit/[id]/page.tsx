"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { CollectionMapForm } from "@/components/collection-map-form"
import { getCollectionMapById, type CollectionMap } from "@/lib/api/collection"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface Props {
  params: {
    id: string
  }
}

export default function EditCollectionMapPage({ params }: Props) {
  const router = useRouter()
  const [map, setMap] = useState<CollectionMap | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)



  
  useEffect(() => {
    const fetchMap = async () => {
      try {
        setIsLoading(true)
        const response = await getCollectionMapById(params.id)
        if (response.success && response.data) {
          setMap(response.data)
        } else {
          setError(response.message || "Failed to load collection map")
        }
      } catch (err) {
        setError("Network error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMap()
  }, [params.id])

  return (
    <AuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-islamic text-primary mb-2">Edit Collection Map</h1>
                <p className="text-muted-foreground">Edit collection map details</p>
              </div>
            </div>
          </div>

          {/* Content */}
          {isLoading && (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">Loading...</span>
            </div>
          )}

          {!isLoading && error && (
            <div className="p-4 text-center text-red-500 bg-red-50 rounded">
              {error}
            </div>
          )}

          {!isLoading && map && (
            <CollectionMapForm
              mode="edit"
              initialData={map}
              typeOptions={[
                { label: "Up", value: "up" },
                { label: "Down", value: "down" },
              ]}
            />
          )}
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}