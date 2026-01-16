'use client'

import { useQuery } from '@tanstack/react-query'
import * as licenseTypeService from '@/services/licenseTypeService'
import * as regionService from '@/services/regionService'
import * as productSoldService from '@/services/productSoldService'
import * as termLicenseService from '@/services/termLicenseService'
import type { LicenseType, Region, ProductSold, TermLicense } from './types'
import { lookupKeys } from './index'

/**
 * Get license types
 */
export const useLicenseTypes = (search?: string) => {
  return useQuery({
    queryKey: lookupKeys.licenseTypes(search),
    queryFn: () => licenseTypeService.getLicenseTypes(search),
    staleTime: 5 * 60 * 1000, // 5 minutes (lookup data changes infrequently)
  })
}

/**
 * Get regions
 */
export const useRegions = (search?: string) => {
  return useQuery({
    queryKey: lookupKeys.regions(search),
    queryFn: () => regionService.getRegions(search),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Get products sold
 */
export const useProductsSold = (search?: string) => {
  return useQuery({
    queryKey: lookupKeys.productsSold(search),
    queryFn: () => productSoldService.getProductsSold(search),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Get term licenses
 */
export const useTermLicenses = (search?: string) => {
  return useQuery({
    queryKey: lookupKeys.termLicenses(search),
    queryFn: () => termLicenseService.getTermLicenses(search),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

