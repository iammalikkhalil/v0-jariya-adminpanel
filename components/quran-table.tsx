"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Trash2, Eye, Edit, Download, RefreshCw, Search } from "lucide-react"
import { deleteQuranLine, type QuranLine } from "@/lib/api/quran"

interface QuranTableProps {
  lines: QuranLine[]
  pageNumber: number
  setPageNumber: (page: number) => void
  onLineDeleted: (line: QuranLine) => void
  onRefresh?: () => void
  isLoading?: boolean
  error?: string
}


export function QuranTable({ lines, pageNumber, setPageNumber, onLineDeleted, onRefresh, isLoading = false, error }: QuranTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [deletingLine, setDeletingLine] = useState<QuranLine | null>(null)

  const filteredLines = useMemo(() => {
    return lines.filter(line =>
      !searchTerm ||
      (line.textAr || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [lines, searchTerm])

  const handleDelete = async (line: QuranLine) => {
    setDeletingLine(line)
    try {
      const res = await deleteQuranLine(line.pageNumber, line.lineNumber)
      if (res.success) onLineDeleted(line)
      else alert(res.message || "Failed to delete line")
    } catch (err) {
      alert("Network error occurred")
    } finally {
      setDeletingLine(null)
    }
  }

  const exportToCSV = () => {
    const headers = ['Page', 'Line', 'Arabic Text', 'Created At', 'Updated At']
    const csvData = [
      headers,
      ...filteredLines.map(l => [
        l.pageNumber,
        l.lineNumber,
        l.textAr,
        new Date(l.createdAt).toLocaleString(),
        new Date(l.updatedAt).toLocaleString()
      ])
    ]
    const csvContent = csvData.map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `quran-lines-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Arabic text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex gap-2">
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
          <Button variant="outline" onClick={exportToCSV} disabled={filteredLines.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link href="/admin/quran/add">
            <Button>Add New Line</Button>
          </Link>
        </div>
      </div>

      {error && <div className="text-destructive">{error}</div>}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page</TableHead>
              <TableHead>Line</TableHead>
              <TableHead>Text (Arabic)</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLines.length > 0 ? (
              filteredLines.map(line => (
                <TableRow key={line.lineNumber} className="hover:bg-muted/50">
                  <TableCell>{line.pageNumber}</TableCell>
                  <TableCell>{line.lineNumber}</TableCell>
                  <TableCell className="font-islamic text-right">{line.textAr}</TableCell>
                  <TableCell>{new Date(line.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{new Date(line.updatedAt).toLocaleString()}</TableCell>
                  <TableCell className="flex gap-2">
                    <Link href={`/admin/quran/view/${line.pageNumber}/${line.lineNumber}`}>
                      <Button variant="outline" size="sm" title="View"><Eye className="h-4 w-4" /></Button>
                    </Link>
                    <Link href={`/admin/quran/edit/${line.pageNumber}/${line.lineNumber}`}>
                      <Button variant="outline" size="sm" title="Edit"><Edit className="h-4 w-4" /></Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" disabled={deletingLine?.lineNumber === line.lineNumber} title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Line</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this Quran line? This action cannot be undone.
                            <div className="mt-2 p-2 bg-muted rounded text-sm">
                              <strong>Arabic:</strong> {line.textAr.substring(0, 50)}...
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => handleDelete(line)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No lines found matching your search." : "No lines found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}