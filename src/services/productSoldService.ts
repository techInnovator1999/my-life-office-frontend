/**
 * Product Sold Service
 * 
 * Handles API calls for product sold lookup
 */

import api from './api'

export type ProductSold = {
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
 * Get all products sold
 */
export async function getProductsSold(search?: string): Promise<ProductSold[]> {
  const params = new URLSearchParams()
  if (search) {
    params.append('search', search)
  }
  params.append('isActive', 'true')

  const response = await api.get<ProductSold[]>(`/product-sold?${params}`)
  return response.data
}

