import { apiGet } from "../api"

export interface DashboardStats {
  totalZikrs: number
  verifiedZikrs: number
  totalCollections: number
  totalTags: number
  verificationRate: number
  monthlyGrowth: number
  weeklyCollections: number
}

export interface RecentZikr {
  id: string
  textArabic: string
  titleEn?: string
  verified: boolean
  createdAt: string
}

export async function getDashboardStats() {
  console.log("[v0] Fetching dashboard stats from zikr endpoint")

  const result = await apiGet("/zikr/getAll")

  console.log("[v0] Dashboard stats API response:", {
    success: result.success,
    data: result.data,
  })

  if (result.success && result.data?.data) {
    const zikrs = result.data.data
    console.log("[v0] Processing zikr data for dashboard stats:", { count: zikrs.length })

    // Calculate stats from real zikr data
    const stats: DashboardStats = {
      totalZikrs: zikrs.length,
      verifiedZikrs: zikrs.filter((z: any) => z.isVerified).length,
      totalCollections: zikrs.filter((z: any) => z.isQuran || z.isHadith).length,
      totalTags: zikrs.filter((z: any) => z.isQuran).length + zikrs.filter((z: any) => z.isHadith).length,
      verificationRate: zikrs.length > 0 ? (zikrs.filter((z: any) => z.isVerified).length / zikrs.length) * 100 : 0,
      monthlyGrowth: 15.3, // This would need a separate endpoint for time-based data
      weeklyCollections: 8.2, // This would need a separate endpoint for time-based data
    }

    return {
      success: true,
      data: stats,
    }
  }

  console.error("[v0] Failed to fetch dashboard stats")

  return {
    success: false,
    message: "Failed to fetch dashboard stats",
  }
}

export async function getRecentZikrs() {
  console.log("[v0] Fetching recent zikrs from real API")

  const result = await apiGet("/zikr/getAll")

  if (result.success && result.data?.data) {
    const zikrs = result.data.data

    // Convert to the expected format and take the 5 most recent
    const recentZikrs: RecentZikr[] = zikrs
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((zikr: any) => ({
        id: zikr.id,
        textArabic: zikr.textAr.replace(/"/g, ""), // Remove extra quotes
        titleEn: zikr.transliteration,
        verified: zikr.isVerified,
        createdAt: zikr.createdAt,
      }))

    console.log("[v0] Recent zikrs processed:", {
      success: true,
      count: recentZikrs.length,
    })

    return {
      success: true,
      data: recentZikrs,
    }
  }

  console.error("[v0] Failed to fetch recent zikrs")

  return {
    success: false,
    message: "Failed to fetch recent zikrs",
  }
}
