import { apiGet, apiPost } from "../api"

export interface Collection {
  id: string
  text: string
  isFeatured: boolean
  description?: string
  orderIndex: number
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  deletedAt?: string
}

export interface CollectionMap {
  id: string
  collectionId: string
  zikrId: string
  countType: string
  countValue: number
  orderIndex: number
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  deletedAt?: string
  collection?: Collection
  zikr?: {
    textArabic: string
    titleEn?: string
  }
}

export interface CreateCollectionRequest {
  text: string
  description?: string
  isFeatured: boolean
  orderIndex: number
}

export interface UpdateCollectionRequest extends CreateCollectionRequest {
  id: string
}

export interface CreateCollectionMapRequest {
  collectionId: string
  zikrId: string
  orderIndex: number
  countType: string
  countValue: number
}

export interface UpdateCollectionMapRequest extends CreateCollectionMapRequest {
  id: string
}

// Collection APIs
export async function getAllCollections() {
  return apiGet<Collection[]>("/zikrCollection/getAll")
}

export async function getCollectionById(id: string) {
  return apiPost<Collection>("/zikrCollection/getById", { id })
}

export async function createCollection(collection: CreateCollectionRequest) {
  return apiPost<Collection>("/zikrCollection/add", collection)
}

export async function updateCollection(collection: UpdateCollectionRequest) {
  return apiPost<Collection>("/zikrCollection/update", collection)
}

export async function deleteCollection(id: string) {
  return apiPost("/zikrCollection/deleteById", { id })
}

// Collection Map APIs
export async function getAllCollectionMaps() {
  console.log("[v0] Fetching all collection maps")

  const result = await apiGet<any[]>("/zikrCollectionMap/getAll")

  if (result.success && result.data) {
    const transformedData: CollectionMap[] = result.data.map((item: any) => ({
      id: item.id || "",
      collectionId: item.collectionId || "",
      zikrId: item.zikrId || "",
      countType: item.countType || "Up",
      countValue: Number(item.countValue) || 0,
      orderIndex: Number(item.orderIndex) || 0,
      createdAt: item.createdAt || "",
      updatedAt: item.updatedAt || "",
      isDeleted: item.isDeleted || false,
      deletedAt: item.deletedAt || "",
    }))

    console.log("[v0] Collection maps data:", transformedData[0])
    return {
      success: true,
      data: transformedData,
      message: result.message
    }
  }

  return result
}

export async function getCollectionMapById(id: string) {
  console.log("[v0] Fetching collection map by ID:", id)
  return apiPost<CollectionMap>("/zikrCollectionMap/getById", { id })
}

export async function createCollectionMap(collectionMap: CreateCollectionMapRequest) {
  return apiPost<CollectionMap>("/zikrCollectionMap/add", collectionMap)
}

export async function updateCollectionMap(collectionMap: UpdateCollectionMapRequest) {
  return apiPost<CollectionMap>("/zikrCollectionMap/update", collectionMap)
}

export async function deleteCollectionMap(id: string) {
  return apiPost("/zikrCollectionMap/deleteById", { id })
}
