/**
 * Agent Types
 */

export type Agent = {
  id: string
  firstName?: string | null
  lastName?: string | null
  email: string
  mobile?: string | null
  registrationType?: string | null
  primaryLicenseType?: string | null
  residentState?: string | null
  licenseNumber?: string | null
  yearsLicensed?: number | null
  priorProductsSold?: string | null
  currentCompany?: string | null
  sponsoringAgentId?: string | null
  sponsoringAgent?: Agent | null
  role?: {
    id: string
    name?: string
  }
  status?: {
    id: string
    name?: string
  }
  isApproved: boolean
  createdAt: string
  updatedAt: string
}

export type AgentsResponse = {
  data: Agent[]
  total: number
  page: number
  limit: number
}

