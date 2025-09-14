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
import { createHadithTranslation, updateHadithTranslation, type HadithTranslation, type CreateHadithTranslationRequest } from "@/lib/api/translation"
import { getAllHadiths, type Hadith } from "@/lib/api/hadith"

interface HadithTranslationFormProps {
  translation?: HadithTranslation
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

export function HadithTranslationForm({ translation, mode }: HadithTranslationFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [hadiths, setHadiths] = useState<Hadith[]>([])

  const [formData, setFormData] = useState<CreateHadithTranslationRequest>({
    hadithId: translation?.hadithId || "",
    languageCode: translation?.languageCode || "",
    translation: translation?.translation || "",
  })

  useEffect(() => {
    const fetchHadiths = async () => {
      const response = await getAllHadiths()
      if (response.success && response.data) {
        setHadiths(response.data)
      }
    }
    fetchHadiths()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = mode === "create" 
        ? await createHadithTranslation(formData) 
        : await updateHadithTranslation({ ...formData, id: translation!.id })

      if (response.success) {
        router.push("/admin/translations/hadith")
      } else {
        setError(response.message || `Failed to ${mode} translation`)
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreateHadithTranslationRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getLanguageName = (code: string) => {
    return LANGUAGES.find((lang) => lang.code === code)?.name || code
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-islamic">
          {mode === "create" ? "Add New Hadith Translation" : "Edit Hadith Translation"}
        </CardTitle>
        <CardDescription>
          {mode === "create" 
            ? "Create a new translation for a hadith" 
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

          {/* Hadith Selection */}
          <div className="space-y-2">
            <Label htmlFor="hadithId" className="text-sm font-medium">
              Select Hadith <span className="text-destructive">*</span>
            </Label>
            <Select 
              value={formData.hadithId} 
              onValueChange={(value) => handleInputChange("hadithId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a hadith" />
              </SelectTrigger>
              <SelectContent>
                {hadiths.map((hadith) => (
                  <SelectItem key={hadith.id} value={hadith.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-islamic text-right" dir="rtl">
                        {hadith.textAr.slice(0, 50)}...
                      </span>
                      {hadith.reference && (
                        <span className="text-muted-foreground">({hadith.reference})</span>
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
              disabled={isLoading || !formData.hadithId || !formData.languageCode || !formData.translation.trim()}
            >
              {isLoading ? "Saving..." : mode === "create" ? "Create Translation" : "Update Translation"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push("/admin/translations/hadith")} 
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
