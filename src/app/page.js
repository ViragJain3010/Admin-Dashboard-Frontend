'use client'

import { useState, Suspense } from 'react'
import { UserManagement } from '../components/users/UserManagement'
import { RoleManagement } from '../components/roles/RoleManagment'
import { PermissionManagement } from '../components/permissions/PermissionManagment'
import { ThemeProvider } from 'next-themes'
import { Users, ShieldCheck, Lock } from 'lucide-react'
import { Header } from '../components/Header'
import { Button } from '@/components/ui/button'


const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent'

function LoadingFallback() {
  return (
    <div className={`h-96 w-full rounded-md bg-muted ${shimmer}`}>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users')

  const navItems = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'roles', label: 'Role Management', icon: ShieldCheck },
    { id: 'permissions', label: 'Permission Management', icon: Lock },
  ]

  const handleNavItemClick = (id) => {
    setActiveTab(id)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />
      case 'roles':
        return <RoleManagement />
      case 'permissions':
        return <PermissionManagement />
      default:
        return null
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background text-foreground">
        <Header activeTab={activeTab} navItems={navItems} onNavItemClick={handleNavItemClick} />
        <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
          {/* Sidebar for larger screens */}
          <aside className="hidden w-64 overflow-y-auto border-r bg-background md:block">
            <nav className="space-y-2 p-4">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleNavItemClick(item.id)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </aside>

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-4 md:p-6">
              <Suspense fallback={<LoadingFallback />}>
                {renderContent()}
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}