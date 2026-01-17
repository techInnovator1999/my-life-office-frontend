/**
 * Auto Scrollbar Hook
 * 
 * Adds scroll detection to show scrollbars only when actively scrolling.
 * Applies the 'scrolling' class when user is scrolling, removes it after scrolling stops.
 */

import { useEffect, useRef } from 'react'

export function useAutoScrollbar<T extends HTMLElement = HTMLDivElement>() {
  const elementRef = useRef<T>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleScroll = () => {
      // Add scrolling class when scroll starts
      if (!element.classList.contains('scrolling')) {
        element.classList.add('scrolling')
      }

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Remove scrolling class after scrolling stops (500ms delay)
      scrollTimeoutRef.current = setTimeout(() => {
        element.classList.remove('scrolling')
      }, 500)
    }

    element.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      element.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return elementRef
}

