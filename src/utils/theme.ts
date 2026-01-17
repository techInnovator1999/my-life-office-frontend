/**
 * Theme Utilities
 * 
 * Helper functions for theme management
 */

import type { Theme } from '@/types/common'

export type { Theme }

/**
 * Get current theme from localStorage or system preference
 */
export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  
  const stored = localStorage.getItem('theme') as Theme | null
  if (stored) return stored
  
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  
  // Update theme-color meta tag for browser UI
  const metaTheme = document.querySelector('meta[name="theme-color"]')
  if (metaTheme) {
    metaTheme.setAttribute('content', theme === 'dark' ? '#0f172a' : '#f7f6f8')
  }
  
  localStorage.setItem('theme', theme)
}

/**
 * Toggle between light and dark theme
 */
export function toggleTheme(): Theme {
  const current = getInitialTheme()
  const newTheme: Theme = current === 'light' ? 'dark' : 'light'
  applyTheme(newTheme)
  return newTheme
}

/**
 * Set theme explicitly
 */
export function setTheme(theme: Theme): void {
  applyTheme(theme)
}

