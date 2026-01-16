/**
 * Agents Provider
 * 
 * Exports query keys and hooks for agents
 */

export * from './api'
export * from './types'

/**
 * Query keys for agents
 */
export const agentKeys = {
  all: ['agents'] as const,
  lists: () => [...agentKeys.all, 'list'] as const,
  list: (params?: { page?: number; limit?: number }) => 
    [...agentKeys.lists(), params] as const,
  pending: (params?: { page?: number; limit?: number }) => 
    [...agentKeys.all, 'pending', params] as const,
  details: () => [...agentKeys.all, 'detail'] as const,
  detail: (id: string) => [...agentKeys.details(), id] as const,
}

