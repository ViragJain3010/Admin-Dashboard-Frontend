import { useState, useEffect } from 'react';
import { roleService } from '@/services/api/RolesAPI';
import { useToast } from "@/hooks/use-toast";

export const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const data = await roleService.fetchRoles();
      setRoles(data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching roles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch roles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const addRole = async (roleData) => {
    try {
      setIsLoading(true);
      const savedRole = await roleService.addRole(roleData);
      // Make sure we're using the populated role data
      setRoles(currentRoles => [...currentRoles, savedRole]);
      return savedRole;
    } catch (error) {
      setError(error.message);
      toast({
        title: "Error",
        description: error.message || "Failed to add role",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRole = async (roleData) => {
    try {
      setIsLoading(true);
      const savedRole = await roleService.updateRole(roleData.id, roleData);
      setRoles(currentRoles => 
        currentRoles.map(role => role.id === savedRole.id ? savedRole : role)
      );
      return savedRole;
    } catch (error) {
      setError(error.message);
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRole = async (role) => {
    try {
      setIsLoading(true);
      await roleService.deleteRole(role.id);
      setRoles(currentRoles => currentRoles.filter(r => r.id !== role.id));
      toast({
        title: "Success",
        description: "Role deleted successfully",
        variant: "default",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      setError(error.message);
      toast({
        title: "Error",
        description: error.message || "Failed to delete role",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return { 
    roles, 
    isLoading, 
    error, 
    addRole, 
    updateRole,
    deleteRole
  };
};