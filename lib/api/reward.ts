import { apiGet, apiPost } from "../api"

export interface ZikrReward {
  id: string
  zikrId: string
  text: string
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

export interface CreateZikrRewardRequest {
  zikrId: string
  text: string
}

export interface UpdateZikrRewardRequest extends CreateZikrRewardRequest {
  id: string
}

// Zikr Reward APIs
export async function getAllZikrRewards() {
  return apiGet<ZikrReward[]>("/zikrReward/getAll")
}

export async function getZikrRewardById(id: string) {
  return apiPost<ZikrReward>("/zikrReward/getById", { id })
}

export async function createZikrReward(reward: CreateZikrRewardRequest) {
  return apiPost<ZikrReward>("/zikrReward/add", reward)
}

export async function updateZikrReward(reward: UpdateZikrRewardRequest) {
  return apiPost<ZikrReward>("/zikrReward/update", reward)
}

export async function deleteZikrReward(id: string) {
  return apiPost("/zikrReward/deleteById", { id })
}
