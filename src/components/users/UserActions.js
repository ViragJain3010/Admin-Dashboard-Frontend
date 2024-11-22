import React from 'react';
import { Button } from '@/components/ui/button';

export const UserActions = ({ user, onUpdate, onDelete }) => {
  const handleStatusUpdate = async () => {
    const updatedUser = {
      ...user,
      status: user.status === 'Active' ? 'Inactive' : 'Active',
      role: user.originalRole?.id || user.role // Use the original role ID
    };
    await onUpdate(updatedUser);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await onDelete(user.id);
    }
  };

  return (
    <div className="flex justify-end space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleStatusUpdate}
      >
        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
      >
        Delete
      </Button>
    </div>
  );
};