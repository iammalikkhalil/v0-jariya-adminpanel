import { apiGet, apiPost } from "../api";

// ------------------- Interfaces -------------------

export interface QuranLine {
  pageNumber: number;
  lineNumber: number;
  textAr: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddQuranLineRequest {
  pageNumber: number;
  lineNumber: number;
  textAr: string;
}

export interface UpdateQuranLineRequest extends AddQuranLineRequest {}

// ------------------- Quran API Functions -------------------

export async function getLastQuranLine() {
  console.log("[v0] Fetching last Quran line");

  const result = await apiGet<QuranLine>("/quran/getLastLine");

  console.log("[v0] Last Quran line result:", {
    success: result.success,
    pageNumber: result.data?.pageNumber,
    lineNumber: result.data?.lineNumber,
    message: result.message,
  });

  return result;
}

export async function getQuranLine(pageNumber: number, lineNumber: number) {
  console.log("[v0] Fetching Quran line", { pageNumber, lineNumber });

  const result = await apiGet<QuranLine>(`/quran/getLine?pageNumber=${pageNumber}&lineNumber=${lineNumber}`);

  console.log("[v0] Quran line fetch result:", {
    success: result.success,
    pageNumber: result.data?.pageNumber,
    lineNumber: result.data?.lineNumber,
    message: result.message,
  });

  return result;
}

export async function getQuranPage(pageNumber: number) {
  console.log("[v0] Fetching Quran page", pageNumber);

  const result = await apiGet<QuranLine[]>(`/quran/getPage?pageNumber=${pageNumber}`);

  console.log("[v0] Quran page fetch result:", {
    success: result.success,
    count: result.data?.length || 0,
    message: result.message,
  });

  return result;
}

export async function addQuranLine(line: AddQuranLineRequest) {
  console.log("[v0] Adding new Quran line:", line);

  const result = await apiPost<QuranLine>("/quran/add", line);

  console.log("[v0] Add Quran line result:", {
    success: result.success,
    pageNumber: result.data?.pageNumber,
    lineNumber: result.data?.lineNumber,
    message: result.message,
  });

  return result;
}

export async function updateQuranLine(line: UpdateQuranLineRequest) {
  console.log("[v0] Updating Quran line:", line);

  const result = await apiPost<QuranLine>("/quran/update", line);

  console.log("[v0] Update Quran line result:", {
    success: result.success,
    pageNumber: result.data?.pageNumber,
    lineNumber: result.data?.lineNumber,
    message: result.message,
  });

  return result;
}

export async function deleteQuranLine(pageNumber: number, lineNumber: number) {
  console.log("[v0] Deleting Quran line:", { pageNumber, lineNumber });

  const result = await apiPost("/quran/delete", { pageNumber: pageNumber, lineNumber: lineNumber, textAr: "a" });

  console.log("[v0] Delete Quran line result:", {
    success: result.success,
    pageNumber,
    lineNumber,
    message: result.message,
  });

  return result;
}