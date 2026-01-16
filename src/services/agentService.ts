/**
 * Agent Service
 * 
 * Handles API calls for agents
 */

import api from './api'
import type { AgentsResponse } from '@/provider/agents/types'

/**
 * Get all CRM agents
 */
export async function getCrmAgents(page: number = 1, limit: number = 10): Promise<AgentsResponse> {
  const response = await api.get<AgentsResponse>(`/users/crm-agents?page=${page}&limit=${limit}`)
  return response.data
}

/**
 * Get pending CRM agents (not approved)
 */
export async function getPendingCrmAgents(page: number = 1, limit: number = 10): Promise<AgentsResponse> {
  const response = await api.get<AgentsResponse>(`/users/crm-agents/pending?page=${page}&limit=${limit}`)
  return response.data
}

/**
 * Approve a CRM agent
 */
export async function approveAgent(agentId: string): Promise<void> {
  await api.post(`/users/${agentId}/approve`)
}

