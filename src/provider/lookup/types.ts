/**
 * Lookup Provider Types
 */

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

