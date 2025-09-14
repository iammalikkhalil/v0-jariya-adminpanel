"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createCollection, type CreateCollectionRequest } from "@/lib/api/collection"

export default function AddCollectionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<CreateCollectionRequest>({
    text: "",
    description: "",
    featured: false,
    order: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await createCollection(formData)
      if (response.success) {
        router.push("/admin/collections")
      } else {
        setError(response.message || "Failed to create collection")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreateCollectionRequest, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <AuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-islamic text-primary mb-2">Add New Collection</h1>
            <p className="text-muted-foreground">Create a new collection to organize zikrs</p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="font-islamic">Collection Information</CardTitle>
              <CardDescription>Enter the details for the new collection</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="text" className="text-sm font-medium">
                    Collection Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="text"
                    value={formData.text}
                    onChange={(e) => handleInputChange("text", e.target.value)}
                    placeholder="Enter collection name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter collection description (optional)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => handleInputChange("order", Number.parseInt(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange("featured", checked as boolean)}
                  />
                  <Label htmlFor="featured">Featured Collection</Label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={isLoading || !formData.text.trim()}>
                    {isLoading ? "Creating..." : "Create Collection"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/collections")}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
