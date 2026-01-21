import { useState, useEffect, useCallback } from 'react'

const RESEND_COOLDOWN_SECONDS = 60 // 60 seconds cooldown

/**
 * Custom hook for managing resend code functionality with cooldown timer
 * @param onResend - Function to call when resend is triggered
 * @param cooldownSeconds - Cooldown duration in seconds (default: 60)
 */
export function useResendCode(
  onResend: () => Promise<void>,
  cooldownSeconds: number = RESEND_COOLDOWN_SECONDS
) {
  const [isResending, setIsResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown(cooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const handleResend = useCallback(async () => {
    if (cooldown > 0 || isResending) {
      return
    }

    setIsResending(true)
    setError(null)

    try {
      await onResend()
      setCooldown(cooldownSeconds)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code')
    } finally {
      setIsResending(false)
    }
  }, [cooldown, isResending, onResend, cooldownSeconds])

  const canResend = cooldown === 0 && !isResending

  return {
    handleResend,
    isResending,
    cooldown,
    canResend,
    error,
  }
}
