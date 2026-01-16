'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useLogin, useLogout, useCurrentUser } from '@/provider/auth'
import type { LoginResponse } from '@/provider/auth/types'

type User = LoginResponse['user']

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<LoginResponse>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const loginMutation = useLogin()
  const logoutMutation = useLogout()
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser()

  const login = async (email: string, password: string, rememberMe = false) => {
    const response = await loginMutation.mutateAsync({ email, password })
    
    // Store in appropriate storage based on rememberMe
    if (typeof window !== 'undefined') {
      if (rememberMe) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('refreshToken', response.refreshToken)
      } else {
        sessionStorage.setItem('token', response.token)
        sessionStorage.setItem('refreshToken', response.refreshToken)
      }
      if (response.tokenExpires) {
        const storage = rememberMe ? localStorage : sessionStorage
        storage.setItem('tokenExpires', response.tokenExpires.toString())
      }
    }
    
    return response
  }

  const logout = async () => {
    await logoutMutation.mutateAsync()
    router.push('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user: currentUser || null,
        isAuthenticated: !!currentUser,
        isLoading: isLoadingUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

