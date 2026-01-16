'use client'

import { PrivateRoute } from '@/components/common/PrivateRoute'
import { useOpportunities } from '@/provider/opportunities'
import { Button } from '@/components/common/Button'

export default function BusinessesPage() {
  const { data: opportunities = [], isLoading, error } = useOpportunities()

  // Filter for business opportunities
  const businessOpportunities = opportunities.filter(
    (opp) => (opp.contact as any)?.contactType === 'BUSINESS'
  )

  return (
    <PrivateRoute>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-text-main dark:text-white">Businesses</h1>
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">
              Manage business opportunities
            </p>
          </div>
          <Button>Add Opportunity</Button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="px-4 py-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200">
              {error instanceof Error ? error.message : 'Failed to load opportunities'}
            </p>
          </div>
        )}

        {businessOpportunities && (
          <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-neutral-200 dark:border-slate-700 p-6">
            <p className="text-text-muted dark:text-text-muted-dark">
              {businessOpportunities.length} business opportunities found
            </p>
            {/* Opportunities list will be implemented here */}
          </div>
        )}
      </div>
    </PrivateRoute>
  )
}

