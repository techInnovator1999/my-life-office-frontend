import { z } from 'zod'

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

export type LoginFormData = z.infer<typeof loginSchema>

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
    .min(6, 'Must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'This field is required'),
  mobile: z.string().optional(),
  registrationType: z.enum(['INDIVIDUAL', 'BUSINESS', 'EMPLOYEE', 'NOT_LICENSED']).optional(),
  primaryLicenseType: z.string().optional(),
  residentState: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export type SignupFormData = z.infer<typeof signupSchema>

/**
 * Forgot password form validation schema
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'This field is required')
    .email('Please enter a valid email address'),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

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

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

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

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>

