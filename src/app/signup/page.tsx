'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { PasswordStrength } from '@/components/common/PasswordStrength'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { signupSchema, type SignupFormData } from '@/lib/validations'
import { useLicenseTypes } from '@/provider/lookup'
import { useRegister } from '@/provider/auth'
import Image from 'next/image'
import { AuthVisualSection } from '@/components/common/AuthVisualSection'

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [showLicenseModal, setShowLicenseModal] = useState(false)
  const [selectedLicenseType, setSelectedLicenseType] = useState<string>('')
  const [isLicenseConfirmed, setIsLicenseConfirmed] = useState(false)

  const { data: licenseTypes } = useLicenseTypes()
  const registerMutation = useRegister()

  // Map license type labels to display format
  const getDisplayLabel = (label: string): string => {
    const labelLower = label.toLowerCase()
    if (labelLower.includes('life and health') || labelLower.includes('life & health')) {
      return 'Life and Health License'
    }
    if (labelLower.includes('life-only') || labelLower.includes('life only')) {
      return 'Life Only'
    }
    if (labelLower.includes('health-only') || labelLower.includes('health only')) {
      return 'Health Only'
    }
    if (labelLower.includes('securities') || labelLower.includes('security')) {
      return 'Securities License'
    }
    if (labelLower.includes('not currently') || labelLower.includes('not licensed') || labelLower.includes('committed') || labelLower.includes('getting licensed')) {
      return 'Committed to getting licensed'
    }
    return label
  }

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      primaryLicenseType: '',
    },
  })

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

  const onSubmit = async (data: SignupFormData) => {
    if (!agreeToTerms) {
      form.setError('root', {
        type: 'manual',
        message: 'Please agree to the Terms of Service and Privacy Policy',
      })
      return
    }
    if (!isLicenseConfirmed || !selectedLicenseType) {
      form.setError('primaryLicenseType', {
        type: 'manual',
        message: 'Please confirm your license type',
      })
      return
    }
    
    try {
      await registerMutation.mutateAsync(data)
      router.push('/login')
    } catch (error: any) {
      console.error('Signup error:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create account. Please try again.'
      form.setError('root', {
        type: 'manual',
        message: errorMessage,
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
                  src={isDark ? '/logo-main-light.png' : '/logo-main.png'}
                  alt="CRM Nexus Logo"
                  width={268}
                  height={isDark ? 64 : 48}
                  className="mb-2 object-contain"
                  suppressHydrationWarning
                />
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-neutral-900 dark:text-white">
                  Create your CRM Account
                </h1>
              </div>
              {/* Card Container */}
              <div className="bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-neutral-200 dark:border-slate-700 p-8">
                <div className="flex flex-col gap-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-2" autoComplete="off">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name <span className="text-red-500 ml-1">*</span></FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="John"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name <span className="text-red-500 ml-1">*</span></FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Doe"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Email <span className="text-red-500 ml-1">*</span></FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            icon="mail"
                            placeholder="name@company.com"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Password
                            <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                {...field}
                              />
                              {field.value && field.value.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none dark:hover:text-neutral-200 transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[20px]">
                                    {showPassword ? 'visibility' : 'visibility_off'}
                                  </span>
                                </button>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                          {field.value && <PasswordStrength password={field.value} />}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Confirm Password
                            <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                {...field}
                              />
                              {field.value && field.value.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none dark:hover:text-neutral-200 transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[20px]">
                                    {showConfirmPassword ? 'visibility' : 'visibility_off'}
                                  </span>
                                </button>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 items-center">
                      <input
                        className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-primary/25 dark:border-neutral-600 dark:bg-neutral-700"
                        id="terms"
                        type="checkbox"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label className="font-medium text-gray-600 dark:text-gray-400" htmlFor="terms">
                        I agree to the{' '}
                        <a className="font-bold text-primary hover:underline" href="#">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a className="font-bold text-primary hover:underline" href="#">
                          Privacy Policy
                        </a>
                        .
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                    </div>
                  </div>

                  {/* License Type Checkbox */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 items-center">
                      <input
                        className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-primary/25 dark:border-neutral-600 dark:bg-neutral-700 cursor-pointer"
                        id="license"
                        type="checkbox"
                        checked={isLicenseConfirmed}
                        onChange={() => {
                          if (!isLicenseConfirmed) {
                            setShowLicenseModal(true)
                          } else {
                            setIsLicenseConfirmed(false)
                            setSelectedLicenseType('')
                            form.setValue('primaryLicenseType', '')
                          }
                        }}
                        readOnly
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label className="font-medium text-gray-600 dark:text-gray-400 cursor-pointer" htmlFor="license">
                        I attest that I am a Licensed Financial Services Professional
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                    </div>
                  </div>
                  {form.formState.errors.primaryLicenseType && (
                    <p className="text-sm text-red-600 dark:text-red-400 ml-8">
                      {form.formState.errors.primaryLicenseType.message}
                    </p>
                  )}

                  {form.formState.errors.root && (
                    <div className="text-sm text-red-600 dark:text-red-400">
                      {form.formState.errors.root.message}
                    </div>
                  )}

                  <Button
                    type="submit"
                    isLoading={registerMutation.isPending}
                    className="mt-2 flex w-full items-center justify-center"
                  >
                    <span className="flex items-center gap-2">
                      Create Account
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                      </span>
                    </span>
                  </Button>
                </form>
              </Form>

              {/* Footer Area */}
              <div className="text-center pt-4 border-t border-neutral-200 dark:border-slate-700 mt-6">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Already a member?{' '}
                  <Link href="/login" className="font-bold text-primary hover:text-primary/80 hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Visual Section */}
      <AuthVisualSection />

      {/* License Type Selection Modal */}
      {showLicenseModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50"
            onClick={() => setShowLicenseModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-surface-dark rounded-lg shadow-xl border border-neutral-200 dark:border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                    verified
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Professional Certification
                  </h2>
                </div>

                {/* Modal Description */}
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  I attest that I am a Financial Services Professional and I am certified to practice in one of the following industries:
                </p>

                {/* License Types List - Read Only View */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-lg p-4 mb-6">
                  {licenseTypes?.map((licenseType) => (
                    <div
                      key={licenseType.id}
                      className="flex items-center gap-3"
                    >
                      <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                        check_circle
                      </span>
                      <span className="text-gray-900 dark:text-white font-bold">
                        {getDisplayLabel(licenseType.label)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Confirmation Statement */}
                <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-lg p-2 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[20px] mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>
                      info
                    </span>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                      By clicking "Yes, I Confirm", you attest that you meet one of the criteria above.
                    </p>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowLicenseModal(false)
                      setSelectedLicenseType('')
                    }}
                    className="px-6"
                  >
                    NO, CANCEL
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      // Read-only view - set first license type as default
                      if (licenseTypes && licenseTypes.length > 0) {
                        const firstLicenseType = licenseTypes[0]
                        setIsLicenseConfirmed(true)
                        setSelectedLicenseType(firstLicenseType.id)
                        form.setValue('primaryLicenseType', firstLicenseType.id)
                        setShowLicenseModal(false)
                      }
                    }}
                    className="px-6"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">
                        check
                      </span>
                      YES, I CONFIRM
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

