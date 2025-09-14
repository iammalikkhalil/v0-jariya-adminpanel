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
import { Edit, Eye, Plus, Search, Trash2 } from "lucide-react"
import { deleteCollectionMap, type CollectionMap } from "@/lib/api/collection"

interface EnhancedCollectionMap extends Omit<CollectionMap, 'collection' | 'zikr'> {
  collection?: {
    id: string
    text: string
  }
  zikr?: {
    id: string
    textAr: string
    titleEn?: string
  }
}

interface CollectionMapTableProps {
  maps: EnhancedCollectionMap[]
  onMapDeleted: (id: string) => void
  onRefresh?: () => void
  isLoading?: boolean
}

export function CollectionMapTable({ maps, onMapDeleted, onRefresh, isLoading }: CollectionMapTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMaps = maps.filter((map) => {
    const searchStr = searchTerm.toLowerCase()
    return (
      map.id.toLowerCase().includes(searchStr) ||
      map.collection?.text.toLowerCase().includes(searchStr) ||
      map.zikr?.textAr.toLowerCase().includes(searchStr) ||
      map.zikr?.titleEn?.toLowerCase().includes(searchStr)
    )
  })

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteCollectionMap(id)
      if (response.success) {
        onMapDeleted(id)
      }
    } catch (error) {
      console.error("Failed to delete collection map:", error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      {/* Search and Add */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search maps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Link href="/admin/collections/mapping/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Mapping
          </Button>
        </Link>
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh}>
            Refresh
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Collection</TableHead>
              <TableHead>Zikr</TableHead>
              <TableHead>Count Type</TableHead>
              <TableHead>Count Value</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaps.length > 0 ? (
              filteredMaps.map((map) => (
                <TableRow key={map.id}>
                  <TableCell className="font-mono text-xs">{map.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate font-medium">
                      {map.collection?.text || map.collectionId}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-arabic">{map.zikr?.textAr}</div>
                      {map.zikr?.titleEn && (
                        <div className="text-xs text-muted-foreground">{map.zikr.titleEn}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={map.countType?.toUpperCase() === "DOWN" ? "destructive" : "default"}>
                      {map.countType || "Up"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {typeof map.countValue === 'number' ? map.countValue : '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-muted-foreground">
                      {typeof map.orderIndex === 'number' ? map.orderIndex : '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/collections/mapping/view/${map.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/collections/mapping/edit/${map.id}`}>
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
                            <AlertDialogTitle>Delete Collection Map</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this collection mapping?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(map.id)}
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
                <TableCell colSpan={7} className="h-24 text-center">
                  No collection maps found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
