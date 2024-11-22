// components/PermissionManagement.js
'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTable } from '../Table/Table'
import { PermissionActions } from './PermissionActions'
import { AddPermissionDialog } from './AddPermissionDialog'
import { usePermissions } from '@/hooks/usePermissions'
import { useTableData } from '@/hooks/useTableConfig'
import { Search } from 'lucide-react'

export function PermissionManagement() {
  const [isAddingPermission, setIsAddingPermission] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [selectedPermission, setSelectedPermission] = useState(null)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const { 
    permissions, 
    isLoading, 
    addPermission, 
    updatePermission, 
    deletePermission 
  } = usePermissions()

  const {
    data: paginatedPermissions,
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
  } = useTableData(permissions)

  const handleUpdatePermission = (group, permission) => {
    const selectedGroup = permissions.find(p => p.group === group);
    
    if (selectedGroup) {
      setSelectedGroup(selectedGroup)
      setSelectedPermission(permission)
      setIsAddingPermission(true)
    }
  }

const columns = [
  { 
    key: 'group', 
    label: 'Group', 
    sortable: true 
  },
  { 
    key: 'permissions', 
    label: 'Permissions', 
    sortable: false,
    render: (row) => {
      return (
        <div className="flex flex-col space-y-2">
          {row.permissions.map(permission => (
            <div key={permission._id} className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="font-medium capitalize">
                  {permission.name.replace(/_/g, ' ')}
                </span>
                <span className="text-muted-foreground text-sm">
                  {permission.description}
                </span>
              </div>
              <PermissionActions
                group={row}  // Pass the entire row (group) object
                permission={permission}
                onUpdate={handleUpdatePermission}
                onDelete={deletePermission}  // This now expects (groupId, permissionId)
              />
            </div>
          ))}
        </div>
      )
    }
  },
]

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded)
  }

  const handleCloseDialog = () => {
    setIsAddingPermission(false)
    setSelectedGroup(null)
    setSelectedPermission(null)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Permission Management</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative flex items-center">
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isSearchExpanded ? 'w-64 mr-2' : 'w-0'
              }`}
            >
              <Input
                placeholder="Search by permission name"
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
          <Button onClick={() => setIsAddingPermission(true)}>Add Permission</Button>
        </div>
      </CardHeader>
      <CardContent>
        {searchTerm && (
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
        )}
        
        <DataTable
          data={paginatedPermissions}
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
      <AddPermissionDialog
        isOpen={isAddingPermission}
        onClose={handleCloseDialog}
        onAdd={addPermission}
        onUpdate={updatePermission}
        initialGroup={selectedGroup}
        initialPermission={selectedPermission}
      />
    </Card>
  )
}