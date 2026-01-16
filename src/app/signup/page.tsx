'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { validators } from '@/utils/validators'
import { useRegions, useLicenseTypes } from '@/provider/lookup'
import Image from 'next/image'

type FormErrors = {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
  mobile?: string
  registrationType?: string
  primaryLicenseType?: string
  residentState?: string
}

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    registrationType: '',
    primaryLicenseType: '',
    residentState: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDark, setIsDark] = useState(false)

  const { data: regions } = useRegions()
  const { data: licenseTypes } = useLicenseTypes()

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

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return validators.combine(validators.required, validators.minLength(2))(value)
      case 'email':
        return validators.combine(validators.required, validators.email)(value)
      case 'password':
        return validators.combine(validators.required, validators.minLength(8))(value)
      case 'confirmPassword':
        return validators.passwordMatch(formData.password)(value)
      default:
        return { isValid: true }
    }
  }

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const result = validateField(name, value)
      setErrors((prev) => ({
        ...prev,
        [name]: result.isValid ? undefined : result.error,
      }))
    }
  }

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    const result = validateField(name, formData[name as keyof typeof formData])
    setErrors((prev) => ({
      ...prev,
      [name]: result.isValid ? undefined : result.error,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement signup logic
    router.push('/login')
  }

  const registrationTypeOptions = [
    { value: 'INDIVIDUAL', label: 'Individual' },
    { value: 'BUSINESS', label: 'Business' },
  ]

  const licenseTypeOptions = licenseTypes?.map((lt) => ({
    value: lt.id,
    label: lt.label,
  })) || []

  const regionOptions = regions?.map((r) => ({
    value: r.id,
    label: r.label,
  })) || []

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

              <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2" autoComplete="off">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    onBlur={() => handleBlur('firstName')}
                    error={errors.firstName}
                    required
                  />
                  <Input
                    label="Last Name"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    onBlur={() => handleBlur('lastName')}
                    error={errors.lastName}
                    required
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  icon="mail"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  error={errors.email}
                  required
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-200 ml-1">
                    Password
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative group">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      onBlur={() => handleBlur('password')}
                      error={errors.password}
                      autoComplete="new-password"
                    />
                    {formData.password.length > 0 && (
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
                </div>

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  error={errors.confirmPassword}
                  required
                />

                <Input
                  label="Mobile"
                  type="tel"
                  icon="phone"
                  placeholder="+1 (555) 123-4567"
                  value={formData.mobile}
                  onChange={(e) => handleChange('mobile', e.target.value)}
                />

                <Select
                  label="Registration Type"
                  options={registrationTypeOptions}
                  value={formData.registrationType}
                  onChange={(value) => handleChange('registrationType', value)}
                  placeholder="Select type"
                  required
                />

                <Select
                  label="Primary License Type"
                  options={licenseTypeOptions}
                  value={formData.primaryLicenseType}
                  onChange={(value) => handleChange('primaryLicenseType', value)}
                  placeholder="Select license type"
                />

                <Select
                  label="Resident State"
                  options={regionOptions}
                  value={formData.residentState}
                  onChange={(value) => handleChange('residentState', value)}
                  placeholder="Select state"
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

