import { apiGet, apiPost } from "../api"

export interface Hadith {
  id: string
  zikrId?: string
  textAr: string
  reference: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  deletedAt?: string
  zikr?: {
    textAr: string
    titleEn?: string
  }
}

export interface CreateHadithRequest {
  zikrId?: string
  textAr: string
  reference: string
}

export interface UpdateHadithRequest extends CreateHadithRequest {
  id: string
}

export async function getAllHadiths() {
  return apiGet<Hadith[]>("/zikrHadith/getAll")
}

export async function getHadithById(id: string) {
  return apiPost<Hadith>("/zikrHadith/getById", { id })
}

export async function createHadith(hadith: CreateHadithRequest) {
  return apiPost<Hadith>("/zikrHadith/add", hadith)
}

export async function updateHadith(hadith: UpdateHadithRequest) {
  return apiPost<Hadith>("/zikrHadith/update", hadith)
}

export async function deleteHadith(id: string) {
  return apiPost("/zikrHadith/deleteById", { id })
}
