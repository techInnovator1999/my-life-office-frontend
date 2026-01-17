/**
 * Term License Service
 * 
 * Handles API calls for term license lookup
 */

import api from './api'
import type { TermLicense } from '@/types/lookup'

export type { TermLicense }

/**
 * Get all term licenses
 */
export async function getTermLicenses(search?: string): Promise<TermLicense[]> {
  const params = new URLSearchParams()
  if (search) {
    params.append('search', search)
  }
  params.append('isActive', 'true')

  const response = await api.get<TermLicense[]>(`/term-licenses?${params}`)
  return response.data
}

