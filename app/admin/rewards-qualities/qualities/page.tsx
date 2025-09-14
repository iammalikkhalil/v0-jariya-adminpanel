"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { ZikrQualityTable } from "@/components/zikr-quality-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { getAllZikrQualities, type ZikrQuality } from "@/lib/api/quality"
import { getAllZikrs, type Zikr } from "@/lib/api/zikr"

export default function ZikrQualitiesPage() {
  const [qualities, setQualities] = useState<ZikrQuality[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQualities = async () => {
    try {
      // Get all qualities
      const qualitiesResponse = await getAllZikrQualities()
      // Get all zikrs
      const zikrsResponse = await getAllZikrs()
      
      if (qualitiesResponse.success && qualitiesResponse.data && zikrsResponse.success && zikrsResponse.data) {
        // Create a map of zikrs for quick lookup
        const zikrsMap = new Map(zikrsResponse.data.map((zikr: Zikr) => [zikr.id, {
          textAr: zikr.textAr,
          titleEn: zikr.titleEn,
          titleUr: zikr.titleUr
        }]))
        
        // Combine qualities with their complete zikr data
        const enrichedQualities: ZikrQuality[] = qualitiesResponse.data.map(quality => ({
          ...quality,
          zikr: zikrsMap.get(quality.zikrId) || quality.zikr
        }))
        
        setQualities(enrichedQualities)
      } else {
        setError(qualitiesResponse.message || zikrsResponse.message || "Failed to load qualities")
      }
    } catch (err) {
      console.error('Error fetching qualities:', err)
      setError("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQualities()
  }, [])

  if (isLoading) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-islamic text-primary mb-2">Zikr Qualities</h1>
              <p className="text-muted-foreground">Manage qualities for zikrs</p>
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
              <h1 className="text-3xl font-islamic text-primary mb-2">Zikr Qualities</h1>
              <p className="text-muted-foreground">Manage qualities for zikrs</p>
            </div>
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Error: {error}</p>
              <button onClick={fetchQualities} className="text-primary hover:underline">
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-islamic text-primary mb-2">Zikr Qualities</h1>
              <p className="text-muted-foreground">Manage qualities for zikrs</p>
            </div>
            <Link href="/admin/rewards-qualities/qualities/add">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Quality
              </Button>
            </Link>
          </div>
          <ZikrQualityTable qualities={qualities} onQualityChanged={fetchQualities} />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
