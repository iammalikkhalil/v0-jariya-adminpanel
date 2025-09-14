"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Edit, ArrowLeft, Trash2 } from "lucide-react"
import { Collection, deleteCollectionMap, getCollectionById, getCollectionMapById, type CollectionMap } from "@/lib/api/collection"
import { getZikrById, Zikr } from "@/lib/api/zikr"

interface Props {
  params: {
    id: string
  }
}

export default function ViewCollectionMapPage({ params }: Props) {
  const router = useRouter()
  const [map, setMap] = useState<CollectionMap | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [collection, setCollection] = useState<Collection | null>(null)
  const [zikr, setZikr] = useState<Zikr | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the map first
        const mapResponse = await getCollectionMapById(params.id)
        if (!mapResponse.success || !mapResponse.data) {
          throw new Error(mapResponse.message || "Failed to load collection map")
        }
        console.log("[v0] Loaded map data:", mapResponse.data)
        setMap(mapResponse.data)

        // Fetch collection and zikr data in parallel
        const [collectionRes, zikrRes] = await Promise.all([
          getCollectionById(mapResponse.data.collectionId),
          getZikrById(mapResponse.data.zikrId)
        ])

        if (collectionRes.success && collectionRes.data) {
          console.log("[v0] Loaded collection data:", collectionRes.data)
          setCollection(collectionRes.data)
        }

        if (zikrRes.success && zikrRes.data) {
          console.log("[v0] Loaded zikr data:", zikrRes.data)
          setZikr(zikrRes.data)
        }
      } catch (err) {
        console.error("[v0] Error loading data:", err)
        setError(err instanceof Error ? err.message : "Network error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleDelete = async () => {
    try {
      const response = await deleteCollectionMap(params.id)
      if (response.success) {
        router.push("/admin/collections/mapping")
      }
    } catch (err) {
      setError("Failed to delete collection map")
    }
  }

  if (error) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="p-4 text-red-500">{error}</div>
        </AdminLayout>
      </AuthGuard>
    )
  }

  if (isLoading || !map) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div>Loading...</div>
        </AdminLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-islamic text-primary">Collection Map Details</h1>
              <p className="text-muted-foreground">View collection and zikr mapping details</p>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/admin/collections/mapping">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>

              <Link href={`/admin/collections/mapping/edit/${map.id}`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
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
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Collection Details */}
          <Card>
            <CardHeader>
              <CardTitle>Collection Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-sm font-medium mb-1">Collection Text</div>
                  <div className="font-medium">{collection?.text || "Loading..."}</div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1">Collection ID</div>
                  <div className="font-mono text-sm">{map.collectionId}</div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-sm font-medium mb-1">Featured</div>
                  <Badge variant={collection?.isFeatured ? "default" : "secondary"}>
                    {collection?.isFeatured ? "Yes" : "No"}
                  </Badge>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1">Order Index</div>
                  <div className="font-medium">{collection?.orderIndex || 0}</div>
                </div>
              </div>

              {collection?.description && (
                <div>
                  <div className="text-sm font-medium mb-1">Description</div>
                  <div className="text-muted-foreground">{collection.description}</div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-sm font-medium mb-1">Created At</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(collection?.createdAt || "").toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1">Updated At</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(collection?.updatedAt || "").toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1">Status</div>
                  <Badge variant={collection?.isDeleted ? "destructive" : "default"}>
                    {collection?.isDeleted ? "Deleted" : "Active"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Zikr Details */}
          <Card>
            <CardHeader>
              <CardTitle>Zikr Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <div className="text-sm font-medium mb-1">Arabic Text</div>
                <div className="text-2xl font-arabic">{zikr?.textAr || "Loading..."}</div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {zikr?.titleEn && (
                  <div>
                    <div className="text-sm font-medium mb-1">English Title</div>
                    <div className="font-medium">{zikr.titleEn}</div>
                  </div>
                )}

                {zikr?.titleUr && (
                  <div>
                    <div className="text-sm font-medium mb-1">Urdu Title</div>
                    <div className="font-medium font-urdu">{zikr.titleUr}</div>
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-sm font-medium mb-1">Source</div>
                  <div className="space-x-2">
                    <Badge variant={zikr?.isQuran ? "default" : "secondary"}>Quran</Badge>
                    <Badge variant={zikr?.isHadith ? "default" : "secondary"}>Hadith</Badge>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1">Verification</div>
                  <Badge variant={zikr?.isVerified ? "default" : "secondary"}>
                    {zikr?.isVerified ? "Verified" : "Not Verified"}
                  </Badge>
                </div>
              </div>

              {(zikr?.quantityNotes || zikr?.sourceNotes) && (
                <div className="grid gap-4 md:grid-cols-2">
                  {zikr.quantityNotes && (
                    <div>
                      <div className="text-sm font-medium mb-1">Quantity Notes</div>
                      <div className="text-muted-foreground">{zikr.quantityNotes}</div>
                    </div>
                  )}

                  {zikr.sourceNotes && (
                    <div>
                      <div className="text-sm font-medium mb-1">Source Notes</div>
                      <div className="text-muted-foreground">{zikr.sourceNotes}</div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-sm font-medium mb-1">Created At</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(zikr?.createdAt || "").toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1">Updated At</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(zikr?.updatedAt || "").toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1">Status</div>
                  <Badge variant={zikr?.isDeleted ? "destructive" : "default"}>
                    {zikr?.isDeleted ? "Deleted" : "Active"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mapping Details */}
          <Card>
            <CardHeader>
              <CardTitle>Mapping Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-sm font-medium mb-1">Count Type</div>
                  <Badge variant={map.countType?.toLowerCase() === "down" ? "destructive" : "default"}>
                    {map.countType || "Up"}
                  </Badge>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1">Count Value</div>
                  <div className="font-medium">{map.countValue || 0}</div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1">Order Index</div>
                  <div className="font-medium text-muted-foreground">{map.orderIndex || 0}</div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-sm font-medium mb-1">Created At</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(map.createdAt).toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1">Updated At</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(map.updatedAt).toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1">Status</div>
                  <Badge variant={map.isDeleted ? "destructive" : "default"}>
                    {map.isDeleted ? "Deleted" : "Active"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
