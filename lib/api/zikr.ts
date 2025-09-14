import { apiGet, apiPost } from "../api"

export interface Zikr {
  id: string
  textArabic: string
  titleEn?: string
  titleUr?: string
  transliteration?: string
  quantityNotes?: string
  sourceNotes?: string
  isQuran: boolean
  isHadith: boolean
  verified: boolean
  verifiedByName?: string
  createdAt: string
  updatedAt: string
}

export interface CreateZikrRequest {
  textArabic: string
  titleEn?: string
  titleUr?: string
  transliteration?: string
  quantityNotes?: string
  sourceNotes?: string
  isQuran: boolean
  isHadith: boolean
  verified: boolean
  verifiedByName?: string
}

export interface UpdateZikrRequest extends CreateZikrRequest {
  id: string
}

export async function getAllZikrs() {
  console.log("[v0] Fetching all zikrs")

  const result = await apiGet<any[]>("/zikr/getAll")

  if (result.success && result.data) {
    const transformedData: Zikr[] = result.data.map((item: any) => ({
      id: item.id,
      textArabic: item.textAr || "",
      titleEn: item.titleEn || undefined,
      titleUr: item.titleUr || undefined,
      transliteration: item.transliteration || undefined,
      quantityNotes: item.quantityNotes || undefined,
      sourceNotes: item.sourceNotes || undefined,
      isQuran: item.isQuran || false,
      isHadith: item.isHadith || false,
      verified: item.isVerified || false,
      verifiedByName: item.verifiedByName || undefined,
      createdAt: item.createdAt || "",
      updatedAt: item.updatedAt || "",
    }))

    console.log("[v0] Get all zikrs result:", {
      success: true,
      count: transformedData.length,
      message: "Fetched all Zikr records",
    })

    return {
      success: true,
      data: transformedData,
      message: result.message,
    }
  }

  console.log("[v0] Get all zikrs result:", {
    success: result.success,
    count: 0,
    message: result.message,
  })

  return result
}

export async function getZikrById(id: string) {
  console.log("[v0] Fetching zikr by ID:", { id })

  const result = await apiPost<Zikr>("/zikr/getById", { id })

  console.log("[v0] Get zikr by ID result:", {
    success: result.success,
    zikrId: result.data?.id,
    hasArabicText: !!result.data?.textArabic,
    message: result.message,
  })

  return result
}

export async function createZikr(zikr: CreateZikrRequest) {
  console.log("[v0] Creating new zikr:", {
    hasArabicText: !!zikr.textArabic,
    titleEn: zikr.titleEn,
    isQuran: zikr.isQuran,
    isHadith: zikr.isHadith,
    verified: zikr.verified,
  })

  const result = await apiPost<Zikr>("/zikrs", zikr)

  console.log("[v0] Create zikr result:", {
    success: result.success,
    createdId: result.data?.id,
    message: result.message,
  })

  return result
}

export async function updateZikr(zikr: UpdateZikrRequest) {
  console.log("[v0] Updating zikr:", {
    id: zikr.id,
    hasArabicText: !!zikr.textArabic,
    titleEn: zikr.titleEn,
    verified: zikr.verified,
  })

  const result = await apiPost<Zikr>("/zikrs/update", zikr)

  console.log("[v0] Update zikr result:", {
    success: result.success,
    updatedId: result.data?.id,
    message: result.message,
  })

  return result
}

export async function deleteZikr(id: string) {
  console.log("[v0] Deleting zikr:", { id })

  const result = await apiPost("/zikr/deleteById", { id })

  console.log("[v0] Delete zikr result:", {
    success: result.success,
    deletedId: id,
    message: result.message,
  })

  return result
}
