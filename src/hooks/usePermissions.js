// src/hooks/usePermissions.js
import { useState, useEffect } from "react";
import { permissionService } from "@/services/api/PermissionsAPI";

export const usePermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPermissions = async () => {
    try {
      setIsLoading(true);
      const data = await permissionService.fetchPermissions();
      setPermissions(data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching permissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const reducePermissionGroups = (permissionsArray) => {
    const groupMap = new Map();

    permissionsArray.forEach((group) => {
      if (!groupMap.has(group.group)) {
        groupMap.set(group.group, group);
      } else {
        const existingGroup = groupMap.get(group.group);
        // Merge unique permissions
        const mergedPermissions = [
          ...existingGroup.permissions,
          ...group.permissions.filter(
            (newPerm) =>
              !existingGroup.permissions.some(
                (existingPerm) => existingPerm.name === newPerm.name
              )
          ),
        ];
        groupMap.set(group.group, {
          ...existingGroup,
          permissions: mergedPermissions,
        });
      }
    });

    return Array.from(groupMap.values());
  };

  const addPermission = async (newPermission) => {
    try {
      setIsLoading(true);
      const savedPermission = await permissionService.addPermission(
        newPermission
      );

      // Fetch the updated permissions from the database
      const updatedPermissions = await permissionService.fetchPermissions();

      // Deduplicate permissions by group (if needed)
      const uniquePermissions = reducePermissionGroups(updatedPermissions);
      setPermissions(uniquePermissions);

      return savedPermission;
    } catch (error) {
      setError(error.message);
      console.error("Error adding permission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePermission = async (updatedPermission) => {
    console.log("updatedPermission :", updatedPermission)
    try {
      setIsLoading(true);

      const result = await permissionService.updatePermission(
        updatedPermission
      );

      const freshData = await permissionService.fetchPermissions();
      setPermissions(freshData);
      return result;
    } catch (error) {
      setError(error.message);
      console.error("Error updating permission:", error);
      // Fetch fresh data in case of error
      const freshData = await permissionService.fetchPermissions();
      setPermissions(freshData);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePermission = async (groupId, permissionId) => {
    try {
      setIsLoading(true);

      // Delete from backend
      const result = await permissionService.deletePermission(
        groupId,
        permissionId
      );
      const freshData = await permissionService.fetchPermissions();
      setPermissions(freshData);
      return result;
    } catch (error) {
      const freshData = await permissionService.fetchPermissions();
      setPermissions(freshData);
      setError(error.message);
      console.error("Error deleting permission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return {
    permissions,
    isLoading,
    error,
    addPermission,
    updatePermission,
    deletePermission,
  };
};
