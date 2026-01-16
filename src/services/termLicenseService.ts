/**
 * Term License Service
 * 
 * Handles API calls for term license lookup
 */

import api from './api'

export type TermLicense = {
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

