"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Plus, Search, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import {
  deleteHadithTranslation,
  createHadithTranslation,
  updateHadithTranslation,
  type HadithTranslation,
  type CreateHadithTranslationRequest,
} from "@/lib/api/translation"

interface HadithTranslationTableProps {
  translations: HadithTranslation[]
  onTranslationChanged: () => void
}

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ur", name: "Urdu" },
  { code: "ar", name: "Arabic" },
  { code: "tr", name: "Turkish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
]

export function HadithTranslationTable({ translations, onTranslationChanged }: HadithTranslationTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTranslation, setEditingTranslation] = useState<HadithTranslation | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<CreateHadithTranslationRequest>({
    hadithId: "",
    languageCode: "",
    translation: "",
  })

  const filteredTranslations = translations.filter(
    (translation) =>
      translation.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      translation.languageCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      translation.hadith?.textAr.includes(searchTerm) ||
      translation.hadith?.reference?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAdd = () => {
    setEditingTranslation(null)
    setFormData({ hadithId: "", languageCode: "", translation: "" })
    setIsDialogOpen(true)
  }

  const handleEdit = (translation: HadithTranslation) => {
    setEditingTranslation(translation)
    setFormData({
      hadithId: translation.hadithId,
      languageCode: translation.languageCode,
      translation: translation.translation,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formData.hadithId || !formData.languageCode || !formData.translation.trim()) return

    setIsLoading(true)
    try {
      const response = editingTranslation
        ? await updateHadithTranslation({ ...formData, id: editingTranslation.id })
        : await createHadithTranslation(formData)

      if (response.success) {
        setIsDialogOpen(false)
        onTranslationChanged()
      } else {
        alert(response.message || "Operation failed")
      }
    } catch (error) {
      alert("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteHadithTranslation(id)
      if (response.success) {
        onTranslationChanged()
      } else {
        alert(response.message || "Failed to delete translation")
      }
    } catch (error) {
      alert("Network error occurred")
    }
  }

  const getLanguageName = (code: string) => {
    return LANGUAGES.find((lang) => lang.code === code)?.name || code
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search translations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hadith</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Translation</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTranslations.length > 0 ? (
              filteredTranslations.map((translation) => (
                <TableRow key={translation.id}>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="font-islamic text-sm text-right mb-1" dir="rtl">
                        {translation.hadith?.textAr}
                      </div>
                      {translation.hadith?.reference && (
                        <div className="text-xs text-muted-foreground">{translation.hadith.reference}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getLanguageName(translation.languageCode)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md truncate">{translation.translation}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/translations/hadith/view/${translation.id}`}>
                        <Button variant="outline" size="sm" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(translation)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Translation</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this translation? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(translation.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No translations found matching your search." : "No translations found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingTranslation ? "Edit Translation" : "Add New Translation"}</DialogTitle>
            <DialogDescription>
              {editingTranslation ? "Update the translation information" : "Create a new translation for a hadith"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hadithId">Hadith ID</Label>
              <Input
                id="hadithId"
                value={formData.hadithId}
                onChange={(e) => setFormData({ ...formData, hadithId: e.target.value })}
                placeholder="Enter hadith ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="languageCode">Language</Label>
              <Select
                value={formData.languageCode}
                onValueChange={(value) => setFormData({ ...formData, languageCode: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="translation">Translation</Label>
              <Textarea
                id="translation"
                value={formData.translation}
                onChange={(e) => setFormData({ ...formData, translation: e.target.value })}
                placeholder="Enter the translation"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !formData.hadithId || !formData.languageCode || !formData.translation.trim()}
            >
              {isLoading ? "Saving..." : editingTranslation ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredTranslations.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredTranslations.length} of {translations.length} translations
        </div>
      )}
    </div>
  )
}
