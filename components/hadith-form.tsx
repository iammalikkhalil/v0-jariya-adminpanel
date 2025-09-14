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
import { createHadith, updateHadith, type Hadith, type CreateHadithRequest } from "@/lib/api/hadith"
import { getAllZikrs, type Zikr } from "@/lib/api/zikr"

interface HadithFormProps {
  hadith?: Hadith
  mode: "create" | "edit"
}

export function HadithForm({ hadith, mode }: HadithFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [zikrs, setZikrs] = useState<Zikr[]>([])

  const [formData, setFormData] = useState<CreateHadithRequest>({
    zikrId: hadith?.zikrId || "defaultZikrId", // Updated default value to be a non-empty string
    textAr: hadith?.textAr || "",
    reference: hadith?.reference || "",
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
      const response =
        mode === "create" ? await createHadith(formData) : await updateHadith({ ...formData, id: hadith!.id })

      if (response.success) {
        router.push("/admin/hadiths")
      } else {
        setError(response.message || `Failed to ${mode} hadith`)
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreateHadithRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-islamic">{mode === "create" ? "Add New Hadith" : "Edit Hadith"}</CardTitle>
        <CardDescription>
          {mode === "create" ? "Create a new hadith entry" : "Update the hadith information"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Associated Zikr - Optional */}
          <div className="space-y-2">
            <Label htmlFor="zikrId">Associated Zikr (Optional)</Label>
            <Select value={formData.zikrId} onValueChange={(value) => handleInputChange("zikrId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a zikr (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="defaultZikrId">No associated zikr</SelectItem>{" "}
                {/* Updated value to be a non-empty string */}
                {zikrs.map((zikr) => (
                  <SelectItem key={zikr.id} value={zikr.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-islamic text-right" dir="rtl">
                        {zikr.textAr.slice(0, 50)}...
                      </span>
                      {zikr.titleEn && <span className="text-muted-foreground">({zikr.titleEn})</span>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Arabic Text - Required */}
          <div className="space-y-2">
            <Label htmlFor="textAr" className="text-sm font-medium">
              Arabic Text <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="textAr"
              value={formData.textAr}
              onChange={(e) => handleInputChange("textAr", e.target.value)}
              placeholder="Enter the Arabic text of the hadith"
              className="font-islamic text-right"
              dir="rtl"
              rows={4}
              required
            />
          </div>

          {/* Reference - Required */}
          <div className="space-y-2">
            <Label htmlFor="reference" className="text-sm font-medium">
              Reference <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => handleInputChange("reference", e.target.value)}
              placeholder="e.g., Sahih Bukhari 1234, Sahih Muslim 5678"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading || !formData.textAr.trim() || !formData.reference.trim()}>
              {isLoading ? "Saving..." : mode === "create" ? "Create Hadith" : "Update Hadith"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/admin/hadiths")} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
