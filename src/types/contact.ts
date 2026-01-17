/**
 * Contact Types
 */

export enum ContactType {
  INDIVIDUAL = 'INDIVIDUAL',
  BUSINESS = 'BUSINESS',
  EMPLOYEE = 'EMPLOYEE',
}

export enum ContactStatus {
  PROSPECT = 'PROSPECT',
  CLIENT = 'CLIENT',
  LOST = 'LOST',
}

export type Contact = {
  id: string
  contactType: ContactType
  firstName?: string | null
  lastName?: string | null
  email: string
  phoneNumber?: string | null
  workPhone?: string | null
  dateOfBirth?: string | null
  primaryAddress?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
  occupation?: string | null
  employer?: string | null
  spouse?: string | null
  ssn?: string | null
  mbiNumber?: string | null
  companyName?: string | null
  industryType?: string | null
  ownerName?: string | null
  ownerTitle?: string | null
  ownerEmail?: string | null
  ownerPhone?: string | null
  otherName?: string | null
  otherTitle?: string | null
  otherEmail?: string | null
  otherPhone?: string | null
  parentCompany?: string | null
  notes?: string | null
  source?: string | null
  referredBy?: string | null
  status: ContactStatus
  isLocked: boolean
  lockedAt?: string | null
  lockedBy?: string | null
  isFromGoogle: boolean
  googleContactId?: string | null
  googleTags: string[]
  lastSyncedAt?: string | null
  agentId: string
  agent?: {
    id: string
    firstName?: string | null
    lastName?: string | null
    email?: string | null
  }
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export type CreateContactDto = {
  contactType?: ContactType
  firstName?: string | null
  lastName?: string | null
  email: string
  phoneNumber?: string | null
  workPhone?: string | null
  dateOfBirth?: string | null
  primaryAddress?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
  occupation?: string | null
  employer?: string | null
  spouse?: string | null
  ssn?: string | null
  mbiNumber?: string | null
  companyName?: string | null
  industryType?: string | null
  ownerName?: string | null
  ownerTitle?: string | null
  ownerEmail?: string | null
  ownerPhone?: string | null
  otherName?: string | null
  otherTitle?: string | null
  otherEmail?: string | null
  otherPhone?: string | null
  parentCompany?: string | null
  notes?: string | null
  source?: string | null
  referredBy?: string | null
  status?: ContactStatus
  isLocked?: boolean
  isFromGoogle?: boolean
  googleContactId?: string | null
  googleTags?: string[]
  agentId?: string
}

export type UpdateContactDto = {
  contactType?: ContactType
  firstName?: string | null
  lastName?: string | null
  email?: string
  phoneNumber?: string | null
  workPhone?: string | null
  dateOfBirth?: string | null
  primaryAddress?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
  occupation?: string | null
  employer?: string | null
  spouse?: string | null
  ssn?: string | null
  mbiNumber?: string | null
  companyName?: string | null
  industryType?: string | null
  ownerName?: string | null
  ownerTitle?: string | null
  ownerEmail?: string | null
  ownerPhone?: string | null
  otherName?: string | null
  otherTitle?: string | null
  otherEmail?: string | null
  otherPhone?: string | null
  parentCompany?: string | null
  notes?: string | null
  source?: string | null
  referredBy?: string | null
  status?: ContactStatus
  isLocked?: boolean
  isFromGoogle?: boolean
  googleContactId?: string | null
  googleTags?: string[]
}

