/**
 * Contact Service
 * 
 * Handles API calls for contacts
 */

import api from './api'
import type { Contact, CreateContactDto, UpdateContactDto } from '@/provider/contacts/types'

/**
 * Get all contacts for current user
 */
export async function getContacts(): Promise<Contact[]> {
  const response = await api.get<Contact[]>('/contacts')
  return response.data
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

