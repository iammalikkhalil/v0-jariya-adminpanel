import { apiGet, apiPost } from "../api"

export interface ZikrTranslation {
  id: string
  zikrId: string
  translation: string
  languageCode: string
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

export interface HadithTranslation {
  id: string
  hadithId: string
  translation: string
  languageCode: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  deletedAt?: string
  hadith?: {
    textAr: string
    reference?: string
  }
}

export interface CreateZikrTranslationRequest {
  zikrId: string
  languageCode: string
  translation: string
}

export interface CreateHadithTranslationRequest {
  hadithId: string
  languageCode: string
  translation: string
}

export interface UpdateZikrTranslationRequest extends CreateZikrTranslationRequest {
  id: string
}

export interface UpdateHadithTranslationRequest extends CreateHadithTranslationRequest {
  id: string
}

// Zikr Translation APIs
export async function getAllZikrTranslations() {
  return apiGet<ZikrTranslation[]>("/zikrTranslation/getAll")
}

export async function getZikrTranslationById(id: string) {
  return apiPost<ZikrTranslation>("/zikrTranslation/getById", { id })
}

export async function createZikrTranslation(translation: CreateZikrTranslationRequest) {
  return apiPost<ZikrTranslation>("/zikrTranslation/add", translation)
}

export async function updateZikrTranslation(translation: UpdateZikrTranslationRequest) {
  return apiPost<ZikrTranslation>("/zikrTranslation/update", translation)
}

export async function deleteZikrTranslation(id: string) {
  return apiPost("/zikrTranslation/deleteById", { id })
}

// Hadith Translation APIs
export async function getAllHadithTranslations() {
  return apiGet<HadithTranslation[]>("/zikrHadithTranslation/getAll")
}

export async function getHadithTranslationById(id: string) {
  return apiPost<HadithTranslation>("/zikrHadithTranslation/getById", { id })
}

export async function createHadithTranslation(translation: CreateHadithTranslationRequest) {
  return apiPost<HadithTranslation>("/zikrHadithTranslation/add", translation)
}

export async function updateHadithTranslation(translation: UpdateHadithTranslationRequest) {
  return apiPost<HadithTranslation>("/zikrHadithTranslation/update", translation)
}

export async function deleteHadithTranslation(id: string) {
  return apiPost("/zikrHadithTranslation/deleteById", { id })
}
