/**
 * Contact Service
 * 
 * Handles API calls for contacts
 */

import api from './api'
import type { Contact, CreateContactDto, UpdateContactDto } from '@/provider/contacts/types'

/**
 * Paginated response type from backend
 */
type PaginatedResponse<T> = {
  data: T[]
  hasNextPage: boolean
  hasPreviousPage: boolean
  total: number
}

/**
 * Get all contacts for current user
 */
export async function getContacts(): Promise<Contact[]> {
  const response = await api.get<PaginatedResponse<Contact> | Contact[]>('/contacts')
  
  // Handle paginated response: { data: [...], hasNextPage, hasPreviousPage, total }
  if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
    return response.data.data
  }
  
  // If response.data is already an array, return it
  if (Array.isArray(response.data)) {
    return response.data
  }
  
  // Fallback to empty array if structure is unexpected
  console.warn('Unexpected contacts API response structure:', response.data)
  return []
}

/**
 * Get contact by ID
 */
export async function getContactById(id: string): Promise<Contact> {
  const response = await api.get<Contact>(`/contacts/${id}`)
  return response.data
}

/**
 * Create contact
 */
export async function createContact(data: CreateContactDto): Promise<Contact> {
  const response = await api.post<Contact>('/contacts', data)
  return response.data
}

/**
 * Update contact
 */
export async function updateContact(id: string, data: UpdateContactDto): Promise<Contact> {
  const response = await api.put<Contact>(`/contacts/${id}`, data)
  return response.data
}

/**
 * Delete contact
 */
export async function deleteContact(id: string): Promise<void> {
  await api.delete(`/contacts/${id}`)
}

