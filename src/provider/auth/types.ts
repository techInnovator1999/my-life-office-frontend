/**
 * Auth Provider Types
 */

export type LoginCredentials = {
  email: string
  password: string
}

export type UserStatus = {
  id: string
  name?: string
}

export type UserRole = {
  id: string
  name?: string
}

export type LoginResponse = {
  token: string
  refreshToken: string
  tokenExpires: number
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    mobile?: string | null
    registrationType?: string | null
    primaryLicenseType?: string | null
    residentState?: string | null
    licenseNumber?: string | null
    yearsLicensed?: number | null
    priorProductsSold?: string | null
    currentCompany?: string | null
    createdAt?: string | Date | null
    role: UserRole
    status: UserStatus
    isApproved: boolean
    verificationCode?: string | null
    verificationExpires?: Date | null
  }
}

export type UpdateProfileDto = {
  firstName?: string
  lastName?: string
  mobile?: string | null
  primaryLicenseType?: string | null
  residentState?: string | null
  licenseNumber?: string | null
  yearsLicensed?: number | null
  priorProductsSold?: string | null
  currentCompany?: string | null
}

