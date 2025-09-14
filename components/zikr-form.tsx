"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createZikr, updateZikr, type Zikr, type CreateZikrRequest } from "@/lib/api/zikr"

interface ZikrFormProps {
  zikr?: Zikr
  mode: "create" | "edit"
}

export function ZikrForm({ zikr, mode }: ZikrFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<CreateZikrRequest>({
    textArabic: zikr?.textArabic || "",
    titleEn: zikr?.titleEn || "",
    titleUr: zikr?.titleUr || "",
    transliteration: zikr?.transliteration || "",
    quantityNotes: zikr?.quantityNotes || "",
    sourceNotes: zikr?.sourceNotes || "",
    isQuran: zikr?.isQuran || false,
    isHadith: zikr?.isHadith || false,
    verified: zikr?.verified || false,
    verifiedByName: zikr?.verifiedByName || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = mode === "create" ? await createZikr(formData) : await updateZikr({ ...formData, id: zikr!.id })

      if (response.success) {
        router.push("/admin/zikrs")
      } else {
        setError(response.message || `Failed to ${mode} zikr`)
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreateZikrRequest, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-islamic">{mode === "create" ? "Add New Zikr" : "Edit Zikr"}</CardTitle>
        <CardDescription>
          {mode === "create" ? "Create a new zikr entry in the collection" : "Update the zikr information"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Arabic Text - Required */}
          <div className="space-y-2">
            <Label htmlFor="textArabic" className="text-sm font-medium">
              Arabic Text <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="textArabic"
              value={formData.textArabic}
              onChange={(e) => handleInputChange("textArabic", e.target.value)}
              placeholder="Enter the Arabic text of the zikr"
              className="font-islamic text-right"
              dir="rtl"
              rows={3}
              required
            />
          </div>

          {/* Titles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titleEn">English Title</Label>
              <Input
                id="titleEn"
                value={formData.titleEn}
                onChange={(e) => handleInputChange("titleEn", e.target.value)}
                placeholder="English title (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleUr">Urdu Title</Label>
              <Input
                id="titleUr"
                value={formData.titleUr}
                onChange={(e) => handleInputChange("titleUr", e.target.value)}
                placeholder="Urdu title (optional)"
              />
            </div>
          </div>

          {/* Transliteration */}
          <div className="space-y-2">
            <Label htmlFor="transliteration">Transliteration</Label>
            <Input
              id="transliteration"
              value={formData.transliteration}
              onChange={(e) => handleInputChange("transliteration", e.target.value)}
              placeholder="Phonetic transliteration (optional)"
            />
          </div>

          {/* Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantityNotes">Quantity Notes</Label>
              <Textarea
                id="quantityNotes"
                value={formData.quantityNotes}
                onChange={(e) => handleInputChange("quantityNotes", e.target.value)}
                placeholder="How many times to recite (optional)"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceNotes">Source Notes</Label>
              <Textarea
                id="sourceNotes"
                value={formData.sourceNotes}
                onChange={(e) => handleInputChange("sourceNotes", e.target.value)}
                placeholder="Source reference (optional)"
                rows={2}
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isQuran"
                checked={formData.isQuran}
                onCheckedChange={(checked) => handleInputChange("isQuran", checked as boolean)}
              />
              <Label htmlFor="isQuran">From Quran</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isHadith"
                checked={formData.isHadith}
                onCheckedChange={(checked) => handleInputChange("isHadith", checked as boolean)}
              />
              <Label htmlFor="isHadith">From Hadith</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="verified"
                checked={formData.verified}
                onCheckedChange={(checked) => handleInputChange("verified", checked as boolean)}
              />
              <Label htmlFor="verified">Verified</Label>
            </div>
          </div>

          {/* Verified By Name */}
          {formData.verified && (
            <div className="space-y-2">
              <Label htmlFor="verifiedByName">Verified By</Label>
              <Input
                id="verifiedByName"
                value={formData.verifiedByName}
                onChange={(e) => handleInputChange("verifiedByName", e.target.value)}
                placeholder="Name of the person who verified this zikr"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading || !formData.textArabic.trim()}>
              {isLoading ? "Saving..." : mode === "create" ? "Create Zikr" : "Update Zikr"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/admin/zikrs")} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
