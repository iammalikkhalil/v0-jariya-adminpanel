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
import { createZikrTranslation, updateZikrTranslation, type ZikrTranslation, type CreateZikrTranslationRequest } from "@/lib/api/translation"
import { getAllZikrs, type Zikr } from "@/lib/api/zikr"

interface ZikrTranslationFormProps {
  translation?: ZikrTranslation
  mode: "create" | "edit"
}

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ur", name: "Urdu" },
  { code: "ar", name: "Arabic" },
  { code: "tr", name: "Turkish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "id", name: "Indonesian" },
  { code: "ms", name: "Malay" },
  { code: "bn", name: "Bengali" },
]

export function ZikrTranslationForm({ translation, mode }: ZikrTranslationFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [zikrs, setZikrs] = useState<Zikr[]>([])

  const [formData, setFormData] = useState<CreateZikrTranslationRequest>({
    zikrId: translation?.zikrId || "",
    languageCode: translation?.languageCode || "",
    translation: translation?.translation || "",
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
        ? await createZikrTranslation(formData) 
        : await updateZikrTranslation({ ...formData, id: translation!.id })

      if (response.success) {
        router.push("/admin/translations/zikr")
      } else {
        setError(response.message || `Failed to ${mode} translation`)
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreateZikrTranslationRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getLanguageName = (code: string) => {
    return LANGUAGES.find((lang) => lang.code === code)?.name || code
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-islamic">
          {mode === "create" ? "Add New Zikr Translation" : "Edit Zikr Translation"}
        </CardTitle>
        <CardDescription>
          {mode === "create" 
            ? "Create a new translation for a zikr" 
            : "Update the translation information"
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

          {/* Language Selection */}
          <div className="space-y-2">
            <Label htmlFor="languageCode" className="text-sm font-medium">
              Language <span className="text-destructive">*</span>
            </Label>
            <Select 
              value={formData.languageCode} 
              onValueChange={(value) => handleInputChange("languageCode", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name} ({lang.code.toUpperCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Translation Text */}
          <div className="space-y-2">
            <Label htmlFor="translation" className="text-sm font-medium">
              Translation <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="translation"
              value={formData.translation}
              onChange={(e) => handleInputChange("translation", e.target.value)}
              placeholder="Enter the translation text"
              rows={6}
              required
            />
          </div>

          {/* Preview */}
          {formData.translation && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Preview</Label>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm">{formData.translation}</p>
                {formData.languageCode && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Language: {getLanguageName(formData.languageCode)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading || !formData.zikrId || !formData.languageCode || !formData.translation.trim()}
            >
              {isLoading ? "Saving..." : mode === "create" ? "Create Translation" : "Update Translation"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push("/admin/translations/zikr")} 
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
