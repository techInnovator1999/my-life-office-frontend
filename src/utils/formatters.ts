/**
 * Formatter Utilities
 * 
 * Helper functions for formatting data
 */

/**
 * Convert string to title case
 */
export function toTitleCase(str: string | null | undefined): string {
  if (!str) return ''
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Format full name from first and last name
 */
export function formatFullName(
  firstName: string | null | undefined,
  lastName: string | null | undefined
): string {
  const first = toTitleCase(firstName)
  const last = toTitleCase(lastName)
  return [first, last].filter(Boolean).join(' ')
}

/**
 * Formats a date as "member since" in human-readable format
 */
export function formatMemberSince(date: string | Date | null | undefined): string {
  if (!date) return '-'
  
  const createdDate = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = now.getTime() - createdDate.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays < 1) {
    return 'Today'
  } else if (diffInDays === 1) {
    return '1 day'
  } else if (diffInDays < 7) {
    return `${diffInDays} days`
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return weeks === 1 ? '1 week' : `${weeks} weeks`
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return months === 1 ? '1 month' : `${months} months`
  } else {
    const years = Math.floor(diffInDays / 365)
    return years === 1 ? '1 year' : `${years} years`
  }
}

