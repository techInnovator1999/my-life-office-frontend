'use client'

import { PrivateRoute } from '@/components/common/PrivateRoute'
import { usePendingCrmAgents, useApproveAgent } from '@/provider/agents'
import { Button } from '@/components/common/Button'
import { useState } from 'react'

export default function PendingAgentsPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const { data, isLoading, error } = usePendingCrmAgents(page, limit)
  const approveMutation = useApproveAgent()

  const handleApprove = async (agentId: string) => {
    try {
      await approveMutation.mutateAsync(agentId)
    } catch (error) {
      console.error('Failed to approve agent:', error)
    }
  }

  return (
    <PrivateRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-text-main dark:text-white">Pending Agents</h1>
          <p className="text-text-muted dark:text-text-muted-dark mt-1">
            Review and approve pending agent registrations
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="px-4 py-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200">
              {error instanceof Error ? error.message : 'Failed to load pending agents'}
            </p>
          </div>
        )}

        {data && (
          <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-neutral-200 dark:border-slate-700 p-6">
            <p className="text-text-muted dark:text-text-muted-dark">
              {data.total} pending agents found
            </p>
            {/* Pending agents list will be implemented here */}
          </div>
        )}
      </div>
    </PrivateRoute>
  )
}

