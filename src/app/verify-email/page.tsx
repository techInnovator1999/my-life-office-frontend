'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { AuthVisualSection } from '@/components/common/AuthVisualSection'
import { useConfirmEmail } from '@/provider/auth'
import Image from 'next/image'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const confirmEmailMutation = useConfirmEmail()
  
  const [verificationCode, setVerificationCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setVerificationError('Please enter a 6-digit verification code')
      return
    }

    setIsVerifying(true)
    setVerificationError(null)

    try {
      await confirmEmailMutation.mutateAsync({
        email,
        code: verificationCode,
      })
      
      // Success! Redirect to login
      router.push('/login?verified=true')
    } catch (error) {
      setVerificationError(
        error instanceof Error ? error.message : 'Invalid verification code. Please try again.'
      )
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="flex h-screen w-full flex-row overflow-hidden font-display text-gray-900 dark:text-white antialiased" style={{ backgroundColor: '#eaeef7' }}>
      {/* Left Side: Content Section */}
      <div className="relative flex w-full flex-col justify-center lg:w-[50%] z-10">
        <div className="flex h-full w-full flex-col overflow-y-auto no-scrollbar">
          <div className="flex grow flex-col justify-center px-8 py-6 lg:px-12">
            <div className="mx-auto w-full max-w-[480px]">
              {/* Logo */}
              <div className="flex flex-col gap-2 items-center mb-8">
                <Image
                  src="/logo-main.png"
                  alt="CRM Nexus Logo"
                  width={268}
                  height={48}
                  className="mb-2 object-contain"
                />
              </div>

              {/* Card Container */}
              <div className="bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-neutral-200 dark:border-slate-700 p-8">
                <div className="flex flex-col gap-6">
                  {/* Success Icon */}
                  <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[40px]">
                      mark_email_unread
                    </span>
                  </div>

                  {/* Heading */}
                  <div className="text-center">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-neutral-900 dark:text-white mb-2">
                      Verify Your Email
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      We've sent a verification code to
                    </p>
                    <p className="text-primary font-semibold mt-1">
                      {email}
                    </p>
                  </div>

                  {/* Verification Code Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-200 ml-1">
                      Verification Code
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex gap-3">
                      <Input
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                          setVerificationCode(value)
                          setVerificationError(null)
                        }}
                        maxLength={6}
                        className="flex-1 text-center text-lg tracking-widest font-semibold"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && verificationCode.length === 6) {
                            handleVerifyCode()
                          }
                        }}
                      />
                    </div>
                    {verificationError && (
                      <p className="text-sm text-red-600 dark:text-red-400 ml-1">
                        {verificationError}
                      </p>
                    )}
                  </div>

                  {/* Verify Button */}
                  <Button
                    type="button"
                    onClick={handleVerifyCode}
                    isLoading={isVerifying}
                    disabled={verificationCode.length !== 6 || isVerifying}
                    className="w-full"
                  >
                    <span className="flex items-center gap-2">
                      Verify Email
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                      </span>
                    </span>
                  </Button>

                  {/* Note */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[20px] mt-0.5">
                        info
                      </span>
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        <strong>Note:</strong> After email verification, your account will be pending admin approval. You can log in and complete your profile while waiting for approval.
                      </p>
                    </div>
                  </div>

                  {/* Go to Login */}
                  <div className="text-center">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_back
                      </span>
                      Back to Login
                    </Link>
                  </div>

                  {/* Help Text */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    <p>Check your spam folder if you don't see the email.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Visual Section */}
      <AuthVisualSection />
    </div>
  )
}
