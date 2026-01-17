/**
 * License Type Service
 * 
 * Handles API calls for license types lookup
 */

import api from './api'
import type { LicenseType } from '@/types/lookup'

export type { LicenseType }

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

