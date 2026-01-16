'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as opportunityService from '@/services/opportunityService'
import type { Opportunity, CreateOpportunityDto, UpdateOpportunityDto, PipelineStage } from './types'
import { opportunityKeys } from './index'

/**
 * Get all opportunities
 */
export const useOpportunities = () => {
  return useQuery({
    queryKey: opportunityKeys.all,
    queryFn: () => opportunityService.getOpportunities(),
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Get opportunity by ID
 */
export const useOpportunity = (id: string) => {
  return useQuery({
    queryKey: opportunityKeys.detail(id),
    queryFn: () => opportunityService.getOpportunityById(id),
    enabled: !!id,
  })
}

/**
 * Create opportunity mutation
 */
export const useCreateOpportunity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateOpportunityDto) => opportunityService.createOpportunity(data),
    onSuccess: () => {
      // Invalidate opportunities list
      queryClient.invalidateQueries({ queryKey: opportunityKeys.all })
    },
  })
}

/**
 * Update opportunity mutation
 */
export const useUpdateOpportunity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOpportunityDto }) =>
      opportunityService.updateOpportunity(id, data),
    onSuccess: (data) => {
      // Update specific opportunity in cache
      queryClient.setQueryData(opportunityKeys.detail(data.id), data)
      // Invalidate opportunities list
      queryClient.invalidateQueries({ queryKey: opportunityKeys.all })
    },
  })
}

/**
 * Update opportunity stage mutation (for drag and drop)
 */
export const useUpdateOpportunityStage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: PipelineStage }) =>
      opportunityService.updateOpportunityStage(id, stage),
    onSuccess: (data) => {
      // Update specific opportunity in cache
      queryClient.setQueryData(opportunityKeys.detail(data.id), data)
      // Invalidate opportunities list
      queryClient.invalidateQueries({ queryKey: opportunityKeys.all })
    },
  })
}

/**
 * Delete opportunity mutation
 */
export const useDeleteOpportunity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => opportunityService.deleteOpportunity(id),
    onSuccess: () => {
      // Invalidate opportunities list
      queryClient.invalidateQueries({ queryKey: opportunityKeys.all })
    },
  })
}

