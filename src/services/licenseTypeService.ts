/**
 * License Type Service
 * 
 * Handles API calls for license types lookup
 */

import api from './api'

export type LicenseType = {
  id: string
  label: string
  value: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

/**
 * Get all license types
 */
export async function getLicenseTypes(search?: string): Promise<LicenseType[]> {
  const params = new URLSearchParams()
  if (search) {
    params.append('search', search)
  }
  params.append('isActive', 'true')

  const response = await api.get<LicenseType[]>(`/license-types?${params}`)
  return response.data
}

