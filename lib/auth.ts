export interface Admin {
  id: string
  email: string
  name: string
}

export const AUTH_STORAGE_KEY = "jariya_admin"

export function getStoredAdmin(): Admin | null {
  if (typeof window === "undefined") return null

  console.log("[v0] Getting stored admin from localStorage")

  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    const admin = stored ? JSON.parse(stored) : null

    console.log("[v0] Retrieved admin:", {
      hasStored: !!stored,
      adminId: admin?.id,
      adminEmail: admin?.email,
    })

    return admin
  } catch (error) {
    console.error("[v0] Error parsing stored admin:", error)
    return null
  }
}

export function setStoredAdmin(admin: Admin): void {
  if (typeof window === "undefined") return

  console.log("[v0] Storing admin in localStorage:", {
    adminId: admin.id,
    adminEmail: admin.email,
    adminName: admin.name,
  })

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(admin))
}

export function clearStoredAdmin(): void {
  if (typeof window === "undefined") return

  console.log("[v0] Clearing stored admin from localStorage")

  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function isAuthenticated(): boolean {
  const admin = getStoredAdmin()
  const authenticated = admin !== null

  console.log("[v0] Authentication check:", { authenticated, adminId: admin?.id })

  return authenticated
}
