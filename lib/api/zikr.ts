import { apiGet, apiPost } from "../api"

export interface Zikr {
    id: string,
    textAr: string,
    titleEn?: string,
    titleUr?: string,
    transliteration?: string,
    quantityNotes?: string,
    sourceNotes?: string,
    isQuran: boolean,
    isHadith: boolean,
    isVerified: boolean,
    charCount: number,
    verifiedByName?: string,
    verifiedDate?: string,
    createdAt: string,
    updatedAt: string,
    isDeleted: boolean,
    deletedAt?: string
}



export interface CreateZikrRequest {
    textAr: string,
    titleEn?: string,
    titleUr?: string,
    transliteration?: string,
    quantityNotes?: string,
    sourceNotes?: string,
    isQuran: boolean,
    isHadith: boolean,
    isVerified: boolean,
    charCount: number,
    verifiedByName?: string,
    verifiedDate?: string,
}

export interface UpdateZikrRequest extends CreateZikrRequest {
  id: string
}

export async function getAllZikrs() {
  console.log("[v0] Fetching all zikrs")

  const result = await apiGet<any[]>("/zikr/getAll")

  if (result.success && result.data) {
    const transformedData: Zikr[] = result.data.map((item: any) => ({
      id: item.id || "",
      textAr: item.textAr || "",
      titleEn: item.titleEn || "",
      titleUr: item.titleUr || "",
      transliteration: item.transliteration || "",
      quantityNotes: item.quantityNotes || "",
      sourceNotes: item.sourceNotes || "",
      charCount: Number(item.charCount) || 0,
      isQuran: item.isQuran || false,
      isHadith: item.isHadith || false,
      isVerified: item.isVerified || false,
      verifiedByName: item.verifiedByName || "",
      verifiedDate: item.verifiedDate || "",
      createdAt: item.createdAt || "",
      updatedAt: item.updatedAt || "",
      isDeleted: item.isDeleted || false,
      deletedAt: item.deletedAt || "",

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
    textAr: !!result.data?.textAr,
    message: result.message,
  })

  return result
}

export async function createZikr(zikr: CreateZikrRequest) {
  console.log("[v0] Creating new zikr:", {
    hasArabicText: !!zikr.textAr,
    titleEn: zikr.titleEn,
    isQuran: zikr.isQuran,
    isHadith: zikr.isHadith,
    verified: zikr.isVerified,
  })

  const result = await apiPost<Zikr>("/zikr/add", zikr)

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
    hasArabicText: !!zikr.textAr,
    titleEn: zikr.titleEn,
    verified: zikr.isVerified,
  })

  const result = await apiPost<Zikr>("/zikr/update", zikr)

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
