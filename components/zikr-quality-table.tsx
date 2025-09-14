"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Edit, Trash2, Plus } from "lucide-react"
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
import { deleteZikrQuality, type ZikrQuality } from "@/lib/api/quality"

interface ZikrQualityTableProps {
  qualities: ZikrQuality[]
  onQualityChanged: () => void
}

export function ZikrQualityTable({ qualities, onQualityChanged }: ZikrQualityTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredQualities = qualities.filter(
    (quality) =>
      quality.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quality.zikr?.textAr.includes(searchTerm) ||
      quality.zikr?.titleEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quality.zikr?.titleUr?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const response = await deleteZikrQuality(id)
      if (response.success) {
        onQualityChanged()
      } else {
        alert(response.message || "Failed to delete quality")
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert("Network error occurred")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-islamic">Zikr Qualities</CardTitle>
            <CardDescription>
              Manage qualities associated with zikrs
            </CardDescription>
          </div>
          <Link href="/admin/rewards-qualities/qualities/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Quality
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search qualities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Quality Text</TableHead>
                <TableHead>Associated Zikr</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQualities.length > 0 ? (
                filteredQualities.map((quality) => (
                  <TableRow key={quality.id}>
                    <TableCell className="font-mono text-xs">{quality.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm line-clamp-2">{quality.text}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {quality.zikr ? (
                        <div className="max-w-xs">
                          <div className="font-islamic text-sm text-right mb-1" dir="rtl">
                            {quality.zikr.textAr.slice(0, 50)}...
                          </div>
                          {quality.zikr.titleEn && (
                            <div className="text-xs text-muted-foreground">{quality.zikr.titleEn}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No zikr</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(quality.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={quality.isDeleted ? "destructive" : "default"}>
                        {quality.isDeleted ? "Deleted" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/rewards-qualities/qualities/view/${quality.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/rewards-qualities/qualities/edit/${quality.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              disabled={deletingId === quality.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Quality</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this quality? This action cannot be undone.
                                <div className="mt-2 p-2 bg-muted rounded text-sm">
                                  <strong>Quality:</strong> {quality.text.substring(0, 50)}...
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(quality.id)}
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
                    {searchTerm ? "No qualities found matching your search." : "No qualities found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <div>
            Showing {filteredQualities.length} of {qualities.length} qualities
          </div>
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSearchTerm("")}
            >
              Clear search
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
