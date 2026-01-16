'use client'

import { PrivateRoute } from '@/components/common/PrivateRoute'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { useState } from 'react'

export default function SettingsPage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    email: user?.email || '',
    // Add other settings fields as needed
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement settings update
  }

  return (
    <PrivateRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-text-main dark:text-white">Settings</h1>
          <p className="text-text-muted dark:text-text-muted-dark mt-1">
            Manage your account settings
          </p>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-neutral-200 dark:border-slate-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              disabled
              className="bg-neutral-50 dark:bg-slate-800"
            />

            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </div>
      </div>
    </PrivateRoute>
  )
}

