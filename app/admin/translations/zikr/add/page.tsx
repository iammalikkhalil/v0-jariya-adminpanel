"use client"

import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { ZikrTranslationForm } from "@/components/zikr-translation-form"

export default function AddZikrTranslationPage() {
  return (
    <AuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-islamic text-primary mb-2">Add Zikr Translation</h1>
            <p className="text-muted-foreground">Create a new translation for a zikr</p>
          </div>
          <ZikrTranslationForm mode="create" />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
