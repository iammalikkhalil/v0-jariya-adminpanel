"use client"

import { useEffect, useState, forwardRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { ArrowLeft, Trash2, Edit } from "lucide-react"
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
import { getQuranLine, deleteQuranLine } from "@/lib/api/quran"

// Make Button compatible with refs
export const RefButton = forwardRef<HTMLButtonElement, React.ComponentProps<"button">>(
  (props, ref) => <button ref={ref} {...props} className={`btn ${props.className || ""}`}>{props.children}</button>
)

interface QuranLine {
  pageNumber: number
  lineNumber: number
  textAr: string
  createdAt: string
  updatedAt: string
}

export default function ViewQuranLinePage() {
  const params = useParams()
  const router = useRouter()
  const pageNumber = Number(params.pageNumber)
  const lineNumber = Number(params.lineNumber)

  const [line, setLine] = useState<QuranLine | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchLine = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getQuranLine(pageNumber, lineNumber)
        if (res.success && res.data) {
          setLine(res.data)
        } else {
          setError(res.message || "Line not found")
        }
      } catch {
        setError("Network error occurred")
      } finally {
        setLoading(false)
      }
    }
    fetchLine()
  }, [pageNumber, lineNumber])

  const handleDelete = async () => {
    if (!line) return
    setIsDeleting(true)
    try {
      const res = await deleteQuranLine(line.pageNumber, line.lineNumber)
      if (res.success) router.push("/admin/quran")
      else alert(res.message || "Failed to delete line")
    } catch (err) {
      console.error(err)
      alert("Network error occurred")
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading Quran line details...</p>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    )
  }

  if (error || !line) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="space-y-6 text-center py-12">
            <RefButton onClick={() => router.back()} className="btn-outline mb-4 flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </RefButton>
            <h1 className="text-2xl font-bold text-destructive mb-2">Error</h1>
            <p className="text-muted-foreground mb-4">{error || "Line not found"}</p>
            <RefButton onClick={() => router.push("/admin/quran")}>Go to Quran List</RefButton>
          </div>
        </AdminLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <AdminLayout>
        <div className="space-y-6 max-w-2xl mx-auto p-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <RefButton onClick={() => router.back()} className="btn-outline flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </RefButton>
              <div>
                <h1 className="text-3xl font-islamic text-primary">Quran Line Details</h1>
                <p className="text-muted-foreground">View, edit or manage Quran line information</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <RefButton onClick={() => router.push(`/admin/quran/edit/${line.pageNumber}/${line.lineNumber}`)} className="btn-primary flex items-center gap-2">
                <Edit className="w-4 h-4" /> Edit
              </RefButton>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <RefButton disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> {isDeleting ? "Deleting..." : "Delete"}
                  </RefButton>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Quran Line</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this line? This action cannot be undone.
                      <div className="mt-2 p-2 bg-muted rounded text-sm">
                        <strong>Page:</strong> {line.pageNumber}<br/>
                        <strong>Line:</strong> {line.lineNumber}<br/>
                        <strong>Text:</strong> {line.textAr.substring(0, 50)}{line.textAr.length > 50 && "..."}
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Line Details */}
          <div className="p-6 bg-white shadow rounded-lg space-y-2">
            <div><strong>Page:</strong> {line.pageNumber}</div>
            <div><strong>Line:</strong> {line.lineNumber}</div>
            <div>
              <strong>Text (Arabic):</strong>{" "}
              <span className="font-arabic text-2xl">{line.textAr}</span>
            </div>
            <div><strong>Created At:</strong> {new Date(line.createdAt).toLocaleString()}</div>
            <div><strong>Updated At:</strong> {new Date(line.updatedAt).toLocaleString()}</div>
          </div>
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}