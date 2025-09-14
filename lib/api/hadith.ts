import { apiGet, apiPost } from "../api"

export interface Hadith {
  id: string
  zikrId?: string
  textArabic: string
  reference: string
  createdAt: string
  updatedAt: string
  zikr?: {
    textArabic: string
    titleEn?: string
  }
}

export interface CreateHadithRequest {
  zikrId?: string
  textArabic: string
  reference: string
}

export interface UpdateHadithRequest extends CreateHadithRequest {
  id: string
}

export async function getAllHadiths() {
  return apiGet<Hadith[]>("/hadith/getAll")
}

export async function getHadithById(id: string) {
  return apiPost<Hadith>("/hadith/getById", { id })
}

export async function createHadith(hadith: CreateHadithRequest) {
  return apiPost<Hadith>("/hadith/add", hadith)
}

export async function updateHadith(hadith: UpdateHadithRequest) {
  return apiPost<Hadith>("/hadith/update", hadith)
}

export async function deleteHadith(id: string) {
  return apiPost("/hadith/deleteById", { id })
}
