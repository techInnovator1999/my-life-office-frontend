/**
 * Form Data Types
 * Types inferred from Zod validation schemas
 */

export type LoginFormData = {
  email: string
  password: string
}

export type SignupFormData = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  primaryLicenseType: string
}

export type ForgotPasswordFormData = {
  email: string
}

export type ResetPasswordFormData = {
  password: string
  confirmPassword: string
}

export type VerifyResetCodeFormData = {
  email: string
  code: string
}

export type ProfileUpdateFormData = {
  firstName: string
  lastName: string
  mobile?: string | null
  primaryLicenseType?: string | null
  residentState?: string | null
  licenseNumber?: string | null
  yearsLicensed?: string | null
  priorProductsSold?: string | null
  currentCompany?: string | null
}

