"use client"

import { useState } from "react"
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
import { Edit, Plus, Search, Trash2 } from "lucide-react"
import { deleteTag, createTag, updateTag, type Tag, type CreateTagRequest } from "@/lib/api/tag"

interface TagTableProps {
  tags: Tag[]
  onTagChanged: () => void
}

export function TagTable({ tags, onTagChanged }: TagTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<CreateTagRequest>({
    text: "",
  })

  const filteredTags = tags.filter((tag) => tag.text.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAdd = () => {
    setEditingTag(null)
    setFormData({ text: "" })
    setIsDialogOpen(true)
  }

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setFormData({ text: tag.text })
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formData.text.trim()) return

    setIsLoading(true)
    try {
      const response = editingTag ? await updateTag({ ...formData, id: editingTag.id }) : await createTag(formData)

      if (response.success) {
        setIsDialogOpen(false)
        onTagChanged()
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
      const response = await deleteTag(id)
      if (response.success) {
        onTagChanged()
      } else {
        alert(response.message || "Failed to delete tag")
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
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tag
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Tag Text</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTags.length > 0 ? (
              filteredTags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-mono text-xs">{tag.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <span className="font-medium">{tag.text}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(tag.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(tag)}>
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
                            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this tag? This will also remove all mappings to zikrs.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(tag.id)}
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
                  {searchTerm ? "No tags found matching your search." : "No tags found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTag ? "Edit Tag" : "Add New Tag"}</DialogTitle>
            <DialogDescription>
              {editingTag ? "Update the tag information" : "Create a new tag for organizing zikrs"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Tag Text</Label>
              <Input
                id="text"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="Enter tag name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading || !formData.text.trim()}>
              {isLoading ? "Saving..." : editingTag ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredTags.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredTags.length} of {tags.length} tags
        </div>
      )}
    </div>
  )
}
