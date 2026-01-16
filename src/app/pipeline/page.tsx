'use client'

import { useState, useMemo } from 'react'
import { PrivateRoute } from '@/components/common/PrivateRoute'
import { KanbanBoard } from '@/components/features/pipeline/KanbanBoard'
import { FilterDropdown } from '@/components/common/FilterDropdown'
import { DateRangeFilter } from '@/components/common/DateRangeFilter'
import { RangeSliderFilter } from '@/components/common/RangeSliderFilter'
import { Opportunity, PipelineStage, Temperature } from '@/types/opportunity'
import { Button } from '@/components/common/Button'

// Static opportunity data
const STATIC_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',
    name: 'John Smith - Life Insurance',
    service: 'Life Insurance',
    createDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    pipelineStage: PipelineStage.LEADS_INTEREST,
    temperature: Temperature.HOT,
    nextFollowUp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    estimateCloseTarget: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    opportunitySource: 'Referral',
    referredBy: 'Jane Doe',
    writingAgent: 'Agent 1',
    estAnnualPremium: 5000,
    opportunityAmount: 50000,
    isLocked: false,
    contactId: 'contact-1',
    agentId: 'agent-1',
    contact: {
      id: 'contact-1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phoneNumber: '+1-555-0101',
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    name: 'Sarah Johnson - Annuity',
    service: 'Annuity',
    createDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    pipelineStage: PipelineStage.LEADS_INTEREST,
    temperature: Temperature.WARM,
    nextFollowUp: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    estimateCloseTarget: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    opportunitySource: 'Website',
    writingAgent: 'Agent 1',
    estAnnualPremium: 8000,
    opportunityAmount: 100000,
    isLocked: false,
    contactId: 'contact-2',
    agentId: 'agent-1',
    contact: {
      id: 'contact-2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      phoneNumber: '+1-555-0102',
    },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    name: 'Michael Brown - Medicare',
    service: 'Medicare',
    createDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    pipelineStage: PipelineStage.PROSPECT_QUOTE,
    temperature: Temperature.HOT,
    nextFollowUp: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    estimateCloseTarget: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    opportunitySource: 'Cold Call',
    writingAgent: 'Agent 2',
    estAnnualPremium: 3000,
    opportunityAmount: 30000,
    isLocked: false,
    contactId: 'contact-3',
    agentId: 'agent-1',
    contact: {
      id: 'contact-3',
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@example.com',
      phoneNumber: '+1-555-0103',
    },
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    name: 'Emily Davis - Life Insurance',
    service: 'Life Insurance',
    createDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    pipelineStage: PipelineStage.PROSPECT_QUOTE,
    temperature: Temperature.WARM,
    nextFollowUp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    estimateCloseTarget: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    opportunitySource: 'Referral',
    referredBy: 'John Smith',
    writingAgent: 'Agent 1',
    estAnnualPremium: 6000,
    opportunityAmount: 60000,
    isLocked: false,
    contactId: 'contact-4',
    agentId: 'agent-1',
    contact: {
      id: 'contact-4',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@example.com',
      phoneNumber: '+1-555-0104',
    },
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    name: 'Robert Wilson - Annuity',
    service: 'Annuity',
    createDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    pipelineStage: PipelineStage.PROSPECT_APP_SIGNED,
    temperature: Temperature.HOT,
    nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    estimateCloseTarget: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    opportunitySource: 'Website',
    writingAgent: 'Agent 2',
    estAnnualPremium: 10000,
    opportunityAmount: 150000,
    isLocked: false,
    contactId: 'contact-5',
    agentId: 'agent-1',
    contact: {
      id: 'contact-5',
      firstName: 'Robert',
      lastName: 'Wilson',
      email: 'robert.wilson@example.com',
      phoneNumber: '+1-555-0105',
    },
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    name: 'Lisa Anderson - Life Insurance',
    service: 'Life Insurance',
    createDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    pipelineStage: PipelineStage.PROSPECT_UNDERWRITING,
    temperature: Temperature.HOT,
    nextFollowUp: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    estimateCloseTarget: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    opportunitySource: 'Referral',
    referredBy: 'Sarah Johnson',
    writingAgent: 'Agent 1',
    carrier: 'ABC Insurance',
    product: 'Term Life 20',
    estAnnualPremium: 4500,
    opportunityAmount: 45000,
    isLocked: false,
    contactId: 'contact-6',
    agentId: 'agent-1',
    contact: {
      id: 'contact-6',
      firstName: 'Lisa',
      lastName: 'Anderson',
      email: 'lisa.anderson@example.com',
      phoneNumber: '+1-555-0106',
    },
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    name: 'David Martinez - Medicare',
    service: 'Medicare',
    createDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    pipelineStage: PipelineStage.PROSPECT_UNDERWRITING,
    temperature: Temperature.WARM,
    nextFollowUp: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    estimateCloseTarget: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    opportunitySource: 'Cold Call',
    writingAgent: 'Agent 2',
    carrier: 'XYZ Medicare',
    estAnnualPremium: 2500,
    opportunityAmount: 25000,
    isLocked: false,
    contactId: 'contact-7',
    agentId: 'agent-1',
    contact: {
      id: 'contact-7',
      firstName: 'David',
      lastName: 'Martinez',
      email: 'david.martinez@example.com',
      phoneNumber: '+1-555-0107',
    },
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '8',
    name: 'Jennifer Taylor - Life Insurance',
    service: 'Life Insurance',
    createDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    pipelineStage: PipelineStage.CLIENT_WON_IN_FORCE,
    temperature: Temperature.HOT,
    opportunitySource: 'Referral',
    referredBy: 'Michael Brown',
    writingAgent: 'Agent 1',
    carrier: 'ABC Insurance',
    product: 'Whole Life',
    estAnnualPremium: 7000,
    opportunityAmount: 70000,
    isLocked: true,
    lockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    lockedBy: 'agent-1',
    contactId: 'contact-8',
    agentId: 'agent-1',
    contact: {
      id: 'contact-8',
      firstName: 'Jennifer',
      lastName: 'Taylor',
      email: 'jennifer.taylor@example.com',
      phoneNumber: '+1-555-0108',
    },
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '9',
    name: 'James White - Annuity',
    service: 'Annuity',
    createDate: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
    pipelineStage: PipelineStage.CLIENT_WON_IN_FORCE,
    temperature: Temperature.HOT,
    opportunitySource: 'Website',
    writingAgent: 'Agent 2',
    carrier: 'DEF Financial',
    estAnnualPremium: 12000,
    opportunityAmount: 200000,
    isLocked: true,
    lockedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    lockedBy: 'agent-1',
    contactId: 'contact-9',
    agentId: 'agent-1',
    contact: {
      id: 'contact-9',
      firstName: 'James',
      lastName: 'White',
      email: 'james.white@example.com',
      phoneNumber: '+1-555-0109',
    },
    createdAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '10',
    name: 'Patricia Harris - Life Insurance',
    service: 'Life Insurance',
    createDate: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
    pipelineStage: PipelineStage.LOST_LOST,
    temperature: Temperature.COLD,
    opportunitySource: 'Cold Call',
    writingAgent: 'Agent 1',
    estAnnualPremium: 4000,
    opportunityAmount: 40000,
    isLocked: false,
    contactId: 'contact-10',
    agentId: 'agent-1',
    contact: {
      id: 'contact-10',
      firstName: 'Patricia',
      lastName: 'Harris',
      email: 'patricia.harris@example.com',
      phoneNumber: '+1-555-0110',
    },
    createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export default function PipelinePage() {
  // Use static data instead of API call
  const opportunities = useMemo(() => STATIC_OPPORTUNITIES, [])
  const isLoading = false
  
  // Filter states
  const [accountType, setAccountType] = useState<string[]>(['All'])
  const [accountTypeMode, setAccountTypeMode] = useState<'one' | 'many'>('one')
  const [services, setServices] = useState<string[]>(['All'])
  const [servicesMode, setServicesMode] = useState<'one' | 'many'>('one')
  const [interest, setInterest] = useState<string[]>(['All'])
  const [interestMode, setInterestMode] = useState<'one' | 'many'>('one')
  const [daysOpen, setDaysOpen] = useState<number>(50)
  const [maxClosingDate, setMaxClosingDate] = useState<string>('')

  const handleOpportunityMove = async (_opportunityId: string, _newStage: PipelineStage) => {
    // Optimistic update is handled in KanbanBoard
    // Static data - no API call needed
  }

  const handleOpportunityClick = (opportunity: Opportunity) => {
    // TODO: Open opportunity drawer/modal
    console.log('Clicked opportunity:', opportunity)
  }

  return (
    <PrivateRoute>
      <div className="space-y-3">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-text-main dark:text-white">
              Opportunities Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-0.5">
              Manage your sales opportunities
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-stretch gap-2 w-full md:w-auto md:flex-shrink-0">
            <Button className="flex-1 md:flex-none">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add Contact</span>
              </span>
            </Button>
            <Button className="flex-1 md:flex-none">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>New Opportunity</span>
              </span>
            </Button>
          </div>
        </div>

        {/* Filter Area */}
        <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-neutral-200 dark:border-slate-700 p-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter Icon */}
            <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 pointer-events-none">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </div>

            {/* Account Type Filter */}
            <FilterDropdown
              label="Account Type"
              options={[
                { value: 'All', label: 'All' },
                { value: 'Individual', label: 'Individual' },
                { value: 'Business', label: 'Business' },
                { value: 'Employees', label: 'Employees' },
              ]}
              selectedValues={accountType}
              onSelectionChange={setAccountType}
              selectMode={accountTypeMode}
              onSelectModeChange={setAccountTypeMode}
            />

            {/* Services Filter */}
            <FilterDropdown
              label="Services"
              options={[
                { value: 'All', label: 'All' },
                { value: 'Life Insurance', label: 'Life Insurance' },
                { value: 'Annuity', label: 'Annuity' },
                { value: 'Medicare', label: 'Medicare' },
              ]}
              selectedValues={services}
              onSelectionChange={setServices}
              selectMode={servicesMode}
              onSelectModeChange={setServicesMode}
            />

            {/* Interest Filter */}
            <FilterDropdown
              label="Interest"
              options={[
                { value: 'All', label: 'All' },
                { value: 'Cold', label: 'Cold' },
                { value: 'Warm', label: 'Warm' },
                { value: 'Hot', label: 'Hot' },
              ]}
              selectedValues={interest}
              onSelectionChange={setInterest}
              selectMode={interestMode}
              onSelectModeChange={setInterestMode}
            />

            {/* Days Open Filter */}
            <RangeSliderFilter
              label="Days Open"
              value={daysOpen}
              onChange={setDaysOpen}
              min={0}
              max={365}
              description="Number of days since opportunity opens"
            />

            {/* Max Closing Date Filter */}
            <DateRangeFilter
              label="Max Closing Date"
              value={maxClosingDate}
              onChange={setMaxClosingDate}
              placeholder="MM/DD/YYYY"
            />
          </div>
        </div>

        {/* Kanban Board */}
        {isLoading ? (
          <div className="flex items-center justify-center h-96 bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-neutral-200 dark:border-slate-700">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-neutral-200 dark:border-slate-700 p-6">
            <KanbanBoard
              opportunities={opportunities}
              onOpportunityClick={handleOpportunityClick}
              onOpportunityMove={handleOpportunityMove}
            />
          </div>
        )}
      </div>
    </PrivateRoute>
  )
}

