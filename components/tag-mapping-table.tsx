"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Trash2 } from "lucide-react"
import { deleteTagMap, createTagMap, type TagMap, type CreateTagMapRequest } from "@/lib/api/tag"
import { getAllTags, type Tag } from "@/lib/api/tag"
import { getAllZikrs, type Zikr } from "@/lib/api/zikr"

interface TagMappingTableProps {
  tagMaps: TagMap[]
  onTagMapChanged: () => void
}

export function TagMappingTable({ tagMaps, onTagMapChanged }: TagMappingTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tags, setTags] = useState<Tag[]>([])
  const [zikrs, setZikrs] = useState<Zikr[]>([])

  const [formData, setFormData] = useState<CreateTagMapRequest>({
    tagId: "",
    zikrId: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      const [tagsResponse, zikrsResponse] = await Promise.all([getAllTags(), getAllZikrs()])
      if (tagsResponse.success && tagsResponse.data) setTags(tagsResponse.data)
      if (zikrsResponse.success && zikrsResponse.data) setZikrs(zikrsResponse.data)
    }
    fetchData()
  }, [])

  const filteredTagMaps = tagMaps.filter(
    (tagMap) =>
      tagMap.tag?.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tagMap.zikr?.textArabic.includes(searchTerm) ||
      tagMap.zikr?.titleEn?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAdd = () => {
    setFormData({ tagId: "", zikrId: "" })
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formData.tagId || !formData.zikrId) return

    setIsLoading(true)
    try {
      const response = await createTagMap(formData)
      if (response.success) {
        setIsDialogOpen(false)
        onTagMapChanged()
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
      const response = await deleteTagMap(id)
      if (response.success) {
        onTagMapChanged()
      } else {
        alert(response.message || "Failed to delete tag mapping")
      }
    } catch (error) {
      alert("Network error occurred")
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Add */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search mappings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Mapping
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tag</TableHead>
              <TableHead>Zikr</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTagMaps.length > 0 ? (
              filteredTagMaps.map((tagMap) => (
                <TableRow key={tagMap.id}>
                  <TableCell>
                    <Badge variant="secondary">{tagMap.tag?.text}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="font-islamic text-sm text-right mb-1" dir="rtl">
                        {tagMap.zikr?.textArabic}
                      </div>
                      {tagMap.zikr?.titleEn && (
                        <div className="text-xs text-muted-foreground">{tagMap.zikr.titleEn}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(tagMap.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Tag Mapping</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove this tag from the zikr?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(tagMap.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No mappings found matching your search." : "No tag mappings found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tag Mapping</DialogTitle>
            <DialogDescription>Associate a tag with a zikr for better organization</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tag">Select Tag</Label>
              <Select value={formData.tagId} onValueChange={(value) => setFormData({ ...formData, tagId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a tag" />
                </SelectTrigger>
                <SelectContent>
                  {tags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zikr">Select Zikr</Label>
              <Select value={formData.zikrId} onValueChange={(value) => setFormData({ ...formData, zikrId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a zikr" />
                </SelectTrigger>
                <SelectContent>
                  {zikrs.map((zikr) => (
                    <SelectItem key={zikr.id} value={zikr.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-islamic text-right" dir="rtl">
                          {zikr.textArabic.slice(0, 50)}...
                        </span>
                        {zikr.titleEn && <span className="text-muted-foreground">({zikr.titleEn})</span>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading || !formData.tagId || !formData.zikrId}>
              {isLoading ? "Creating..." : "Create Mapping"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredTagMaps.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredTagMaps.length} of {tagMaps.length} mappings
        </div>
      )}
    </div>
  )
}
