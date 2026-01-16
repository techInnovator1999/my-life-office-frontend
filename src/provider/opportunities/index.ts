/**
 * Opportunities Provider
 * 
 * Exports query keys and hooks for opportunities
 */

export * from './api'
export * from './types'

/**
 * Query keys for opportunities
 */
export const opportunityKeys = {
  all: ['opportunities'] as const,
  lists: () => [...opportunityKeys.all, 'list'] as const,
  list: (filters?: string) => [...opportunityKeys.lists(), { filters }] as const,
  details: () => [...opportunityKeys.all, 'detail'] as const,
  detail: (id: string) => [...opportunityKeys.details(), id] as const,
}

