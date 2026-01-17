'use client'

import { useEffect } from 'react'
import { getInitialTheme, applyTheme } from '@/utils/theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Apply theme immediately on mount to prevent flash
    const theme = getInitialTheme()
    applyTheme(theme)
    
    // Update theme-color meta tag
    const metaTheme = document.querySelector('meta[name="theme-color"]')
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#0f172a' : '#f7f6f8')
    }
  }, [])

  return <>{children}</>
}

