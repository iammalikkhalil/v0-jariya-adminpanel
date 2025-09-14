import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { HadithForm } from "@/components/hadith-form"

export default function AddHadithPage() {
  return (
    <AuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-islamic text-primary mb-2">Add New Hadith</h1>
            <p className="text-muted-foreground">Create a new hadith entry</p>
          </div>
          <HadithForm mode="create" />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
