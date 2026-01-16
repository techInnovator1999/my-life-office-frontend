'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { validators } from '@/utils/validators'
import { useForgotPassword } from '@/provider/auth'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const forgotPasswordMutation = useForgotPassword()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const emailValidation = validators.combine(validators.required, validators.email)(email)
    if (!emailValidation.isValid) {
      setError(emailValidation.error || 'Invalid email')
      return
    }

    try {
      await forgotPasswordMutation.mutateAsync({ email, isResend: false })
      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send password reset email')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo-main.png"
            alt="CRM Logo"
            width={200}
            height={60}
            className="mb-4"
          />
          <h1 className="text-3xl font-bold text-text-main dark:text-white">Reset Password</h1>
          <p className="text-text-muted dark:text-text-muted-dark mt-2 text-center">
            Enter your email address and we'll send you a verification code to reset your password.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-neutral-200 dark:border-slate-700 p-6">
            <div className="flex items-start gap-3 mb-4">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[24px]">
                check_circle
              </span>
              <div>
                <h2 className="text-lg font-semibold text-text-main dark:text-white mb-2">
                  Email Sent!
                </h2>
                <p className="text-sm text-text-muted dark:text-text-muted-dark">
                  We've sent a verification code to <strong>{email}</strong>. Please check your inbox and follow the instructions to reset your password.
                </p>
              </div>
            </div>
            <Link href="/login">
              <Button className="w-full">Back to Login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-neutral-200 dark:border-slate-700 p-6 space-y-4">
            <Input
              label="Email"
              type="email"
              icon="mail"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error || undefined}
              required
            />

            <Button type="submit" isLoading={forgotPasswordMutation.isPending} className="w-full">
              Send Reset Code
            </Button>

            <div className="text-center">
              <Link href="/login" className="text-sm text-primary hover:text-primary/80 hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

