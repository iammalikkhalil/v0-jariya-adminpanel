import { apiPost } from "../api"
import type { Admin } from "../auth"

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  admin: Admin
  token?: string
}

export async function loginAdmin(credentials: LoginRequest) {
  console.log("[v0] Login Attempt:", { email: credentials.email, hasPassword: !!credentials.password })

  const result = await apiPost<any>("/auth/login", credentials)

  console.log("[v0] Login Result:", result.data)

  if (result.success && result.data) {
    const userData = result.data
    const admin: Admin = {
      id: userData.id,
      name: userData.name || userData.email.split("@")[0], // Use email prefix if name is empty
      email: userData.email,
      role: "admin",
    }

    return {
      success: true,
      data: { admin },
      message: result.message,
    }
  }

  return result
}

export async function logoutAdmin() {
  console.log("[v0] Logout Attempt")

  const result = await apiPost("/auth/logout")

  console.log("[v0] Logout Result:", { success: result.success, message: result.message })

  return result
}
