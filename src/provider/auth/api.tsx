'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as authService from '@/services/authService'
import type {
  LoginCredentials,
  LoginResponse,
  UpdateProfileDto,
} from './types'
import { authKeys } from './index'

/**
 * Login mutation
 */
export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data: LoginResponse) => {
      // Store tokens
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token)
        localStorage.setItem('refreshToken', data.refreshToken)
      }
      // Set user data in query cache
      queryClient.setQueryData(authKeys.currentUser(), data.user)
    },
  })
}

/**
 * Get current user
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: () => authService.getCurrentUser(),
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Logout mutation
 */
export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
      }
      // Clear all query cache
      queryClient.clear()
    },
  })
}

/**
 * Confirm email mutation
 */
export const useConfirmEmail = () => {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      authService.confirmEmail(email, code),
  })
}

/**
 * Update profile mutation
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateProfileDto }) =>
      authService.updateProfile(userId, data),
    onSuccess: (data) => {
      // Update user in cache
      queryClient.setQueryData(authKeys.currentUser(), data)
    },
  })
}

/**
 * Forgot password mutation
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: ({ email, isResend }: { email: string; isResend?: boolean }) =>
      authService.forgotPassword(email, isResend),
  })
}

/**
 * Verify password reset code mutation
 */
export const useVerifyPasswordResetCode = () => {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      authService.verifyPasswordResetCode(email, code),
  })
}

/**
 * Reset password mutation
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ email, password, code }: { email: string; password: string; code: string }) =>
      authService.resetPassword(email, password, code),
  })
}

