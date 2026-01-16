/**
 * Auth Provider
 * 
 * Exports query keys and hooks for authentication
 */

export * from './api'
export * from './types'

/**
 * Query keys for auth
 */
export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'currentUser'] as const,
  login: () => [...authKeys.all, 'login'] as const,
}

