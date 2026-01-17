'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { PasswordStrength } from '@/components/common/PasswordStrength'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { verifyResetCodeSchema, resetPasswordSchema, type VerifyResetCodeFormData, type ResetPasswordFormData } from '@/lib/validations'
import { useResetPassword, useVerifyPasswordResetCode } from '@/provider/auth'
import Image from 'next/image'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<'verify' | 'reset'>('verify')
  const [verifiedEmail, setVerifiedEmail] = useState('')
  const [verifiedCode, setVerifiedCode] = useState('')
  
  const verifyForm = useForm<VerifyResetCodeFormData>({
    resolver: zodResolver(verifyResetCodeSchema),
    defaultValues: {
      email: '',
      code: '',
    },
  })

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const verifyMutation = useVerifyPasswordResetCode()
  const resetMutation = useResetPassword()

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      verifyForm.setValue('email', emailParam)
    }
  }, [searchParams, verifyForm])

  const onVerifyCode = async (data: VerifyResetCodeFormData) => {
    try {
      await verifyMutation.mutateAsync({ email: data.email, code: data.code })
      setVerifiedEmail(data.email)
      setVerifiedCode(data.code)
      setStep('reset')
    } catch (err) {
      verifyForm.setError('code', {
        type: 'manual',
        message: err instanceof Error ? err.message : 'Invalid verification code',
      })
    }
  }

  const onResetPassword = async (data: ResetPasswordFormData) => {
    try {
      await resetMutation.mutateAsync({ email: verifiedEmail, password: data.password, code: verifiedCode })
      router.push('/login')
    } catch (err) {
      resetForm.setError('root', {
        type: 'manual',
        message: err instanceof Error ? err.message : 'Failed to reset password',
      })
    }
  }

  return (
    <div className="flex h-screen w-full flex-row overflow-hidden font-display text-gray-900 dark:text-white antialiased" style={{ backgroundColor: '#eaeef7' }}>
      {/* Left Side: Form Section */}
      <div className="relative flex w-full flex-col justify-center lg:w-[50%] z-10">
        <div className="flex h-full w-full flex-col overflow-y-auto no-scrollbar">
          <div className="flex grow flex-col justify-center px-8 py-6 lg:px-12">
            <div className="mx-auto w-full max-w-[480px]">
              <div className="flex flex-col gap-2 items-center mb-8">
                <Image
                  src="/logo-main.png"
                  alt="CRM Logo"
                  width={200}
                  height={60}
                  className="mb-2 object-contain"
                  suppressHydrationWarning
                />
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-neutral-900 dark:text-white">
                  {step === 'verify' ? 'Verify Code' : 'Reset Password'}
                </h1>
              </div>
              {/* Card Container */}
              <div className="bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-neutral-200 dark:border-slate-700 p-8">
                <div className="flex flex-col gap-6">

                  {step === 'verify' ? (
                    <Form {...verifyForm}>
                      <form onSubmit={verifyForm.handleSubmit(onVerifyCode)} className="space-y-4">
                        <FormField
                          control={verifyForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  icon="mail"
                                  placeholder="name@company.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={verifyForm.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Verification Code</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Enter 6-digit code"
                                  maxLength={6}
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                                    field.onChange(value)
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" isLoading={verifyMutation.isPending} className="w-full">
                          Verify Code
                        </Button>

                        <div className="text-center">
                          <Link href="/login" className="text-sm text-primary hover:text-primary/80 hover:underline">
                            Back to Login
                          </Link>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <Form {...resetForm}>
                      <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-4">
                        <FormField
                          control={resetForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                New Password
                                <span className="text-red-500 ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  autoComplete="new-password"
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <PasswordStrength password={field.value} />
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={resetForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  autoComplete="new-password"
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {resetForm.formState.errors.root && (
                          <div className="text-sm text-red-600 dark:text-red-400">
                            {resetForm.formState.errors.root.message}
                          </div>
                        )}

                        <Button type="submit" isLoading={resetMutation.isPending} className="w-full">
                          Reset Password
                        </Button>
                      </form>
                    </Form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Visual Section */}
      <div className="relative hidden w-0 lg:block lg:w-[50%]">
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://img.freepik.com/free-vector/background-realistic-abstract-technology-particle_23-2148431735.jpg?semt=ais_hybrid&w=740&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/50 to-transparent"></div>
        </div>

        {/* Floating Content on Right Side */}
        <div className="absolute inset-0 flex flex-col justify-end p-16 xl:p-24">
          <div className="max-w-2xl text-white">
            <div className="mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
              <span className="flex items-center gap-2 text-sm font-medium tracking-wide">
                <span className="material-symbols-outlined text-base">auto_awesome</span>
                <span>New v2.0 Released</span>
              </span>
            </div>
            <h2 className="mb-6 text-5xl font-black leading-tight tracking-tight lg:text-6xl drop-shadow-sm">
              Unlock your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                sales potential.
              </span>
            </h2>
            <p className="mb-8 text-xl font-light text-purple-50 max-w-lg leading-relaxed opacity-90">
              Join the next generation of Lead & Opportunity Management. Transform how you connect with customers
              today.
            </p>
            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-black/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm border border-white/10">
                <span className="material-symbols-outlined text-[18px]">analytics</span>
                Smart Analytics
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-black/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm border border-white/10">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                Real-time Sync
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-black/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm border border-white/10">
                <span className="material-symbols-outlined text-[18px]">security</span>
                Enterprise Security
              </div>
            </div>
          </div>
        </div>
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

