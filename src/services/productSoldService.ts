/**
 * Product Sold Service
 * 
 * Handles API calls for product sold lookup
 */

import api from './api'
import type { ProductSold } from '@/types/lookup'

export type { ProductSold }

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

