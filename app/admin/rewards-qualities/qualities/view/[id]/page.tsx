"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { ZikrQualityView } from "@/components/zikr-quality-view"
import { getZikrQualityById, type ZikrQuality } from "@/lib/api/quality"
import { getZikrById } from "@/lib/api/zikr"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteZikrQuality } from "@/lib/api/quality"

export default function ZikrQualityViewPage() {
  const params = useParams()
  const router = useRouter()
  const [quality, setQuality] = useState<ZikrQuality | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const qualityId = params.id as string

  useEffect(() => {
    const fetchQuality = async () => {
      if (!qualityId) return

      try {
        setIsLoading(true)
        const response = await getZikrQualityById(qualityId)
        
        if (response.success && response.data) {
          const qualityData = response.data
          
          // Fetch associated zikr details
          const zikrResponse = await getZikrById(qualityData.zikrId)
          
          if (zikrResponse.success && zikrResponse.data) {
            const associatedZikr = zikrResponse.data
            setQuality({
              ...qualityData,
              zikr: {
                textAr: associatedZikr.textAr,
                titleEn: associatedZikr.titleEn,
                titleUr: associatedZikr.titleUr
              }
            })
          } else {
            setQuality(qualityData)
          }
        } else {
          setError(response.message || "Failed to load quality")
        }
      } catch (err) {
        console.error('Error fetching quality:', err)
        setError("Network error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuality()
  }, [qualityId])

  const handleDelete = async () => {
    if (!quality) return

    setIsDeleting(true)
    try {
      const response = await deleteZikrQuality(quality.id)
      if (response.success) {
        router.push("/admin/rewards-qualities/qualities")
      } else {
        alert(response.message || "Failed to delete quality")
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert("Network error occurred")
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading quality details...</p>
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
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-destructive mb-2">Error</h1>
              <p className="text-muted-foreground mb-4">
                {error || "Quality not found"}
              </p>
              <Button onClick={() => router.push("/admin/rewards-qualities/qualities")}>
                Go to Qualities List
              </Button>
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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-islamic text-primary">Quality Details</h1>
                <p className="text-muted-foreground">View and manage quality information</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Link href={`/admin/rewards-qualities/qualities/edit/${quality.id}`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Quality</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this quality? This action cannot be undone.
                      <div className="mt-2 p-2 bg-muted rounded text-sm">
                        <strong>Quality:</strong> {quality.text.substring(0, 50)}...
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Quality Details */}
          <ZikrQualityView quality={quality} />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
