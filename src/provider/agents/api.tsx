'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as agentService from '@/services/agentService'
import type { AgentsResponse } from './types'
import { agentKeys } from './index'

/**
 * Get all CRM agents
 */
export const useCrmAgents = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: agentKeys.list({ page, limit }),
    queryFn: () => agentService.getCrmAgents(page, limit),
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Get pending CRM agents
 */
export const usePendingCrmAgents = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: agentKeys.pending({ page, limit }),
    queryFn: () => agentService.getPendingCrmAgents(page, limit),
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Approve agent mutation
 */
export const useApproveAgent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (agentId: string) => agentService.approveAgent(agentId),
    onSuccess: () => {
      // Invalidate both agents lists
      queryClient.invalidateQueries({ queryKey: agentKeys.all })
    },
  })
}

