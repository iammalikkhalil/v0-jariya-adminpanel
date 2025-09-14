"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { HadithTranslationView } from "@/components/hadith-translation-view"
import { getHadithTranslationById, type HadithTranslation } from "@/lib/api/translation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
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
import { deleteHadithTranslation } from "@/lib/api/translation"

export default function HadithTranslationViewPage() {
  const params = useParams()
  const router = useRouter()
  const [translation, setTranslation] = useState<HadithTranslation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const translationId = params.id as string

  useEffect(() => {
    const fetchTranslation = async () => {
      if (!translationId) return

      try {
        setIsLoading(true)
        const response = await getHadithTranslationById(translationId)
        
        if (response.success && response.data) {
          setTranslation(response.data)
        } else {
          setError(response.message || "Failed to load translation")
        }
      } catch (err) {
        setError("Network error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTranslation()
  }, [translationId])

  const handleDelete = async () => {
    if (!translation) return

    setIsDeleting(true)
    try {
      const response = await deleteHadithTranslation(translation.id)
      if (response.success) {
        router.push("/admin/translations/hadith")
      } else {
        alert(response.message || "Failed to delete translation")
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert("Network error occurred")
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading translation details...</p>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    )
  }

  if (error || !translation) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-destructive mb-2">Error</h1>
              <p className="text-muted-foreground mb-4">
                {error || "Translation not found"}
              </p>
              <Button onClick={() => router.push("/admin/translations/hadith")}>
                Go to Translations List
              </Button>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-islamic text-primary">Translation Details</h1>
                <p className="text-muted-foreground">View and manage translation information</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Link href={`/admin/translations/hadith/edit/${translation.id}`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Translation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this translation? This action cannot be undone.
                      <div className="mt-2 p-2 bg-muted rounded text-sm">
                        <strong>Language:</strong> {translation.languageCode}
                        <br />
                        <strong>Translation:</strong> {translation.translation.substring(0, 50)}...
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Translation Details */}
          <HadithTranslationView translation={translation} />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
