'use client'

import { PrivateRoute } from '@/components/common/PrivateRoute'
import { useCrmAgents } from '@/provider/agents'
import { Button } from '@/components/common/Button'
import { useState } from 'react'

export default function AgentsPage() {
  const [page] = useState(1)
  const [limit] = useState(10)
  const { data, isLoading, error } = useCrmAgents(page, limit)

  return (
    <PrivateRoute>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-main dark:text-white">Agents</h1>
            <p className="text-text-muted dark:text-text-muted-dark mt-1">
              Manage CRM agents
            </p>
          </div>
          <Button>Add Agent</Button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="px-4 py-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200">
              {error instanceof Error ? error.message : 'Failed to load agents'}
            </p>
          </div>
        )}

        {data && (
          <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-neutral-200 dark:border-slate-700 p-6">
            <p className="text-text-muted dark:text-text-muted-dark">
              {data.total} agents found
            </p>
            {/* Agents list will be implemented here */}
          </div>
        )}
      </div>
    </PrivateRoute>
  )
}

