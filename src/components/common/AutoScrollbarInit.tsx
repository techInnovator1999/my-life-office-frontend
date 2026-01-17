'use client'

/**
 * Auto Scrollbar Initialization Component
 * 
 * Automatically initializes scroll detection for all elements with auto-scrollbar classes.
 * Shows scrollbars only when actively scrolling, hides them otherwise.
 */

import { useEffect } from 'react'

export function AutoScrollbarInit() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const scrollTimeoutMap = new WeakMap<Element, NodeJS.Timeout>()

    const handleScroll = (element: Element) => {
      // Add scrolling class when scroll starts
      if (!element.classList.contains('scrolling')) {
        element.classList.add('scrolling')
      }

      // Clear existing timeout
      const existingTimeout = scrollTimeoutMap.get(element)
      if (existingTimeout) {
        clearTimeout(existingTimeout)
      }

      // Remove scrolling class after scrolling stops (500ms delay)
      const timeout = setTimeout(() => {
        element.classList.remove('scrolling')
        scrollTimeoutMap.delete(element)
      }, 500)

      scrollTimeoutMap.set(element, timeout)
    }

    // Initialize existing elements
    const initElement = (element: Element) => {
      if (
        element.classList.contains('auto-scrollbar') ||
        element.classList.contains('pipeline-scrollbar') ||
        element.classList.contains('stage-column-scrollbar')
      ) {
        element.addEventListener('scroll', () => handleScroll(element), { passive: true })
      }
    }

    // Initialize all existing scrollable elements
    const existingElements = document.querySelectorAll(
      '.auto-scrollbar, .pipeline-scrollbar, .stage-column-scrollbar'
    )
    existingElements.forEach(initElement)

    // Observe DOM for new elements with auto-scrollbar classes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element
            initElement(element)

            // Check children
            const scrollableElements = element.querySelectorAll(
              '.auto-scrollbar, .pipeline-scrollbar, .stage-column-scrollbar'
            )
            scrollableElements.forEach(initElement)
          }
        })
      })
    })

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
      existingElements.forEach((element) => {
        element.removeEventListener('scroll', () => handleScroll(element))
      })
    }
  }, [])

  return null
}

