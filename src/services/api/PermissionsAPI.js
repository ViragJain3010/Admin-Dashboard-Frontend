// /src/services/api/permissions.js
const API_BASE_URL = "/api";
// const API_BASE_URL = "http://localhost:5000/api";

export const permissionService = {
  async fetchPermissions() {
    const response = await fetch(`${API_BASE_URL}/permissions`);
    if (!response.ok) throw new Error("Failed to fetch permissions");
    return response.json();
  },

  async addPermission(permissionData) {
    console.log(permissionData)
    try {
      const response = await fetch(`${API_BASE_URL}/permissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          group: permissionData.group,
          permissions: [
            {
              name: permissionData.permissions[0].name,
              description: permissionData.permissions[0].description,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to add permission: ${errorBody}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error in addPermission:", error);
      throw error;
    }
  },

  async updatePermission(updatedPermission) {
    const {
      group,
      permissionId,
      permissions: permissionData,
    } = updatedPermission;
    console.log(permissionData)
    const response = await fetch(
      `${API_BASE_URL}/permissions/${group.id}/${permissionId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: permissionData[0].name,
          description: permissionData[0].description,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update permission");
    }

    return response.json();
  },

  async deletePermission(groupId, permissionId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/permissions/${groupId}/${permissionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete permission");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Delete permission error:", error);
      throw error;
    }
  },
};
