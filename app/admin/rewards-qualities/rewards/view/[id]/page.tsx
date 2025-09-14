"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { ZikrRewardView } from "@/components/zikr-reward-view"
import { getZikrRewardById, type ZikrReward } from "@/lib/api/reward"
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
import { deleteZikrReward } from "@/lib/api/reward"

export default function ZikrRewardViewPage() {
  const params = useParams()
  const router = useRouter()
  const [reward, setReward] = useState<ZikrReward | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const rewardId = params.id as string

  useEffect(() => {
    const fetchReward = async () => {
      if (!rewardId) return

      try {
        setIsLoading(true)
        const response = await getZikrRewardById(rewardId)
        
        if (response.success && response.data) {
          const rewardData = response.data
          
          // Fetch associated zikr details
          const zikrResponse = await getZikrById(rewardData.zikrId)
          
          if (zikrResponse.success && zikrResponse.data) {
            const associatedZikr = zikrResponse.data
            setReward({
              ...rewardData,
              zikr: {
                textAr: associatedZikr.textAr,
                titleEn: associatedZikr.titleEn,
                titleUr: associatedZikr.titleUr
              }
            })
          } else {
            setReward(rewardData)
          }
        } else {
          setError(response.message || "Failed to load reward")
        }
      } catch (err) {
        console.error('Error fetching reward:', err)
        setError("Network error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchReward()
  }, [rewardId])

  const handleDelete = async () => {
    if (!reward) return

    setIsDeleting(true)
    try {
      const response = await deleteZikrReward(reward.id)
      if (response.success) {
        router.push("/admin/rewards-qualities/rewards")
      } else {
        alert(response.message || "Failed to delete reward")
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
              <p className="text-muted-foreground">Loading reward details...</p>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    )
  }

  if (error || !reward) {
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
                {error || "Reward not found"}
              </p>
              <Button onClick={() => router.push("/admin/rewards-qualities/rewards")}>
                Go to Rewards List
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
                <h1 className="text-3xl font-islamic text-primary">Reward Details</h1>
                <p className="text-muted-foreground">View and manage reward information</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Link href={`/admin/rewards-qualities/rewards/edit/${reward.id}`}>
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
                    <AlertDialogTitle>Delete Reward</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this reward? This action cannot be undone.
                      <div className="mt-2 p-2 bg-muted rounded text-sm">
                        <strong>Reward:</strong> {reward.text.substring(0, 50)}...
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

          {/* Reward Details */}
          <ZikrRewardView reward={reward} />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
