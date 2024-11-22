'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTable } from '../Table/Table'
import { AddUserDialog } from '../users/AddUserDialog'
import { UserActions } from '../users/UserActions'
import { useUsers } from '@/hooks/useUsers'
import { useTableData } from '@/hooks/useTableConfig'
import { useRoles } from '@/hooks/useRoles'
import { Search } from 'lucide-react'

export function UserManagement() {
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const searchInputRef = useRef(null)
  const { users, isLoading: usersLoading, addUser, updateUser, deleteUser } = useUsers()
  const { roles, isLoading: rolesLoading } = useRoles()
  
  // Transform the users data before passing to useTableData
  const transformedUsers = users.map(user => ({
    ...user,
    id: user.id,
    originalRole: user.role, // Keep original role object
    role: user.role?.name || 'No Role'
  }))
  
  const {
    data: paginatedUsers,
    sortConfig,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    searchTerm,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
  } = useTableData(transformedUsers)

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: false },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <UserActions
          user={{
            ...row,
            role: row.originalRole // Pass the original role object back to actions
          }}
          onUpdate={updateUser}
          onDelete={deleteUser}
        />
      ),
    },
  ]

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded)
  }

  const isLoading = usersLoading || rolesLoading;

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchExpanded])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">User Management</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative flex items-center">
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isSearchExpanded ? 'w-64 mr-2' : 'w-0'
              }`}
            >
              <Input
                ref={searchInputRef}
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => setIsAddingUser(true)}>Add User</Button>
        </div>
      </CardHeader>
      <CardContent>
        {searchTerm && (
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
        )}
        
        <DataTable
          data={paginatedUsers}
          columns={columns}
          isLoading={isLoading}
          sortConfig={sortConfig}
          onSort={handleSort}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalItems={totalItems}
        />
      </CardContent>
      <AddUserDialog
        isOpen={isAddingUser}
        onClose={() => setIsAddingUser(false)}
        onAdd={addUser}
        roles={roles}
      />
    </Card>
  )
}