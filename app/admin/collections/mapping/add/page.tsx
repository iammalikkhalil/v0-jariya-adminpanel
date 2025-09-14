"use client"

import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { CollectionMapForm } from "@/components/collection-map-form"

export default function AddCollectionMapPage() {
  return (
    <AuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-islamic text-primary mb-2">Add Collection Map</h1>
            <p className="text-muted-foreground">Create a new collection map</p>
          </div>

          <CollectionMapForm mode="add" />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
