'use client'

import { useState } from 'react'
import { Header } from '../Header/Header'
import { Sidebar } from '../Sidebar/Sidebar'

type MainLayoutProps = {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Show sidebar for all authenticated users
  const showSidebar = true

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-slate-900">
      {/* Sidebar - Show for all authenticated users */}
      {showSidebar && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto auto-scrollbar p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

