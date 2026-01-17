'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

type PrivateRouteProps = {
  children: React.ReactNode
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Track when component has mounted (hydrated)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect to login if not authenticated (after hydration)
  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [mounted, isAuthenticated, isLoading, router])

  // If user is not approved and not on profile page, redirect to profile
  useEffect(() => {
    if (mounted && user && !user.isApproved && pathname !== '/profile') {
      router.push('/profile')
    }
  }, [mounted, user, pathname, router])

  // During SSR or initial load, show loading state to match server render
  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900" suppressHydrationWarning>
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // After hydration, if not authenticated, return null (redirect will happen in useEffect)
  if (!isAuthenticated) {
    return null
  }

  // If user is not approved and not on profile page, show loading (redirect in progress)
  if (user && !user.isApproved && pathname !== '/profile') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}

