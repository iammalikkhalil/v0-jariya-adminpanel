import { apiGet, apiPost } from "../api"

export interface ZikrQuality {
  id: string
  zikrId: string
  text: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  deletedAt?: string
  zikr?: {
    textAr: string
    titleEn?: string
    titleUr?: string
  }
}

export interface CreateZikrQualityRequest {
  zikrId: string
  text: string
}

export interface UpdateZikrQualityRequest extends CreateZikrQualityRequest {
  id: string
}

// Zikr Quality APIs
export async function getAllZikrQualities() {
  return apiGet<ZikrQuality[]>("/zikrQuality/getAll")
}

export async function getZikrQualityById(id: string) {
  return apiPost<ZikrQuality>("/zikrQuality/getById", { id })
}

export async function createZikrQuality(quality: CreateZikrQualityRequest) {
  return apiPost<ZikrQuality>("/zikrQuality/add", quality)
}

export async function updateZikrQuality(quality: UpdateZikrQualityRequest) {
  return apiPost<ZikrQuality>("/zikrQuality/update", quality)
}

export async function deleteZikrQuality(id: string) {
  return apiPost("/zikrQuality/deleteById", { id })
}
