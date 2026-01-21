'use client'

import { useResendCode } from '@/hooks/useResendCode'

type ResendCodeButtonProps = {
  onResend: () => Promise<void>
  cooldownSeconds?: number
  label?: string
}

export function ResendCodeButton({
  onResend,
  cooldownSeconds = 60,
  label = "Didn't receive the code?",
}: ResendCodeButtonProps) {
  const resendCode = useResendCode(onResend, cooldownSeconds)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {label}
        </span>
        <button
          type="button"
          onClick={resendCode.handleResend}
          disabled={!resendCode.canResend}
          className={`text-sm font-medium transition-colors ${
            resendCode.canResend
              ? 'text-primary hover:text-primary-hover cursor-pointer'
              : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          {resendCode.cooldown > 0 ? (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              Resend in {resendCode.cooldown}s
            </span>
          ) : resendCode.isResending ? (
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              Sending...
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              Resend Code
            </span>
          )}
        </button>
      </div>
      {resendCode.error && (
        <p className="text-sm text-red-600 dark:text-red-400 ml-1">
          {resendCode.error}
        </p>
      )}
    </div>
  )
}
