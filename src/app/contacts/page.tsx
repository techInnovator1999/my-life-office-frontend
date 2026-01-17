'use client'

import { useState } from 'react'
import { PrivateRoute } from '@/components/common/PrivateRoute'
import { useContacts, useDeleteContact } from '@/provider/contacts'
import { Button } from '@/components/common/Button'
import { formatFullName } from '@/utils/formatters'

type ContactSource = 'Main Contact' | 'Google Contacts' | 'Lead Buckets' | 'Referral Partners'

export default function ContactsPage() {
  const { data: contactsData, isLoading, error } = useContacts()
  const deleteMutation = useDeleteContact()
  const [selectedContactType, setSelectedContactType] = useState<'Individual' | 'Business'>('Individual')
  const [selectedContactSource, setSelectedContactSource] = useState<ContactSource>('Main Contact')
  
  // Ensure contacts is always an array
  const contacts = (() => {
    if (Array.isArray(contactsData)) {
      return contactsData
    }
    if (contactsData && typeof contactsData === 'object' && 'data' in contactsData) {
      const data = (contactsData as { data: unknown }).data
      return Array.isArray(data) ? data : []
    }
    return []
  })()

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        console.error('Failed to delete contact:', error)
      }
    }
  }

  return (
    <PrivateRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-display">Contact</h1>
          <Button>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">add</span>
              Add Contact
            </span>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Contact Type Filters */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Type:</span>
            <button
              onClick={() => setSelectedContactType('Individual')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedContactType === 'Individual'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-neutral-200 dark:border-slate-700 hover:bg-neutral-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
              Individual
            </button>
            <button
              onClick={() => setSelectedContactType('Business')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedContactType === 'Business'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-neutral-200 dark:border-slate-700 hover:bg-neutral-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">business</span>
              Business
            </button>
          </div>

          {/* Contact Source Filters */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Source:</span>
            {(['Main Contact', 'Google Contacts', 'Lead Buckets', 'Referral Partners'] as ContactSource[]).map((source) => (
              <button
                key={source}
                onClick={() => setSelectedContactSource(source)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  selectedContactSource === source
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-neutral-200 dark:border-slate-700 hover:bg-neutral-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {source === 'Google Contacts' && <span className="text-[18px] font-bold">G</span>}
                {source === 'Main Contact' && <span className="material-symbols-outlined text-[18px]">person</span>}
                {source === 'Lead Buckets' && <span className="material-symbols-outlined text-[18px]">shopping_basket</span>}
                {source === 'Referral Partners' && <span className="material-symbols-outlined text-[18px]">diamond</span>}
                {source}
              </button>
            ))}
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="sm">
            <span className="material-symbols-outlined text-[18px]">view_column</span>
            Columns
          </Button>
          <Button variant="secondary" size="sm">
            <span className="material-symbols-outlined text-[18px]">tune</span>
            Filters
          </Button>
          <Button variant="secondary" size="sm">
            <span className="material-symbols-outlined text-[18px]">view_agenda</span>
            Density
          </Button>
          <Button variant="secondary" size="sm">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </Button>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="px-4 py-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200">
              {error instanceof Error ? error.message : 'Failed to load contacts'}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-neutral-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto auto-scrollbar">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-slate-800er border-b border-neutral-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-slate-700">
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-600 dark:text-slate-400">
                        No contacts found
                      </td>
                    </tr>
                  ) : (
                    contacts.map((contact) => (
                      <tr
                        key={contact.id}
                        className="hover:bg-neutral-50 dark:hover:bg-surface-darker transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {contact.id.slice(0, 8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {formatFullName(contact.firstName, contact.lastName)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {contact.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {contact.contactType || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {contact.phoneNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDelete(contact.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
                            aria-label="Delete contact"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PrivateRoute>
  )
}

