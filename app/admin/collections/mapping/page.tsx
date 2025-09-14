"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { CollectionMapTable } from "@/components/collection-map-table"
import { getAllCollectionMaps, getAllCollections, type CollectionMap } from "@/lib/api/collection"
import { getAllZikrs, type Zikr } from "@/lib/api/zikr"

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

export default function CollectionMappingPage() {
  const [maps, setMaps] = useState<EnhancedCollectionMap[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMaps = async () => {
    try {
      console.log("[v0] Starting to fetch maps, collections, and zikrs")
      const [mapsRes, collectionsRes, zikrsRes] = await Promise.all([
        getAllCollectionMaps(),
        getAllCollections(),
        getAllZikrs()
      ])

      console.log("[v0] API Responses:", {
        maps: mapsRes.data?.[0],
        collections: collectionsRes.data?.[0],
        zikrs: zikrsRes.data?.[0]
      })

      if (mapsRes.success && collectionsRes.success && zikrsRes.success && 
          mapsRes.data && collectionsRes.data && zikrsRes.data) {
        // Create lookup tables
        const collections = new Map(collectionsRes.data.map(c => [c.id, c]))
        const zikrs = new Map(zikrsRes.data.map(z => [z.id, z]))

        // Enhance maps with full collection and zikr data
        const enhancedMaps = mapsRes.data.map(map => ({
          ...map,
          collection: collections.get(map.collectionId),
          zikr: zikrs.get(map.zikrId)
        }))

        console.log("[v0] Enhanced maps:", enhancedMaps[0])
        setMaps(enhancedMaps)
      } else {
        setError("Failed to load complete mapping data")
      }
    } catch (err) {
      console.error("[v0] Error loading maps:", err)
      setError("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMaps()
  }, [])

  if (error) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="p-4 text-red-500">{error}</div>
        </AdminLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-islamic text-primary mb-2">Collection Mappings</h1>
            <p className="text-muted-foreground">Map zikrs to collections</p>
          </div>

          <CollectionMapTable
            maps={maps}
            onMapDeleted={(id) => setMaps((prev) => prev.filter((m) => m.id !== id))}
            onRefresh={fetchMaps}
            isLoading={isLoading}
          />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
