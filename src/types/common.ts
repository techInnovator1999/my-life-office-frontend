/**
 * Common Types
 * Shared types used across the application
 */

export type Theme = 'light' | 'dark'

export type ValidationResult = {
  isValid: boolean
  error?: string
}

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong'

