"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { ZikrRewardTable } from "@/components/zikr-reward-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { getAllZikrRewards, type ZikrReward } from "@/lib/api/reward"
import { getAllZikrs, type Zikr } from "@/lib/api/zikr"

export default function ZikrRewardsPage() {
  const [rewards, setRewards] = useState<ZikrReward[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRewards = async () => {
    try {
      // Get all rewards
      const rewardsResponse = await getAllZikrRewards()
      // Get all zikrs
      const zikrsResponse = await getAllZikrs()
      
      if (rewardsResponse.success && rewardsResponse.data && zikrsResponse.success && zikrsResponse.data) {
        // Create a map of zikrs for quick lookup
        const zikrsMap = new Map(zikrsResponse.data.map((zikr: Zikr) => [zikr.id, {
          textAr: zikr.textAr,
          titleEn: zikr.titleEn,
          titleUr: zikr.titleUr
        }]))
        
        // Combine rewards with their complete zikr data
        const enrichedRewards: ZikrReward[] = rewardsResponse.data.map(reward => ({
          ...reward,
          zikr: zikrsMap.get(reward.zikrId) || reward.zikr
        }))
        
        setRewards(enrichedRewards)
      } else {
        setError(rewardsResponse.message || zikrsResponse.message || "Failed to load rewards")
      }
    } catch (err) {
      console.error('Error fetching rewards:', err)
      setError("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRewards()
  }, [])

  if (isLoading) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-islamic text-primary mb-2">Zikr Rewards</h1>
              <p className="text-muted-foreground">Manage rewards for zikrs</p>
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
              <h1 className="text-3xl font-islamic text-primary mb-2">Zikr Rewards</h1>
              <p className="text-muted-foreground">Manage rewards for zikrs</p>
            </div>
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Error: {error}</p>
              <button onClick={fetchRewards} className="text-primary hover:underline">
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
              <h1 className="text-3xl font-islamic text-primary mb-2">Zikr Rewards</h1>
              <p className="text-muted-foreground">Manage rewards for zikrs</p>
            </div>
            <Link href="/admin/rewards-qualities/rewards/add">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Reward
              </Button>
            </Link>
          </div>
          <ZikrRewardTable rewards={rewards} onRewardChanged={fetchRewards} />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
