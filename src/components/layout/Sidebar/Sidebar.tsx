'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { getInitialTheme } from '@/utils/theme'
import { formatFullName } from '@/utils/formatters'
import { useState, useEffect } from 'react'
import Image from 'next/image'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}

type NavItem = {
  path?: string
  label: string
  icon: string
  adminOnly?: boolean
  children?: NavItem[]
}

const navItems: NavItem[] = [
  { path: '/profile', label: 'Onboarding', icon: 'person' },
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/contacts', label: 'Contacts', icon: 'group' },
  { path: '/pipeline', label: 'Pipeline', icon: 'ads_click' },
  {
    label: 'Opportunities',
    icon: 'chat_bubble',
    children: [
      { path: '/opportunities/individuals', label: 'Individuals', icon: 'group' },
      { path: '/opportunities/businesses', label: 'Businesses', icon: 'chat_bubble' },
      { path: '/opportunities/employees', label: 'Employees', icon: 'campaign' },
    ],
  },
  {
    label: 'Agents',
    icon: 'group_add',
    adminOnly: true,
    children: [
      { path: '/admin/agents', label: 'Agents', icon: 'group_add' },
      { path: '/admin/agents/pending', label: 'Pending', icon: 'schedule' },
      { path: '/admin/agents/lc', label: 'L&C', icon: 'grid_view' },
      { path: '/admin/agents/codes', label: 'Codes', icon: 'code' },
    ],
  },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth()
  const pathname = usePathname()
  const [isDarkMode, setIsDarkMode] = useState(false) // Start with false to match server
  const [mounted, setMounted] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // Set theme after hydration to avoid mismatch
  useEffect(() => {
    setMounted(true)
    setIsDarkMode(getInitialTheme() === 'dark')
  }, [])

  // Auto-expand parent items when on child routes
  useEffect(() => {
    if (pathname?.startsWith('/admin/agents')) {
      setExpandedItems((prev) => new Set([...prev, 'Agents']))
    }
    if (pathname?.startsWith('/opportunities/')) {
      setExpandedItems((prev) => new Set([...prev, 'Opportunities']))
    }
  }, [pathname])

  // Listen for theme changes
  useEffect(() => {
    if (!mounted) return
    
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }
    
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    
    return () => observer.disconnect()
  }, [mounted])

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(label)) {
        newSet.delete(label)
      } else {
        newSet.add(label)
      }
      return newSet
    })
  }

  // Filter nav items based on user role and approval status
  const filteredNavItems = navItems.filter((item) => {
    const isAdmin = user?.role?.name?.toUpperCase() === 'ADMIN' || user?.role?.name?.toUpperCase() === 'ADMINISTRATOR'
    
    // Hide admin-only items for non-admin users
    if (item.adminOnly && !isAdmin) {
      return false
    }
    // Hide Onboarding for admin users
    if (item.path === '/profile' && isAdmin) {
      return false
    }
    return true
  })

  const isActive = (path?: string) => {
    if (!path) return false
    return pathname === path
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-10 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-20
          w-20 lg:w-64 flex-shrink-0 flex flex-col justify-between
          bg-white dark:bg-surface-darker border-r border-neutral-200 dark:border-slate-700 
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top Section: Logo */}
        <div className="px-3 py-4 border-b border-neutral-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Image
              src={mounted && isDarkMode ? '/logo-main-light.png' : '/logo-main.png'}
              alt="CRM Nexus"
              height={28}
              width={120}
              className="h-7 w-auto"
              suppressHydrationWarning
            />
          </div>
        </div>

        {/* Middle Section: Navigation */}
        <nav className="flex-1 overflow-y-auto auto-scrollbar px-2 py-3 space-y-1">
          {filteredNavItems.map((item) => {
            const isExpanded = expandedItems.has(item.label)
            const hasChildren = item.children && item.children.length > 0
            const isUnapproved = user ? !user.isApproved : false
            const isOnboarding = item.path === '/profile'
            const isDisabled = isUnapproved && !isOnboarding

            if (hasChildren) {
              const isAgentsSection = item.label === 'Agents'
              
              return (
                <div key={item.label}>
                  <button
                    onClick={() => !isDisabled && toggleExpand(item.label)}
                    disabled={isDisabled}
                    className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md transition-colors ${
                      isDisabled
                        ? 'opacity-50 cursor-not-allowed text-text-muted dark:text-text-muted-dark'
                        : isExpanded && isAgentsSection
                          ? 'bg-primary text-white shadow-sm'
                          : isExpanded
                            ? 'bg-primary text-white shadow-sm'
                            : 'hover:bg-neutral-100 dark:hover:bg-slate-700 text-text-muted dark:text-text-muted-dark hover:text-text-main dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-[18px] ${isExpanded && isAgentsSection ? 'text-white' : ''}`}>{item.icon}</span>
                      <span className={`hidden lg:block font-medium text-sm ${isExpanded && isAgentsSection ? 'text-white' : ''}`}>{item.label}</span>
                    </div>
                    {!isDisabled && (
                      <span className={`material-symbols-outlined text-[16px] hidden lg:block ${isExpanded && isAgentsSection ? 'text-white' : ''}`}>
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    )}
                    {isDisabled && (
                      <span className="material-symbols-outlined text-[16px] hidden lg:block text-text-muted dark:text-text-muted-dark">
                        lock
                      </span>
                    )}
                  </button>
                  {isExpanded && !isDisabled && (
                    <div className="mt-1 ml-4 pl-2 pr-2 py-1 bg-neutral-50/50 dark:bg-slate-800/30 rounded-md space-y-0.5">
                      {item.children?.map((child) => {
                        const childIsActive = isActive(child.path)
                        return (
                          <Link
                            key={child.path}
                            href={child.path!}
                            onClick={() => {
                              if (window.innerWidth < 1024) {
                                onClose()
                              }
                            }}
                            className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-md transition-colors ${
                              childIsActive
                                ? 'bg-primary/20 text-primary border-l-2 border-primary'
                                : 'hover:bg-neutral-100 dark:hover:bg-slate-700 text-text-muted dark:text-text-muted-dark hover:text-text-main dark:hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px]">{child.icon}</span>
                              <span className="hidden lg:block font-medium text-sm">{child.label}</span>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            const itemIsActive = isActive(item.path)
            return (
              <Link
                key={item.path}
                href={isDisabled ? '#' : item.path!}
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault()
                    return
                  }
                  if (window.innerWidth < 1024) {
                    onClose()
                  }
                }}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors ${
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed pointer-events-none'
                    : itemIsActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'hover:bg-neutral-100 dark:hover:bg-slate-700 text-text-muted dark:text-text-muted-dark hover:text-text-main dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span className="hidden lg:block font-medium text-sm">{item.label}</span>
                {isDisabled && (
                  <span className="material-symbols-outlined text-[14px] ml-auto hidden lg:block text-text-muted dark:text-text-muted-dark">
                    lock
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section: User Profile */}
        <div className="px-2 py-3 border-t border-neutral-200 dark:border-slate-700">
          <div className="flex items-center gap-2 px-2 py-2 rounded-md bg-neutral-100 dark:bg-slate-700/50">
            {/* Avatar */}
            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-xs flex-shrink-0">
              {user
                ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
                : 'U'}
            </div>
            {/* User Info - Hidden on mobile */}
            <div className="hidden lg:block flex-1 min-w-0">
              <p className="text-xs font-medium text-text-main dark:text-white truncate">
                {formatFullName(user?.firstName, user?.lastName)}
              </p>
              <p className="text-xs text-text-muted dark:text-text-muted-dark truncate">{user?.email}</p>
              <span className="inline-block mt-0.5 px-1.5 py-0.5 text-xs font-medium rounded-full bg-primary/20 text-primary border border-primary/20">
                {user?.role?.name?.toUpperCase() || 'AGENT'}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

