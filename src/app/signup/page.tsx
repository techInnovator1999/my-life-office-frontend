'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { signupSchema, type SignupFormData } from '@/lib/validations'
import { useRegions, useLicenseTypes } from '@/provider/lookup'
import Image from 'next/image'

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDark, setIsDark] = useState(false)

  const { data: regions } = useRegions()
  const { data: licenseTypes } = useLicenseTypes()

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      mobile: '',
      registrationType: undefined,
      primaryLicenseType: '',
      residentState: '',
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
    setIsLoading(true)
    try {
      // TODO: Implement signup logic with useRegister hook
      console.log('Signup data:', data)
      // await registerMutation.mutateAsync(data)
      router.push('/login')
    } catch (error) {
      console.error('Signup error:', error)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="flex h-screen w-full flex-row overflow-hidden bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white antialiased">
      <div className="relative flex w-full flex-col justify-center bg-white dark:bg-surface-dark-alt lg:w-[45%] xl:w-[40%] shadow-2xl z-10">
        <div className="flex h-full w-full flex-col overflow-y-auto no-scrollbar">
          <div className="flex grow flex-col justify-center px-8 py-6 lg:px-12">
            <div className="mx-auto w-full max-w-[420px] flex flex-col gap-6">
              <div className="flex flex-col gap-2 items-center">
                <Image
                  src={isDark ? '/logo-main-light.png' : '/logo-main.png'}
                  alt="CRM Nexus Logo"
                  width={268}
                  height={isDark ? 64 : 48}
                  className="mb-2 object-contain"
                  suppressHydrationWarning
                />
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-neutral-900 dark:text-white">
                  Create Account
                </h1>
                <p className="text-base font-medium text-neutral-500 dark:text-neutral-400 text-center">
                  Sign up to get started with your CRM account.
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-2" autoComplete="off">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
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
                          <FormLabel>Last Name</FormLabel>
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
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            icon="phone"
                            placeholder="+1 (555) 123-4567"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="registrationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Type</FormLabel>
                        <FormControl>
                          <Select
                            options={[
                              { value: 'INDIVIDUAL', label: 'Individual' },
                              { value: 'BUSINESS', label: 'Business' },
                            ]}
                            value={field.value || ''}
                            onChange={field.onChange}
                            placeholder="Select type"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="primaryLicenseType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary License Type</FormLabel>
                        <FormControl>
                          <Select
                            options={licenseTypes?.map((lt) => ({
                              value: lt.id,
                              label: lt.label,
                            })) || []}
                            value={field.value || ''}
                            onChange={field.onChange}
                            placeholder="Select license type"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="residentState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resident State</FormLabel>
                        <FormControl>
                          <Select
                            options={regions?.map((r) => ({
                              value: r.id,
                              label: r.label,
                            })) || []}
                            value={field.value || ''}
                            onChange={field.onChange}
                            placeholder="Select state"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="mt-2 flex w-full items-center justify-center"
                  >
                    <span className="flex items-center gap-2">
                      Sign Up
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                      </span>
                    </span>
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          <div className="px-8 pb-8 pt-4 lg:px-12 text-center lg:text-left">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-primary hover:text-primary/80 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="relative hidden w-0 lg:block lg:w-[55%] xl:w-[60%]">
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
      </div>
    </div>
  )
}

