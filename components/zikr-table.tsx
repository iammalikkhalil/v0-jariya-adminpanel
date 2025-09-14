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
import { CheckCircle, Edit, Search, Trash2, XCircle } from "lucide-react"
import { deleteZikr, type Zikr } from "@/lib/api/zikr"

interface ZikrTableProps {
  zikrs: Zikr[]
  onZikrDeleted: (id: string) => void
}

export function ZikrTable({ zikrs, onZikrDeleted }: ZikrTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredZikrs = zikrs.filter(
    (zikr) =>
      (zikr.textArabic || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (zikr.titleEn || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (zikr.titleUr || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (zikr.transliteration || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const response = await deleteZikr(id)
      if (response.success) {
        onZikrDeleted(id)
      } else {
        alert(response.message || "Failed to delete zikr")
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
            placeholder="Search zikrs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Link href="/admin/zikrs/add">
          <Button>Add New Zikr</Button>
        </Link>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">ID</TableHead>
              <TableHead>Arabic Text</TableHead>
              <TableHead>English Title</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredZikrs.length > 0 ? (
              filteredZikrs.map((zikr) => (
                <TableRow key={zikr.id}>
                  <TableCell className="font-mono text-xs">{zikr.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div className="font-islamic text-right max-w-xs truncate" dir="rtl">
                      {zikr.textArabic}
                    </div>
                    {zikr.transliteration && (
                      <div className="text-xs text-muted-foreground mt-1">{zikr.transliteration}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{zikr.titleEn || "-"}</div>
                    {zikr.titleUr && <div className="text-xs text-muted-foreground mt-1">{zikr.titleUr}</div>}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {zikr.isQuran && (
                        <Badge variant="secondary" className="text-xs">
                          Quran
                        </Badge>
                      )}
                      {zikr.isHadith && (
                        <Badge variant="outline" className="text-xs">
                          Hadith
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {zikr.verified ? (
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <XCircle className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/zikrs/edit/${zikr.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" disabled={deletingId === zikr.id}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Zikr</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this zikr? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(zikr.id)}
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
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No zikrs found matching your search." : "No zikrs found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredZikrs.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredZikrs.length} of {zikrs.length} zikrs
        </div>
      )}
    </div>
  )
}
