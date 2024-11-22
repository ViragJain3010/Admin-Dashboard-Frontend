// services/api/RolesAPI.js
// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = "/api";

export const roleService = {
  async fetchRoles() {
    const response = await fetch(`${API_BASE_URL}/roles`);
    if (!response.ok) throw new Error('Failed to fetch roles');
    const data = await response.json();
    return data;
  },

  async addRole(roleData) {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: roleData.name,
        permissions: roleData.permissions // Array of permission IDs
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add role');
    }
    const data = await response.json();
    return data;
  },

  async updateRole(roleId, roleData) {
    const response = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: roleData.name,
        permissions: roleData.permissions
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update role');
    }
    const data = await response.json();
    return data;
  },

  async deleteRole(roleId) {
    const response = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete role');
    }
    return true;
  }
};