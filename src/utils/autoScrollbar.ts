/**
 * Auto Scrollbar Utility
 * 
 * Automatically adds scroll detection to all elements with auto-scrollbar classes.
 * Shows scrollbars only when actively scrolling, hides them otherwise.
 * 
 * This should be called once on app initialization.
 */

export function initAutoScrollbars() {
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

  // Observe DOM for elements with auto-scrollbar classes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element
          
          // Check if element has auto-scrollbar class
          if (
            element.classList.contains('auto-scrollbar') ||
            element.classList.contains('pipeline-scrollbar') ||
            element.classList.contains('stage-column-scrollbar')
          ) {
            element.addEventListener('scroll', () => handleScroll(element), { passive: true })
          }

          // Check children
          const scrollableElements = element.querySelectorAll(
            '.auto-scrollbar, .pipeline-scrollbar, .stage-column-scrollbar'
          )
          scrollableElements.forEach((el) => {
            el.addEventListener('scroll', () => handleScroll(el), { passive: true })
          })
        }
      })
    })
  })

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })

  // Initialize existing elements
  const existingElements = document.querySelectorAll(
    '.auto-scrollbar, .pipeline-scrollbar, .stage-column-scrollbar'
  )
  existingElements.forEach((element) => {
    element.addEventListener('scroll', () => handleScroll(element), { passive: true })
  })

  return () => {
    observer.disconnect()
    existingElements.forEach((element) => {
      element.removeEventListener('scroll', () => handleScroll(element))
    })
  }
}

