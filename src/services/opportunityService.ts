/**
 * Opportunity Service
 * 
 * Handles API calls for opportunities
 */

import api from './api'
import type { Opportunity, CreateOpportunityDto, UpdateOpportunityDto, PipelineStage } from '@/provider/opportunities/types'

/**
 * Get all opportunities for current user
 */
export async function getOpportunities(): Promise<Opportunity[]> {
  const response = await api.get<Opportunity[]>('/opportunities')
  return response.data
}

/**
 * Get opportunity by ID
 */
export async function getOpportunityById(id: string): Promise<Opportunity> {
  const response = await api.get<Opportunity>(`/opportunities/${id}`)
  return response.data
}

/**
 * Create opportunity
 */
export async function createOpportunity(data: CreateOpportunityDto): Promise<Opportunity> {
  const response = await api.post<Opportunity>('/opportunities', data)
  return response.data
}

/**
 * Update opportunity
 */
export async function updateOpportunity(id: string, data: UpdateOpportunityDto): Promise<Opportunity> {
  const response = await api.put<Opportunity>(`/opportunities/${id}`, data)
  return response.data
}

/**
 * Update opportunity stage (for drag and drop)
 */
export async function updateOpportunityStage(id: string, stage: PipelineStage): Promise<Opportunity> {
  return updateOpportunity(id, { pipelineStage: stage })
}

/**
 * Delete opportunity
 */
export async function deleteOpportunity(id: string): Promise<void> {
  await api.delete(`/opportunities/${id}`)
}

