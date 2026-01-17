/**
 * Authentication Service
 * 
 * Handles API calls for authentication using axios
 */

import api from './api'
import type { LoginCredentials, LoginResponse } from '@/types/auth'

export type { LoginCredentials, LoginResponse }

/**
 * Login user with email and password
 * Tries CRM login first (for agents), falls back to admin login if needed
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    // Try CRM login first (for agents)
    const response = await api.post<LoginResponse>('/auth/crm/login', credentials)
    return response.data
  } catch (error: any) {
    // If CRM login fails with "email not recognized", try admin login
    if (error.response?.status === 404 || error.response?.data?.message?.includes('email is not recognized')) {
      try {
        const adminResponse = await api.post<LoginResponse>('/auth/admin/login', credentials)
        return adminResponse.data
      } catch (adminError: any) {
        // Check if it's a verification error
        if (adminError.response?.status === 403 && adminError.response?.data?.data?.verificationRequired) {
          throw new Error('EMAIL_NOT_VERIFIED')
        }
        throw new Error(adminError.response?.data?.message || 'Invalid email or password')
      }
    }

    // Check if it's a verification error
    if (error.response?.status === 403 && error.response?.data?.data?.verificationRequired) {
      throw new Error('EMAIL_NOT_VERIFIED')
    }

    throw new Error(error.response?.data?.message || 'Invalid email or password')
  }
}

/**
 * Get current user from token
 */
export async function getCurrentUser(): Promise<LoginResponse['user']> {
  const response = await api.get<LoginResponse['user']>('/auth/me')
  return response.data
}

/**
 * Confirm email with verification code
 */
export async function confirmEmail(email: string, code: string): Promise<void> {
  await api.post('/auth/confirm', { email, code })
}

/**
 * Refresh access token using refresh token
 */
export async function refreshToken(refreshToken: string): Promise<Omit<LoginResponse, 'user'>> {
  const response = await api.post<Omit<LoginResponse, 'user'>>(
    '/auth/refresh',
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  )
  return response.data
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, data: {
  firstName?: string
  lastName?: string
  mobile?: string | null
  primaryLicenseType?: string | null
  residentState?: string | null
  licenseNumber?: string | null
  yearsLicensed?: number | null
  priorProductsSold?: string | null
  currentCompany?: string | null
}): Promise<LoginResponse['user']> {
  const response = await api.post<LoginResponse['user']>(`/users/${userId}/update-profile`, data)
  return response.data
}

/**
 * Logout user (clear token on server)
 */
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout')
  } catch (error) {
    // Ignore errors on logout
  }
}

/**
 * Request password reset - sends verification code to email (CRM Agent)
 */
export async function forgotPassword(email: string, isResend?: boolean): Promise<void> {
  await api.post('/auth/crm/forgot/password', { email, isResend: isResend || false })
}

/**
 * Verify password reset code (without resetting password)
 */
export async function verifyPasswordResetCode(email: string, code: string): Promise<void> {
  await api.post('/auth/verify/password-reset-code', { email, code })
}

/**
 * Reset password with verification code
 */
export async function resetPassword(email: string, password: string, code: string): Promise<void> {
  await api.post('/auth/reset/password', { email, password, code })
}

/**
 * Register new CRM agent
 */
export type RegisterCredentials = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  primaryLicenseType: string
}

export async function register(credentials: RegisterCredentials): Promise<void> {
  const { confirmPassword, ...rest } = credentials
  await api.post('/auth/crm/register', {
    ...rest,
    confirm_password: confirmPassword,
  })
}

