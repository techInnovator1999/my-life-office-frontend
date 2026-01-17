/**
 * Opportunity Service
 * 
 * Handles API calls for opportunities
 */

import api from './api'
import type { Opportunity, CreateOpportunityDto, UpdateOpportunityDto } from '@/provider/opportunities/types'
import { PipelineStage } from '@/types/opportunity'

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
  // Check if ID is a valid UUID (backend requires UUID format)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    // If ID is not a UUID (e.g., static test data), return a mock response
    // This prevents API calls for static/test data that doesn't exist in the backend
    console.warn(`Skipping API call for non-UUID opportunity ID: ${id} (likely static test data)`)
    throw new Error(`Cannot update opportunity with non-UUID ID: ${id}. This appears to be static test data.`)
  }

  // Ensure stage is a valid enum value (string)
  const validStage = Object.values(PipelineStage).includes(stage) ? stage : null
  if (!validStage) {
    throw new Error(`Invalid pipeline stage: ${stage}`)
  }
  
  return updateOpportunity(id, { pipelineStage: validStage })
}

/**
 * Delete opportunity
 */
export async function deleteOpportunity(id: string): Promise<void> {
  await api.delete(`/opportunities/${id}`)
}

