"use client"

import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { HadithTranslationForm } from "@/components/hadith-translation-form"

export default function AddHadithTranslationPage() {
  return (
    <AuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-islamic text-primary mb-2">Add Hadith Translation</h1>
            <p className="text-muted-foreground">Create a new translation for a hadith</p>
          </div>
          <HadithTranslationForm mode="create" />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
