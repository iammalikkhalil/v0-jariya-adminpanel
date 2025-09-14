"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Edit, Plus, Search, Trash2, BookOpen } from "lucide-react"
import { deleteHadith, type Hadith } from "@/lib/api/hadith"

interface HadithTableProps {
  hadiths: Hadith[]
  onHadithDeleted: (id: string) => void
}

export function HadithTable({ hadiths, onHadithDeleted }: HadithTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredHadiths = hadiths.filter(
    (hadith) =>
      hadith.textArabic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hadith.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hadith.zikr?.textArabic.includes(searchTerm) ||
      hadith.zikr?.titleEn?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const response = await deleteHadith(id)
      if (response.success) {
        onHadithDeleted(id)
      } else {
        alert(response.message || "Failed to delete hadith")
      }
    } catch (error) {
      alert("Network error occurred")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search hadiths..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Link href="/admin/hadiths/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Hadith
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">ID</TableHead>
              <TableHead>Arabic Text</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Associated Zikr</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHadiths.length > 0 ? (
              filteredHadiths.map((hadith) => (
                <TableRow key={hadith.id}>
                  <TableCell className="font-mono text-xs">{hadith.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div className="font-islamic text-right max-w-xs truncate" dir="rtl">
                      {hadith.textArabic}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{hadith.reference}</div>
                  </TableCell>
                  <TableCell>
                    {hadith.zikr ? (
                      <div className="max-w-xs">
                        <div className="font-islamic text-sm text-right mb-1" dir="rtl">
                          {hadith.zikr.textArabic.slice(0, 50)}...
                        </div>
                        {hadith.zikr.titleEn && (
                          <div className="text-xs text-muted-foreground">{hadith.zikr.titleEn}</div>
                        )}
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        <BookOpen className="h-3 w-3 mr-1" />
                        No Zikr
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/hadiths/edit/${hadith.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" disabled={deletingId === hadith.id}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Hadith</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this hadith? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(hadith.id)}
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
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No hadiths found matching your search." : "No hadiths found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredHadiths.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredHadiths.length} of {hadiths.length} hadiths
        </div>
      )}
    </div>
  )
}
