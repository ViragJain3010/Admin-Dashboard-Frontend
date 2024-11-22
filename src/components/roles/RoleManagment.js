// components/RoleManagement.js
'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTable } from '../Table/Table'
import { RoleActions } from './RoleActions'
import { AddRoleDialog } from './AddRoleDialog'
import { useRoles } from '@/hooks/useRoles'
import { useTableData } from '@/hooks/useTableConfig'
import { usePermissions } from '@/hooks/usePermissions'
import { Search } from 'lucide-react'

export function RoleManagement() {
  const [isAddingRole, setIsAddingRole] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [roleToEdit, setRoleToEdit] = useState(null)
  const { roles, isLoading: isRolesLoading, addRole, updateRole, deleteRole } = useRoles()
  const { permissions, isLoading: isPermissionsLoading } = usePermissions()
  const {
    data: paginatedRoles,
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
  } = useTableData(roles)

  const getPermissionDescription = (permissionName) => {
    // Find the permission description from fetched permissions
    for (let permGroup of permissions) {
      const matchedPerm = permGroup.permissions.find(p => p.name === permissionName)
      if (matchedPerm) return matchedPerm.description
    }
    return 'No description available'
  }

  const columns = [
    { key: 'name', label: 'Role Name', sortable: true },
    { 
      key: 'permissions', 
      label: 'Permissions', 
      sortable: false,
      render: (row) => {
        // Make sure permissions exist and are populated
        const permissions = Array.isArray(row.permissions) ? row.permissions : [];
        return (
          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
            {permissions.map(permission => (
              <span 
                key={permission._id} 
                className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs capitalize"
                title={permission.description}
              >
                {permission.name.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <RoleActions
          role={row}
          onUpdate={() => {
            // Transform permissions to match the AddRoleDialog format
            const transformedRole = {
              ...row,
              permissions: row.permissions.map(p => p.name)
            };
            setRoleToEdit(transformedRole);
            setIsAddingRole(true);
          }}
          onDelete={deleteRole}
        />
      ),
    },
  ];

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded)
  }

  const isLoading = isRolesLoading || isPermissionsLoading

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Role Management</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative flex items-center">
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isSearchExpanded ? 'w-64 mr-2' : 'w-0'
              }`}
            >
              <Input
                placeholder="Search by role name"
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
          <Button onClick={() => {
            setRoleToEdit(null)
            setIsAddingRole(true)
          }}>Add Role</Button>
        </div>
      </CardHeader>
      <CardContent>
        {searchTerm && (
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
        )}
        
        <DataTable
          data={paginatedRoles}
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
      <AddRoleDialog
        isOpen={isAddingRole}
        onClose={() => setIsAddingRole(false)}
        onAdd={addRole}
        onUpdate={updateRole}
        roleToEdit={roleToEdit}
      />
    </Card>
  )
}