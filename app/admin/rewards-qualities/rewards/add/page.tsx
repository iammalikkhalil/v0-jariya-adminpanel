"use client"

import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { ZikrRewardForm } from "@/components/zikr-reward-form"

export default function AddZikrRewardPage() {
  return (
    <AuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-islamic text-primary mb-2">Add Zikr Reward</h1>
            <p className="text-muted-foreground">Create a new reward for a zikr</p>
          </div>
          <ZikrRewardForm mode="create" />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
