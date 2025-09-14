import { apiGet, apiPost } from "../api"

export interface ZikrTranslation {
  id: string
  zikrId: string
  language: string
  translation: string
  createdAt: string
  updatedAt: string
  zikr?: {
    textArabic: string
    titleEn?: string
  }
}

export interface HadithTranslation {
  id: string
  hadithId: string
  language: string
  translation: string
  createdAt: string
  updatedAt: string
  hadith?: {
    textArabic: string
    reference?: string
  }
}

export interface CreateZikrTranslationRequest {
  zikrId: string
  language: string
  translation: string
}

export interface CreateHadithTranslationRequest {
  hadithId: string
  language: string
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
  return apiGet<HadithTranslation[]>("/hadithTranslation/getAll")
}

export async function getHadithTranslationById(id: string) {
  return apiPost<HadithTranslation>("/hadithTranslation/getById", { id })
}

export async function createHadithTranslation(translation: CreateHadithTranslationRequest) {
  return apiPost<HadithTranslation>("/hadithTranslation/add", translation)
}

export async function updateHadithTranslation(translation: UpdateHadithTranslationRequest) {
  return apiPost<HadithTranslation>("/hadithTranslation/update", translation)
}

export async function deleteHadithTranslation(id: string) {
  return apiPost("/hadithTranslation/deleteById", { id })
}
