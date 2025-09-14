"use client"

import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { ZikrQualityForm } from "@/components/zikr-quality-form"

export default function AddZikrQualityPage() {
  return (
    <AuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-islamic text-primary mb-2">Add Zikr Quality</h1>
            <p className="text-muted-foreground">Create a new quality for a zikr</p>
          </div>
          <ZikrQualityForm mode="create" />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
