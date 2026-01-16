/**
 * Lookup Provider
 * 
 * Exports query keys and hooks for lookup data (license types, regions, products sold)
 */

export * from './api'
export * from './types'

/**
 * Query keys for lookup data
 */
export const lookupKeys = {
  all: ['lookup'] as const,
  licenseTypes: (search?: string) => [...lookupKeys.all, 'licenseTypes', search] as const,
  regions: (search?: string) => [...lookupKeys.all, 'regions', search] as const,
  productsSold: (search?: string) => [...lookupKeys.all, 'productsSold', search] as const,
  termLicenses: (search?: string) => [...lookupKeys.all, 'termLicenses', search] as const,
}

