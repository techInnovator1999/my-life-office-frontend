'use client'

import { PrivateRoute } from '@/components/common/PrivateRoute'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import { usePendingCrmAgents, useApproveAgent } from '@/provider/agents'
import { useState } from 'react'
import { formatFullName } from '@/utils/formatters'
import type { Agent } from '@/types/agent'

export default function PendingAgentsPage() {
  const [page] = useState(1)
  const [limit] = useState(10)
  const { data, isLoading, error } = usePendingCrmAgents(page, limit)
  const approveMutation = useApproveAgent()
  
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [agentToApprove, setAgentToApprove] = useState<Agent | null>(null)

  const agents = data?.data || []

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleApproveClick = (agent: Agent) => {
    setAgentToApprove(agent)
    setShowConfirmModal(true)
  }

  const handleConfirmApprove = async () => {
    if (!agentToApprove) return

    try {
      await approveMutation.mutateAsync(agentToApprove.id)
      setShowConfirmModal(false)
      setAgentToApprove(null)
    } catch (err) {
      // Error is handled by the mutation
      setShowConfirmModal(false)
      setAgentToApprove(null)
    }
  }

  const handleCancelApprove = () => {
    setShowConfirmModal(false)
    setAgentToApprove(null)
  }

  return (
    <PrivateRoute>
      <>
        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showConfirmModal && !!agentToApprove}
          onClose={handleCancelApprove}
          onConfirm={handleConfirmApprove}
          title="Approve Agent"
          message={`Are you sure you want to approve ${agentToApprove ? formatFullName(agentToApprove.firstName, agentToApprove.lastName) : 'this agent'}? This will allow them to access the CRM system.`}
          highlightText={agentToApprove ? formatFullName(agentToApprove.firstName, agentToApprove.lastName) : ''}
          confirmText="Approve"
          cancelText="Cancel"
          confirmVariant="primary"
          isLoading={approveMutation.isPending}
          icon="check_circle"
          iconColor="text-primary"
        />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pending Agents</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">
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

          {!isLoading && !error && (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-neutral-200 dark:border-slate-700 overflow-hidden">
        {data && (
                <div className="px-6 py-4 border-b border-neutral-200 dark:border-slate-700">
                  <p className="text-sm text-gray-600 dark:text-slate-400">
              {data.total} pending agents found
            </p>
                </div>
              )}
              <div className="overflow-x-auto auto-scrollbar">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-slate-800 border-b border-neutral-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Mobile
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        License Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Registered
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-slate-700">
                    {agents.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-600 dark:text-slate-400">
                          No pending agents found
                        </td>
                      </tr>
                    ) : (
                      agents.map((agent) => (
                        <tr
                          key={agent.id}
                          className="hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {formatFullName(agent.firstName, agent.lastName)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {agent.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {agent.mobile || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {agent.primaryLicenseType || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                              Pending
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {formatDate(agent.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleApproveClick(agent)}
                                disabled={approveMutation.isPending}
                                className="px-3 py-1.5 text-xs font-medium bg-primary text-white rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Approve
                              </button>
                            </div>
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
      </>
    </PrivateRoute>
  )
}

