'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as contactService from '@/services/contactService'
import type { Contact, CreateContactDto, UpdateContactDto } from './types'
import { contactKeys } from './index'

/**
 * Get all contacts
 */
export const useContacts = () => {
  return useQuery({
    queryKey: contactKeys.all,
    queryFn: () => contactService.getContacts(),
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Get contact by ID
 */
export const useContact = (id: string) => {
  return useQuery({
    queryKey: contactKeys.detail(id),
    queryFn: () => contactService.getContactById(id),
    enabled: !!id,
  })
}

/**
 * Create contact mutation
 */
export const useCreateContact = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateContactDto) => contactService.createContact(data),
    onSuccess: () => {
      // Invalidate contacts list
      queryClient.invalidateQueries({ queryKey: contactKeys.all })
    },
  })
}

/**
 * Update contact mutation
 */
export const useUpdateContact = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContactDto }) =>
      contactService.updateContact(id, data),
    onSuccess: (data) => {
      // Update specific contact in cache
      queryClient.setQueryData(contactKeys.detail(data.id), data)
      // Invalidate contacts list
      queryClient.invalidateQueries({ queryKey: contactKeys.all })
    },
  })
}

/**
 * Delete contact mutation
 */
export const useDeleteContact = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => contactService.deleteContact(id),
    onSuccess: () => {
      // Invalidate contacts list
      queryClient.invalidateQueries({ queryKey: contactKeys.all })
    },
  })
}

