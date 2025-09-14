"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createZikrQuality, updateZikrQuality, type ZikrQuality, type CreateZikrQualityRequest } from "@/lib/api/quality"
import { getAllZikrs, type Zikr } from "@/lib/api/zikr"

interface ZikrQualityFormProps {
  quality?: ZikrQuality
  mode: "create" | "edit"
}

export function ZikrQualityForm({ quality, mode }: ZikrQualityFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [zikrs, setZikrs] = useState<Zikr[]>([])

  const [formData, setFormData] = useState<CreateZikrQualityRequest>({
    zikrId: quality?.zikrId || "",
    text: quality?.text || "",
  })

  useEffect(() => {
    const fetchZikrs = async () => {
      const response = await getAllZikrs()
      if (response.success && response.data) {
        setZikrs(response.data)
      }
    }
    fetchZikrs()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = mode === "create" 
        ? await createZikrQuality(formData) 
        : await updateZikrQuality({ ...formData, id: quality!.id })

      if (response.success) {
        router.push("/admin/rewards-qualities/qualities")
      } else {
        setError(response.message || `Failed to ${mode} quality`)
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreateZikrQualityRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-islamic">
          {mode === "create" ? "Add New Zikr Quality" : "Edit Zikr Quality"}
        </CardTitle>
        <CardDescription>
          {mode === "create" 
            ? "Create a new quality for a zikr" 
            : "Update the quality information"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Zikr Selection */}
          <div className="space-y-2">
            <Label htmlFor="zikrId" className="text-sm font-medium">
              Select Zikr <span className="text-destructive">*</span>
            </Label>
            <Select 
              value={formData.zikrId} 
              onValueChange={(value) => handleInputChange("zikrId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a zikr" />
              </SelectTrigger>
              <SelectContent>
                {zikrs.map((zikr) => (
                  <SelectItem key={zikr.id} value={zikr.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-islamic text-right" dir="rtl">
                        {zikr.textAr.slice(0, 50)}...
                      </span>
                      {zikr.titleEn && (
                        <span className="text-muted-foreground">({zikr.titleEn})</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quality Text */}
          <div className="space-y-2">
            <Label htmlFor="text" className="text-sm font-medium">
              Quality Text <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="text"
              value={formData.text}
              onChange={(e) => handleInputChange("text", e.target.value)}
              placeholder="Enter the quality description"
              rows={6}
              required
            />
          </div>

          {/* Preview */}
          {formData.text && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Preview</Label>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm">{formData.text}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading || !formData.zikrId || !formData.text.trim()}
            >
              {isLoading ? "Saving..." : mode === "create" ? "Create Quality" : "Update Quality"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push("/admin/rewards-qualities/qualities")} 
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
