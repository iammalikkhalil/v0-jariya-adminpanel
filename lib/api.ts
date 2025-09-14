const BASE_URL = "/api/proxy"

const MOCK_ADMIN = {
  id: 1,
  name: "Admin User",
  email: "admin@jariya.net",
  role: "admin",
}

const MOCK_STATS = {
  totalZikrs: 156,
  totalTranslations: 89,
  totalHadiths: 45,
  totalCollections: 12,
  verifiedZikrs: 134,
  pendingZikrs: 22,
  activeUsers: 1250,
  monthlyGrowth: 15.3,
}

const MOCK_RECENT_ZIKRS = [
  {
    id: 1,
    arabic_text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    transliteration: "Subhan Allah wa bihamdihi",
    translation: "Glory be to Allah and praise Him",
    verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    arabic_text: "لَا إِلَهَ إِلَّا اللَّهُ",
    transliteration: "La ilaha illa Allah",
    translation: "There is no god but Allah",
    verified: true,
    created_at: new Date().toISOString(),
  },
]

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
}

async function tryApiCall(url: string, options: RequestInit): Promise<Response> {
  try {
    const response = await fetch(url, options)
    return response
  } catch (error) {
    console.log("[v0] API unavailable, using mock data:", {
      url,
      error: error instanceof Error ? error.message : error,
    })
    throw new Error("API_UNAVAILABLE")
  }
}

export async function apiGet<T = any>(endpoint: string): Promise<ApiResponse<T>> {
  console.log("[v0] API GET Request:", { endpoint, fullUrl: `${BASE_URL}${endpoint}` })

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] API GET Response Status:", {
      endpoint,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    })

    const data = await response.json()

    let result: ApiResponse<T>
    if (response.ok && data.success) {
      result = {
        success: true,
        data: data.data, // Extract the actual data from your API response
        message: data.message,
      }
    } else {
      result = {
        success: false,
        message: data.message || "Request failed",
      }
    }

    console.log("[v0] API GET Result:", {
      endpoint,
      success: result.success,
      dataKeys: result.data ? Object.keys(result.data) : null,
    })

    return result
  } catch (error) {
    console.error("[v0] API GET Error:", {
      endpoint,
      error: error instanceof Error ? error.message : error,
    })

    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    }
  }
}

export async function apiPost<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
  console.log("[v0] API POST Request:", {
    endpoint,
    fullUrl: `${BASE_URL}${endpoint}`,
    hasBody: !!body,
    bodyKeys: body ? Object.keys(body) : null,
  })

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    console.log("[v0] API POST Response Status:", {
      endpoint,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    })

    const data = await response.json()

    let result: ApiResponse<T>
    if (response.ok && data.success) {
      result = {
        success: true,
        data: data.data, // Extract the actual data from your API response
        message: data.message,
      }
    } else {
      result = {
        success: false,
        message: data.message || "Request failed",
      }
    }

    console.log("[v0] API POST Result:", {
      endpoint,
      success: result.success,
      dataKeys: result.data ? Object.keys(result.data) : null,
    })

    return result
  } catch (error) {
    console.error("[v0] API POST Error:", {
      endpoint,
      error: error instanceof Error ? error.message : error,
    })

    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    }
  }
}
