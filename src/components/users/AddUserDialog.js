'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useToast } from "@/hooks/use-toast"
import { Loader } from 'lucide-react'

export const AddUserDialog = ({ 
  isOpen, 
  onClose, 
  onAdd, 
  roles, 
  initialData = null 
}) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'Active'
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (initialData) {
      setUserData({
        ...initialData,
        role: initialData.role?.id || ''
      })
      setIsEditing(true)
    } else {
      setUserData({ name: '', email: '', role: '', status: 'Active' })
      setIsEditing(false)
    }
  }, [initialData])

  useEffect(() => {
    if (!isOpen) {
      setUserData({ name: '', email: '', role: '', status: 'Active' })
      setIsEditing(false)
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (!userData.name || !userData.email || !userData.role) {
      toast({
        title: "Error",
        description: "Name, Email, and Role are required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const success = await onAdd(userData)
      if (success) {
        toast({
          title: "Success",
          description: `User "${userData.name}" ${isEditing ? 'updated' : 'added'} successfully`,
          variant: "default",
          className: "bg-green-500 text-white",
        })
        onClose()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'add'} user: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit User' : 'Add New User'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input
              id="name"
              value={userData.name}
              onChange={e => setUserData({ ...userData, name: e.target.value })}
              className="col-span-3"
              required
              placeholder="Enter user name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={userData.email}
              onChange={e => setUserData({ ...userData, email: e.target.value })}
              className="col-span-3"
              required
              placeholder="Enter user email"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select 
              value={userData.role}
              onValueChange={value => setUserData({ ...userData, role: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.length === 0 ? (
                  <SelectItem value="no-roles" disabled>
                    Please add a role first
                  </SelectItem>
                ) : (
                  roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button 
          onClick={handleSubmit}
          disabled={!userData.name || !userData.email || !userData.role || isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Adding..."}
            </>
          ) : (
            isEditing ? "Update User" : "Add User"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  )
}