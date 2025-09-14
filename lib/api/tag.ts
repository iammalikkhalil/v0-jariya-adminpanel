import { apiGet, apiPost } from "../api"

export interface Tag {
  id: string
  text: string
  createdAt: string
  updatedAt: string
}

export interface TagMap {
  id: string
  tagId: string
  zikrId: string
  createdAt: string
  tag?: Tag
  zikr?: {
    textArabic: string
    titleEn?: string
  }
}

export interface CreateTagRequest {
  text: string
}

export interface UpdateTagRequest extends CreateTagRequest {
  id: string
}

export interface CreateTagMapRequest {
  tagId: string
  zikrId: string
}

// Tag APIs
export async function getAllTags() {
  return apiGet<Tag[]>("/tag/getAll")
}

export async function getTagById(id: string) {
  return apiPost<Tag>("/tag/getById", { id })
}

export async function createTag(tag: CreateTagRequest) {
  return apiPost<Tag>("/tag/add", tag)
}

export async function updateTag(tag: UpdateTagRequest) {
  return apiPost<Tag>("/tag/update", tag)
}

export async function deleteTag(id: string) {
  return apiPost("/tag/deleteById", { id })
}

// Tag Mapping APIs
export async function getAllTagMaps() {
  return apiGet<TagMap[]>("/tagMap/getAll")
}

export async function getTagMapById(id: string) {
  return apiPost<TagMap>("/tagMap/getById", { id })
}

export async function createTagMap(tagMap: CreateTagMapRequest) {
  return apiPost<TagMap>("/tagMap/add", tagMap)
}

export async function deleteTagMap(id: string) {
  return apiPost("/tagMap/deleteById", { id })
}
