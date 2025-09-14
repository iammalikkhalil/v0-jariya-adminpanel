"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  getAllCollections, 
  createCollectionMap, 
  updateCollectionMap,
  type Collection,
  type CollectionMap,
  type CreateCollectionMapRequest,
  type UpdateCollectionMapRequest
} from "@/lib/api/collection"
import { getAllZikrs, type Zikr } from "@/lib/api/zikr"

interface CollectionMapFormProps {
  initialData?: CollectionMap
  mode: "add" | "edit"
}

export function CollectionMapForm({ initialData, mode }: CollectionMapFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [collections, setCollections] = useState<Collection[]>([])
  const [zikrs, setZikrs] = useState<Zikr[]>([])
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<CreateCollectionMapRequest>({
    collectionId: initialData?.collectionId || "",
    zikrId: initialData?.zikrId || "",
    countType: initialData?.countType?.toLowerCase() || "up", // ensure "up"/"down"
    countValue: initialData?.countValue || 1,
    orderIndex: initialData?.orderIndex || 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      setError("")
      try {
        const [collectionsRes, zikrsRes] = await Promise.all([
          getAllCollections(),
          getAllZikrs(),
        ])

        if (collectionsRes.success && collectionsRes.data) {
          setCollections(collectionsRes.data)
        } else {
          setError(collectionsRes.message || "Failed to load collections")
        }

        if (zikrsRes.success && zikrsRes.data) {
          setZikrs(zikrsRes.data)
        } else {
          setError(zikrsRes.message || "Failed to load zikrs")
        }
      } catch (err) {
        console.error("Fetch error:", err)
        setError("Failed to load required data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSaving(true)

    try {
      if (!formData.collectionId || !formData.zikrId) {
        setError("Please select both collection and zikr")
        return
      }
      if (formData.countValue < 1) {
        setError("Count value must be at least 1")
        return
      }

      const payload: UpdateCollectionMapRequest | CreateCollectionMapRequest = 
        mode === "edit" && initialData 
          ? { ...formData, id: initialData.id } 
          : formData

      const response = mode === "add" 
        ? await createCollectionMap(payload as CreateCollectionMapRequest)
        : await updateCollectionMap(payload as UpdateCollectionMapRequest)

      if (response.success) {
        router.push("/admin/collections/mapping")
        router.refresh()
      } else {
        setError(response.message || `Failed to ${mode === "add" ? "create" : "update"} collection map`)
      }
    } catch (err) {
      console.error("Save error:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === "add" ? "Add Collection Map" : "Edit Collection Map"}
          </CardTitle>
          <CardDescription>
            {mode === "add"
              ? "Create a new collection map"
              : "Edit an existing collection map"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Collection Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Collection</label>
            <Select
              value={formData.collectionId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, collectionId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a collection" />
              </SelectTrigger>
              <SelectContent>
                {collections.map((collection) => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Zikr Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Zikr</label>
            <Select
              value={formData.zikrId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, zikrId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a zikr" />
              </SelectTrigger>
              <SelectContent>
                {zikrs.map((zikr) => (
                  <SelectItem key={zikr.id} value={zikr.id}>
                    <div className="flex flex-col">
                      <span className="font-arabic">{zikr.textAr}</span>
                      {zikr.titleEn && (
                        <span className="text-xs text-muted-foreground">
                          {zikr.titleEn}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Count Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Count Type</label>
            <Select
              value={formData.countType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, countType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select count type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="up">Count Up</SelectItem>
                <SelectItem value="down">Count Down</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Count Value */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Count Value</label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min={1}
                value={formData.countValue}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    countValue: parseInt(e.target.value) || 1,
                  }))
                }
              />
              <span className="text-sm text-muted-foreground">
                Times to {formData.countType === "down" ? "count down" : "count up"}
              </span>
            </div>
          </div>

          {/* Order Index */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Order Index</label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min={0}
                value={formData.orderIndex}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    orderIndex: parseInt(e.target.value) || 0,
                  }))
                }
              />
              <span className="text-sm text-muted-foreground">
                Display order in the collection
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving || !formData.collectionId || !formData.zikrId}
            >
              {isSaving
                ? mode === "add"
                  ? "Creating..."
                  : "Updating..."
                : mode === "add"
                ? "Create Map"
                : "Update Map"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}