/**
 * Agents Provider Types
 */

export type Agent = {
  id: string
  firstName: string
  lastName: string
  email: string
  mobile?: string | null
  primaryLicenseType?: string | null
  registrationType?: string | null
  isApproved: boolean
  status?: {
    id: string
    name: string
  }
  createdAt: string
}

export type AgentsResponse = {
  data: Agent[]
  hasNextPage: boolean
  current: number
  limit: number
  total: number
}

