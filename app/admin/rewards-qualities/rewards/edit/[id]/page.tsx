"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { ZikrRewardForm } from "@/components/zikr-reward-form"
import { getZikrRewardById, type ZikrReward } from "@/lib/api/reward"

export default function EditZikrRewardPage() {
  const params = useParams()
  const router = useRouter()
  const [reward, setReward] = useState<ZikrReward | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const rewardId = params.id as string

  useEffect(() => {
    const fetchReward = async () => {
      if (!rewardId) return

      try {
        setIsLoading(true)
        const response = await getZikrRewardById(rewardId)
        
        if (response.success && response.data) {
          setReward(response.data)
        } else {
          setError(response.message || "Failed to load reward")
        }
      } catch (err) {
        setError("Network error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchReward()
  }, [rewardId])

  if (isLoading) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading reward...</p>
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
            <div>
              <h1 className="text-3xl font-islamic text-primary mb-2">Edit Zikr Reward</h1>
              <p className="text-muted-foreground">Update reward information</p>
            </div>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-destructive mb-2">Error</h1>
              <p className="text-muted-foreground mb-4">
                {error || "Reward not found"}
              </p>
              <button 
                onClick={() => router.push("/admin/rewards-qualities/rewards")}
                className="text-primary hover:underline"
              >
                Go to Rewards List
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
            <h1 className="text-3xl font-islamic text-primary mb-2">Edit Zikr Reward</h1>
            <p className="text-muted-foreground">Update reward information</p>
          </div>
          <ZikrRewardForm reward={reward} mode="edit" />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
