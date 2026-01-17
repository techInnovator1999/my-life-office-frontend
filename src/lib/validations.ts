import { z } from 'zod'
import type { LoginFormData, SignupFormData, ForgotPasswordFormData, ResetPasswordFormData, VerifyResetCodeFormData, ProfileUpdateFormData } from '@/types/form'

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'This field is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'This field is required')
    .min(6, 'Must be at least 6 characters'),
})

// Re-export types for backward compatibility
export type { LoginFormData, SignupFormData, ForgotPasswordFormData, ResetPasswordFormData, VerifyResetCodeFormData, ProfileUpdateFormData }

/**
 * Signup form validation schema
 */
export const signupSchema = z.object({
  firstName: z.string().min(1, 'This field is required').min(2, 'Must be at least 2 characters'),
  lastName: z.string().min(1, 'This field is required').min(2, 'Must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'This field is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'This field is required')
    .min(8, 'Must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'This field is required'),
  primaryLicenseType: z.string().min(1, 'This field is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// SignupFormData exported from types/form.ts

/**
 * Forgot password form validation schema
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'This field is required')
    .email('Please enter a valid email address'),
})

// ForgotPasswordFormData exported from types/form.ts

/**
 * Reset password form validation schema
 */
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, 'This field is required')
    .min(6, 'Must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'This field is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// ResetPasswordFormData exported from types/form.ts

/**
 * Verify reset code form validation schema
 */
export const verifyResetCodeSchema = z.object({
  email: z
    .string()
    .min(1, 'This field is required')
    .email('Please enter a valid email address'),
  code: z
    .string()
    .min(1, 'This field is required')
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d+$/, 'Verification code must contain only numbers'),
})

// VerifyResetCodeFormData exported from types/form.ts

/**
 * Profile update form validation schema
 */
export const profileUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').min(2, 'Must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required').min(2, 'Must be at least 2 characters'),
  mobile: z.string().optional().nullable(),
  primaryLicenseType: z.string().optional().nullable(),
  residentState: z.string().optional().nullable(),
  licenseNumber: z.string().optional().nullable(),
  yearsLicensed: z.string().optional().nullable(),
  priorProductsSold: z.string().optional().nullable(),
  currentCompany: z.string().optional().nullable(),
})

// ProfileUpdateFormData exported from types/form.ts

