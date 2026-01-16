/**
 * Region Service
 * 
 * Handles API calls for regions/states
 */

import api from './api'

export type Region = {
  id: string
  label: string
  value: string
  code?: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

/**
 * Get all regions/states
 */
export async function getRegions(search?: string): Promise<Region[]> {
  const params = new URLSearchParams()
  if (search) {
    params.append('search', search)
  }
  params.append('isActive', 'true')

  const response = await api.get<Region[]>(`/regions?${params}`)
  return response.data
}

