'use client'

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Loader } from 'lucide-react'

export function AddPermissionDialog({
  isOpen,
  onClose,
  onAdd,
  onUpdate,
  initialGroup,
  initialPermission,
}) {
  const [permission, setPermission] = useState({
    group: "",
    name: "",
    description: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const permissionGroups = [
    "User Management",
    "Role Management",
    "Product Management",
    "Permission Management",
  ]

  useEffect(() => {
    if (initialPermission) {
      setPermission({
        group: initialGroup.group || "",
        name: initialPermission.name || "",
        description: initialPermission.description || "",
      })
      setIsEditing(true)
    } else {
      setPermission({ group: "", name: "", description: "" })
      setIsEditing(false)
    }
  }, [initialPermission, initialGroup])

  useEffect(() => {
    if (!isOpen) {
      setPermission({ group: "", name: "", description: "" })
      setIsEditing(false)
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (!permission.group || !permission.name) {
      toast({
        title: "Error",
        description: "Group and Name are required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const permissionData = {
        group: permission.group,
        permissions: [
          {
            name: permission.name,
            description: permission.description,
          },
        ],
      }
      if (isEditing) {
        await onUpdate({
          permissionId: initialPermission._id,
          ...permissionData,
        })
        toast({
          title: "Success",
          description: `Permission "${permission.name}" updated successfully`,
          variant: "default",
          className: "bg-green-500 text-white",
        })
      } else {
        await onAdd(permissionData)
        toast({
          title: "Success",
          description: `Permission "${permission.name}" added successfully`,
          variant: "default",
          className: "bg-green-500 text-white",
        })
      }
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'add'} permission "${permission.name}": ${error.message}`,
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Permission" : "Add New Permission"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="group" className="text-right">
              Group
            </Label>
            <Select
              value={permission.group}
              onValueChange={(value) =>
                setPermission({ ...permission, group: value })
              }
              disabled={isEditing}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select permission group" />
              </SelectTrigger>
              <SelectContent>
                {permissionGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={permission.name}
              onChange={(e) =>
                setPermission({ ...permission, name: e.target.value })
              }
              className="col-span-3"
              placeholder="Enter permission name"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={permission.description}
              onChange={(e) =>
                setPermission({ ...permission, description: e.target.value })
              }
              className="col-span-3"
              placeholder="Enter permission description"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Adding..."}
              </>
            ) : (
              isEditing ? "Update Permission" : "Add Permission"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}