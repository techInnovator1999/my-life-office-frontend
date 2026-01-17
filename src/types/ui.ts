/**
 * UI Component Types
 * Types for reusable UI components
 */

import * as React from 'react'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  icon?: string
  error?: string
  required?: boolean
}

export type SelectOption = {
  value: string
  label: string
}

export type SelectProps = {
  label?: string
  icon?: string
  options: SelectOption[]
  value?: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  required?: boolean
  placeholder?: string
  searchable?: boolean
  disabled?: boolean
}

// ButtonProps is defined in components/common/Button/Button.tsx
// because it depends on buttonVariants from that file
// Import it directly from the component if needed

