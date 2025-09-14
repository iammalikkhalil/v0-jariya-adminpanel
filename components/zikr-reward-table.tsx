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
import { deleteZikrReward, type ZikrReward } from "@/lib/api/reward"

interface ZikrRewardTableProps {
  rewards: ZikrReward[]
  onRewardChanged: () => void
}

export function ZikrRewardTable({ rewards, onRewardChanged }: ZikrRewardTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredRewards = rewards.filter(
    (reward) =>
      reward.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reward.zikr?.textAr.includes(searchTerm) ||
      reward.zikr?.titleEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reward.zikr?.titleUr?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const response = await deleteZikrReward(id)
      if (response.success) {
        onRewardChanged()
      } else {
        alert(response.message || "Failed to delete reward")
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
            <CardTitle className="font-islamic">Zikr Rewards</CardTitle>
            <CardDescription>
              Manage rewards associated with zikrs
            </CardDescription>
          </div>
          <Link href="/admin/rewards-qualities/rewards/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Reward
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
              placeholder="Search rewards..."
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
                <TableHead>Reward Text</TableHead>
                <TableHead>Associated Zikr</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRewards.length > 0 ? (
                filteredRewards.map((reward) => (
                  <TableRow key={reward.id}>
                    <TableCell className="font-mono text-xs">{reward.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm line-clamp-2">{reward.text}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {reward.zikr ? (
                        <div className="max-w-xs">
                          <div className="font-islamic text-sm text-right mb-1" dir="rtl">
                            {reward.zikr.textAr.slice(0, 50)}...
                          </div>
                          {reward.zikr.titleEn && (
                            <div className="text-xs text-muted-foreground">{reward.zikr.titleEn}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No zikr</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(reward.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={reward.isDeleted ? "destructive" : "default"}>
                        {reward.isDeleted ? "Deleted" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/rewards-qualities/rewards/view/${reward.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/rewards-qualities/rewards/edit/${reward.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              disabled={deletingId === reward.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Reward</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this reward? This action cannot be undone.
                                <div className="mt-2 p-2 bg-muted rounded text-sm">
                                  <strong>Reward:</strong> {reward.text.substring(0, 50)}...
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(reward.id)}
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
                    {searchTerm ? "No rewards found matching your search." : "No rewards found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <div>
            Showing {filteredRewards.length} of {rewards.length} rewards
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
