import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { ZikrForm } from "@/components/zikr-form"

export default function AddZikrPage() {
  return (
    <AuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-islamic text-primary mb-2">Add New Zikr</h1>
            <p className="text-muted-foreground">Create a new zikr entry in the collection</p>
          </div>
          <ZikrForm mode="create" />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
