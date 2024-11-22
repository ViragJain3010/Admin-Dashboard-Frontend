'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Info, Loader } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useToast } from "@/hooks/use-toast"
import { usePermissions } from '@/hooks/usePermissions'

export function AddRoleDialog({ 
  isOpen, 
  onClose, 
  onAdd, 
  onUpdate,
  roleToEdit = null 
}) {
  const [role, setRole] = useState({ name: '', permissions: [] })
  const { permissions, isLoading: permissionsLoading } = usePermissions()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (roleToEdit) {
      setRole({
        id: roleToEdit.id,
        name: roleToEdit.name,
        permissions: Array.isArray(roleToEdit.permissions) 
          ? roleToEdit.permissions.map(p => typeof p === 'object' ? p.name : p)
          : []
      });
      setIsEditing(true);
    }
  }, [roleToEdit]);

  useEffect(() => {
    if (!isOpen) {
      setRole({ name: '', permissions: [] })
      setIsEditing(false)
    }
  }, [isOpen])

  const getPermissionGroups = () => {
    const groupedPermissions = {}
    permissions.forEach(permGroup => {
      const categoryKey = permGroup.group.toLowerCase().replace(/\s/g, '_')
      groupedPermissions[categoryKey] = permGroup.permissions.map(perm => perm.name)
    })
    return groupedPermissions
  }

  const getPermissionDescription = (permissionName) => {
    for (let permGroup of permissions) {
      const matchedPerm = permGroup.permissions.find(p => p.name === permissionName)
      if (matchedPerm) return matchedPerm.description
    }
    return 'No description available'
  }

  const handleSubmit = async () => {
    if (!role.name) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive",
      });
      return;
    }
  
    setIsLoading(true)
    try {
      const roleData = {
        name: role.name,
        permissions: role.permissions.map(permName => {
          for (const group of permissions) {
            const permission = group.permissions.find(p => p.name === permName);
            if (permission) {
              return permission._id;
            }
          }
          return null;
        }).filter(id => id !== null)
      };
    
      if (isEditing) {
        await onUpdate({ ...roleData, id: role.id });
      } else {
        await onAdd(roleData);
      }
      onClose();
      toast({
        title: "Success",
        description: `Role ${isEditing ? 'updated' : 'created'} successfully`,
        variant: "default",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false)
    }
  };
  

  const togglePermission = (permission) => {
    setRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  const toggleAllPermissionsInGroup = (category, permissionList) => {
    const allChecked = permissionList.every(p => role.permissions.includes(p));
    setRole(prev => ({
      ...prev,
      permissions: allChecked
        ? prev.permissions.filter(p => !permissionList.includes(p))
        : [...new Set([...prev.permissions, ...permissionList])]
    }));
  };

  if (permissionsLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>Loading permissions...</DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Role' : 'Add New Role'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Role Name
            </Label>
            <Input
              id="name"
              value={role.name}
              onChange={(e) => setRole({ ...role, name: e.target.value })}
              className="col-span-3"
              placeholder="Enter role name"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Permissions</Label>
            <div className="col-span-3 space-y-4">
              {Object.entries(getPermissionGroups()).map(([category, permissionList]) => (
                <div key={category} className="border p-4 rounded-lg dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold capitalize">{category.replace(/_/g, ' ')}</h3>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`select-all-${category}`}
                        checked={permissionList.every(p => role.permissions.includes(p))}
                        onCheckedChange={() => toggleAllPermissionsInGroup(category, permissionList)}
                      />
                      <label htmlFor={`select-all-${category}`} className="text-sm">Select All</label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {permissionList.map(permission => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission}
                          checked={role.permissions.includes(permission)}
                          onCheckedChange={() => togglePermission(permission)}
                        />
                        <label htmlFor={permission} className="capitalize text-sm">
                          {permission.replace(/_/g, ' ')}
                        </label>
                        <TooltipProvider delayDuration={500}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                              >
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{getPermissionDescription(permission)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Button 
          onClick={handleSubmit}
          disabled={!role.name || isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Adding..."}
            </>
          ) : (
            isEditing ? "Update Role" : "Add Role"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  )
}