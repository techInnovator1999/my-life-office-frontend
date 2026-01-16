'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { PasswordStrength } from '@/components/common/PasswordStrength'
import { validators } from '@/utils/validators'
import { useResetPassword, useVerifyPasswordResetCode } from '@/provider/auth'
import Image from 'next/image'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<'verify' | 'reset'>('verify')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const verifyMutation = useVerifyPasswordResetCode()
  const resetMutation = useResetPassword()

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !code) {
      setError('Email and verification code are required')
      return
    }

    try {
      await verifyMutation.mutateAsync({ email, code })
      setStep('reset')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code')
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const passwordValidation = validators.combine(validators.required, validators.minLength(8))(password)
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error || 'Invalid password')
      return
    }

    const matchValidation = validators.passwordMatch(password)(confirmPassword)
    if (!matchValidation.isValid) {
      setError(matchValidation.error || 'Passwords do not match')
      return
    }

    try {
      await resetMutation.mutateAsync({ email, password, code })
      router.push('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password')
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
          <h1 className="text-3xl font-bold text-text-main dark:text-white">
            {step === 'verify' ? 'Verify Code' : 'Reset Password'}
          </h1>
        </div>

        {step === 'verify' ? (
          <form onSubmit={handleVerifyCode} className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-neutral-200 dark:border-slate-700 p-6 space-y-4">
            <Input
              label="Email"
              type="email"
              icon="mail"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Verification Code"
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                setCode(value)
              }}
              maxLength={6}
              required
            />

            {error && (
              <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
            )}

            <Button type="submit" isLoading={verifyMutation.isPending} className="w-full">
              Verify Code
            </Button>

            <div className="text-center">
              <Link href="/login" className="text-sm text-primary hover:text-primary/80 hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-neutral-200 dark:border-slate-700 p-6 space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-200 ml-1">
                New Password
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <PasswordStrength password={password} />
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : undefined}
              required
            />

            {error && (
              <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
            )}

            <Button type="submit" isLoading={resetMutation.isPending} className="w-full">
              Reset Password
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}

