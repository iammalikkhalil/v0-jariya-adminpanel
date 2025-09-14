"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
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
import { Edit, Plus, Search, Trash2, Star } from "lucide-react"
import { getAllCollections, deleteCollection, type Collection } from "@/lib/api/collection"

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchCollections = async () => {
    try {
      const response = await getAllCollections()
      if (response.success && response.data) {
        setCollections(response.data)
      } else {
        setError(response.message || "Failed to load collections")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCollections()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteCollection(id)
      if (response.success) {
        fetchCollections()
      } else {
        alert(response.message || "Failed to delete collection")
      }
    } catch (error) {
      alert("Network error occurred")
    }
  }

  const filteredCollections = collections.filter(
    (collection) =>
      collection.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-islamic text-primary mb-2">All Collections</h1>
              <p className="text-muted-foreground">Manage zikr collections</p>
            </div>
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    )
  }

  if (error) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-islamic text-primary mb-2">All Collections</h1>
              <p className="text-muted-foreground">Manage zikr collections</p>
            </div>
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Error: {error}</p>
              <button onClick={fetchCollections} className="text-primary hover:underline">
                Try again
              </button>
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
          <div>
            <h1 className="text-3xl font-islamic text-primary mb-2">All Collections</h1>
            <p className="text-muted-foreground">Manage zikr collections</p>
          </div>

          <div className="space-y-4">
            {/* Search and Add */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search collections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Link href="/admin/collections/add">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Collection
                </Button>
              </Link>
            </div>

            {/* Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCollections.length > 0 ? (
                    filteredCollections.map((collection) => (
                      <TableRow key={collection.id}>
                        <TableCell className="font-mono text-xs">{collection.id.slice(0, 8)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{collection.text}</span>
                            {collection.featured && <Star className="h-4 w-4 text-secondary" />}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">{collection.description || "-"}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={collection.featured ? "default" : "secondary"}>
                            {collection.featured ? "Featured" : "Regular"}
                          </Badge>
                        </TableCell>
                        <TableCell>{collection.order}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/collections/edit/${collection.id}`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Collection</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this collection? This will also remove all zikr
                                    mappings.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(collection.id)}
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
                        {searchTerm ? "No collections found matching your search." : "No collections found."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {filteredCollections.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Showing {filteredCollections.length} of {collections.length} collections
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
