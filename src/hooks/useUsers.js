import { useState, useEffect } from 'react';
import { userService } from '../services/api/UsersAPI';
import { useToast } from '@/hooks/use-toast';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.fetchUsers();
      console.log(data)
      setUsers(data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add user
  const addUser = async (userData) => {
    try {
      setIsLoading(true);
      await userService.addUser(userData);
      await fetchUsers(); // Fetch fresh data
      toast({
        title: "Success",
        description: "User added successfully",
        variant: "default",
        className: "bg-green-500 text-white",
      });
      return true;
    } catch (error) {
      setError(error.message);
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: `Failed to add user: ${error.message}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user
  const updateUser = async (userData) => {
    try {
      setIsLoading(true);
      await userService.updateUser(userData.id, userData);
      await fetchUsers(); // Fetch fresh data
      toast({
        title: "Success",
        description: "User updated successfully",
        variant: "default",
        className: "bg-green-500 text-white",
      });
      return true;
    } catch (error) {
      setError(error.message);
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: `Failed to update user: ${error.message}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      setIsLoading(true);
      await userService.deleteUser(userId);
      await fetchUsers(); // Fetch fresh data
      toast({
        title: "Success",
        description: "User deleted successfully",
        variant: "default",
        className: "bg-green-500 text-white",
      });
      return true;
    } catch (error) {
      setError(error.message);
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: `Failed to delete user: ${error.message}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    addUser,
    updateUser,
    deleteUser,
    fetchUsers,
  };
};