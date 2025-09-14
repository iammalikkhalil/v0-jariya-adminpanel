import { apiGet, apiPost } from "../api"

export interface Collection {
  id: string
  text: string
  description?: string
  featured: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface CollectionMap {
  id: string
  collectionId: string
  zikrId: string
  order: number
  countType: "Up" | "Down"
  countValue: number
  createdAt: string
  collection?: Collection
  zikr?: {
    textArabic: string
    titleEn?: string
  }
}

export interface CreateCollectionRequest {
  text: string
  description?: string
  featured: boolean
  order: number
}

export interface UpdateCollectionRequest extends CreateCollectionRequest {
  id: string
}

export interface CreateCollectionMapRequest {
  collectionId: string
  zikrId: string
  order: number
  countType: "Up" | "Down"
  countValue: number
}

export interface UpdateCollectionMapRequest extends CreateCollectionMapRequest {
  id: string
}

// Collection APIs
export async function getAllCollections() {
  return apiGet<Collection[]>("/collection/getAll")
}

export async function getCollectionById(id: string) {
  return apiPost<Collection>("/collection/getById", { id })
}

export async function createCollection(collection: CreateCollectionRequest) {
  return apiPost<Collection>("/collection/add", collection)
}

export async function updateCollection(collection: UpdateCollectionRequest) {
  return apiPost<Collection>("/collection/update", collection)
}

export async function deleteCollection(id: string) {
  return apiPost("/collection/deleteById", { id })
}

// Collection Mapping APIs
export async function getAllCollectionMaps() {
  return apiGet<CollectionMap[]>("/collectionMap/getAll")
}

export async function getCollectionMapById(id: string) {
  return apiPost<CollectionMap>("/collectionMap/getById", { id })
}

export async function createCollectionMap(collectionMap: CreateCollectionMapRequest) {
  return apiPost<CollectionMap>("/collectionMap/add", collectionMap)
}

export async function updateCollectionMap(collectionMap: UpdateCollectionMapRequest) {
  return apiPost<CollectionMap>("/collectionMap/update", collectionMap)
}

export async function deleteCollectionMap(id: string) {
  return apiPost("/collectionMap/deleteById", { id })
}
