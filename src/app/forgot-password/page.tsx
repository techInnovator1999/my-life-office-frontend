'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations'
import { useForgotPassword } from '@/provider/auth'
import Image from 'next/image'
import { AuthVisualSection } from '@/components/common/AuthVisualSection'

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const forgotPasswordMutation = useForgotPassword()

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, [])

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordMutation.mutateAsync({ email: data.email, isResend: false })
      setIsSuccess(true)
    } catch (err) {
      form.setError('email', {
        type: 'manual',
        message: err instanceof Error ? err.message : 'Failed to send password reset email',
      })
    }
  }

  return (
    <div className="flex h-screen w-full flex-row overflow-hidden font-display text-gray-900 dark:text-white antialiased bg-gray-50 dark:bg-slate-900">
      {/* Left Side: Form Section */}
      <div className="relative flex w-full flex-col justify-center lg:w-[50%] z-10">
        <div className="flex h-full w-full flex-col overflow-y-auto no-scrollbar">
          <div className="flex grow flex-col justify-center px-8 py-6 lg:px-12">
            <div className="mx-auto w-full max-w-[480px]">
              <div className="flex flex-col gap-2 items-center mb-8">
                <Image
                  src={isDark ? '/logo-main-light.png' : '/logo-main.png'}
                  alt="CRM Logo"
                  width={268}
                  height={isDark ? 64 : 48}
                  className="mb-2 object-contain"
                  suppressHydrationWarning
                />
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-neutral-900 dark:text-white">
                  Forgot Password
                </h1>
              </div>
              {/* Card Container */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-neutral-200 dark:border-slate-700 p-8">
                <div className="flex flex-col gap-6">

                  {isSuccess ? (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[24px]">
                          check_circle
                        </span>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Email Sent!
                          </h2>
                          <p className="text-sm text-gray-600 dark:text-slate-400">
                            We've sent a verification code to <strong>{form.getValues('email')}</strong>. Please check your inbox and follow the instructions to reset your password.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Link href={`/reset-password?email=${encodeURIComponent(form.getValues('email'))}`}>
                          <Button className="w-full">
                            Continue to Reset Password
                          </Button>
                        </Link>
                        <Link href="/login" className="text-center">
                          <span className="text-sm text-primary hover:text-primary/80 hover:underline">
                            Back to Login
                          </span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
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

                        <Button type="submit" isLoading={forgotPasswordMutation.isPending} className="w-full">
                          Send Reset Code
                        </Button>

                        <div className="text-center">
                          <Link href="/login" className="text-sm text-primary hover:text-primary/80 hover:underline">
                            Back to Login
                          </Link>
                        </div>
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
      <AuthVisualSection />
    </div>
  )
}

