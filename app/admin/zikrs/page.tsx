"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { ZikrTable } from "@/components/zikr-table"
import { getAllZikrs, type Zikr } from "@/lib/api/zikr"

export default function ZikrsPage() {
  const [zikrs, setZikrs] = useState<Zikr[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchZikrs()
  }, [])


  const fetchZikrs = async () => {
      try {
        const response = await getAllZikrs()
        if (response.success && response.data) {

console.log("Fetched zikrs:", response.data);


          setZikrs(response.data)
        } else {
          setError(response.message || "Failed to load zikrs")
        }
      } catch (err) {
        setError("Network error occurred")
      } finally {
        setIsLoading(false)
      }
    }

const handleRefresh = () => {
  fetchZikrs() // Your existing fetch function
}


  const handleZikrDeleted = (id: string) => {
    setZikrs((prev) => prev.filter((zikr) => zikr.id !== id))
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-islamic text-primary mb-2">All Zikrs</h1>
              <p className="text-muted-foreground">Manage your zikr collection</p>
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
              <h1 className="text-3xl font-islamic text-primary mb-2">All Zikrs</h1>
              <p className="text-muted-foreground">Manage your zikr collection</p>
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
            <h1 className="text-3xl font-islamic text-primary mb-2">All Zikrs</h1>
            <p className="text-muted-foreground">Manage your zikr collection</p>
          </div>

        <ZikrTable 
  zikrs={zikrs} 
  onZikrDeleted={handleZikrDeleted}
  onRefresh={handleRefresh}
  isLoading={isLoading}
/>
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
