/**
 * Contacts Provider
 * 
 * Exports query keys and hooks for contacts
 */

export * from './api'
export * from './types'

/**
 * Query keys for contacts
 */
export const contactKeys = {
  all: ['contacts'] as const,
  lists: () => [...contactKeys.all, 'list'] as const,
  list: (filters?: string) => [...contactKeys.lists(), { filters }] as const,
  details: () => [...contactKeys.all, 'detail'] as const,
  detail: (id: string) => [...contactKeys.details(), id] as const,
}

