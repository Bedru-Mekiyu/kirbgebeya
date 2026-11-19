import { apiService } from "./api";
import { API_CONFIG } from "../config";

export interface Permission {
    id: string;
    action: "create" | "read" | "update" | "delete";
    resource: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Role {
    id: string;
    name: string;
    description?: string;
    permissions: Permission[];
    userCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateRoleData {
    name: string;
    description?: string;
    permissionIds?: string[];
}

export interface UpdateRoleData {
    name?: string;
    description?: string;
    permissionIds?: string[];
}

export interface RolePermission {
    id: string;
    roleId: string;
    permissionId: string;
    permission?: Permission;
    role?: Role;
    createdAt?: string;
    updatedAt?: string;
}

export interface AssignPermissionsData {
    permissionIds: string[];
}

export interface RoleService {
    getAllRoles(): Promise<Role[]>;
    getRoleById(id: string): Promise<Role>;
    createRole(roleData: CreateRoleData): Promise<Role>;
    updateRole(id: string, roleData: UpdateRoleData): Promise<Role>;
    deleteRole(id: string): Promise<void>;

    getAllPermissions(): Promise<Permission[]>;
    getPermissionById(id: string): Promise<Permission>;
    createPermission(permissionData: Omit<Permission, 'id'>): Promise<Permission>;
    updatePermission(id: string, permissionData: Partial<Permission>): Promise<Permission>;
    deletePermission(id: string): Promise<void>;

    getRolePermissions(roleId: string): Promise<Permission[]>;
    assignPermissionsToRole(roleId: string, permissionIds: string[]): Promise<RolePermission[]>;
    removePermissionsFromRole(roleId: string, permissionIds: string[]): Promise<void>;
    syncRolePermissions(roleId: string, permissionIds: string[]): Promise<RolePermission[]>;

    getUserRoles(userId: string): Promise<Role[]>;
    assignRolesToUser(userId: string, roleIds: string[]): Promise<void>;
    removeRolesFromUser(userId: string, roleIds: string[]): Promise<void>;

    searchRoles(query: string): Promise<Role[]>;
    getRolesWithUserCount(): Promise<Role[]>;
}

export const rolePermissionService: RoleService = {
    getAllRoles: async (): Promise<Role[]> => {
        try {
            return await apiService.get<Role[]>(`${API_CONFIG.ENDPOINTS.ROLES}`);
        } catch (error: any) {
            throw new Error(`Failed to fetch roles: ${error.message}`);
        }
    },

    getRoleById: async (id: string): Promise<Role> => {
        try {
            return await apiService.get<Role>(`${API_CONFIG.ENDPOINTS.ROLES}/${id}`);
        } catch (error: any) {
            throw new Error(`Failed to fetch role ${id}: ${error.message}`);
        }
    },

    createRole: async (roleData: CreateRoleData): Promise<Role> => {
        try {
            return await apiService.post<Role>(
                `${API_CONFIG.ENDPOINTS.ROLES}`,
                roleData
            );
        } catch (error: any) {
            throw new Error(`Failed to create role: ${error.message}`);
        }
    },

    updateRole: async (id: string, roleData: UpdateRoleData): Promise<Role> => {
        try {
            return await apiService.put<Role>(
                `${API_CONFIG.ENDPOINTS.ROLES}/${id}`,
                roleData
            );
        } catch (error: any) {
            throw new Error(`Failed to update role ${id}: ${error.message}`);
        }
    },

    deleteRole: async (id: string): Promise<void> => {
        try {
            await apiService.delete(`${API_CONFIG.ENDPOINTS.ROLES}/${id}`);
        } catch (error: any) {
            throw new Error(`Failed to delete role ${id}: ${error.message}`);
        }
    },

    getAllPermissions: async (): Promise<Permission[]> => {
        try {
            return await apiService.get<Permission[]>(`${API_CONFIG.ENDPOINTS.PERMISSIONS}`);
        } catch (error: any) {
            throw new Error(`Failed to fetch permissions: ${error.message}`);
        }
    },

    getPermissionById: async (id: string): Promise<Permission> => {
        try {
            return await apiService.get<Permission>(`${API_CONFIG.ENDPOINTS.PERMISSIONS}/${id}`);
        } catch (error: any) {
            throw new Error(`Failed to fetch permission ${id}: ${error.message}`);
        }
    },

    createPermission: async (permissionData: Omit<Permission, 'id'>): Promise<Permission> => {
        try {
            return await apiService.post<Permission>(
                `${API_CONFIG.ENDPOINTS.PERMISSIONS}`,
                permissionData
            );
        } catch (error: any) {
            throw new Error(`Failed to create permission: ${error.message}`);
        }
    },

    updatePermission: async (id: string, permissionData: Partial<Permission>): Promise<Permission> => {
        try {
            return await apiService.put<Permission>(
                `${API_CONFIG.ENDPOINTS.PERMISSIONS}/${id}`,
                permissionData
            );
        } catch (error: any) {
            throw new Error(`Failed to update permission ${id}: ${error.message}`);
        }
    },

    deletePermission: async (id: string): Promise<void> => {
        try {
            await apiService.delete(`${API_CONFIG.ENDPOINTS.PERMISSIONS}/${id}`);
        } catch (error: any) {
            throw new Error(`Failed to delete permission ${id}: ${error.message}`);
        }
    },

    getRolePermissions: async (roleId: string): Promise<Permission[]> => {
        try {
            return await apiService.get<Permission[]>(
                `${API_CONFIG.ENDPOINTS.ROLES}/${roleId}/permissions`
            );
        } catch (error: any) {
            throw new Error(`Failed to fetch permissions for role ${roleId}: ${error.message}`);
        }
    },

    assignPermissionsToRole: async (roleId: string, permissionIds: string[]): Promise<RolePermission[]> => {
        try {
            return await apiService.post<RolePermission[]>(
                `${API_CONFIG.ENDPOINTS.ROLES}/${roleId}/permissions`,
                { permissionIds }
            );
        } catch (error: any) {
            throw new Error(`Failed to assign permissions to role ${roleId}: ${error.message}`);
        }
    },

    removePermissionsFromRole: async (roleId: string, permissionIds: string[]): Promise<void> => {
        try {
            await apiService.delete(
                `${API_CONFIG.ENDPOINTS.ROLES}/${roleId}/permissions`,
                { permissionIds }
            );
        } catch (error: any) {
            throw new Error(`Failed to remove permissions from role ${roleId}: ${error.message}`);
        }
    },

    syncRolePermissions: async (roleId: string, permissionIds: string[]): Promise<RolePermission[]> => {
        try {
            return await apiService.put<RolePermission[]>(
                `${API_CONFIG.ENDPOINTS.ROLES}/${roleId}/permissions/sync`,
                { permissionIds }
            );
        } catch (error: any) {
            throw new Error(`Failed to sync permissions for role ${roleId}: ${error.message}`);
        }
    },

    getUserRoles: async (userId: string): Promise<Role[]> => {
        try {
            return await apiService.get<Role[]>(
                `${API_CONFIG.ENDPOINTS.USERS}/${userId}/roles`
            );
        } catch (error: any) {
            throw new Error(`Failed to fetch roles for user ${userId}: ${error.message}`);
        }
    },

    assignRolesToUser: async (userId: string, roleIds: string[]): Promise<void> => {
        try {
            await apiService.post(
                `${API_CONFIG.ENDPOINTS.USERS}/${userId}/roles`,
                { roleIds }
            );
        } catch (error: any) {
            throw new Error(`Failed to assign roles to user ${userId}: ${error.message}`);
        }
    },

    removeRolesFromUser: async (userId: string, roleIds: string[]): Promise<void> => {
        try {
            await apiService.delete(
                `${API_CONFIG.ENDPOINTS.USERS}/${userId}/roles`,
                { roleIds }
            );
        } catch (error: any) {
            throw new Error(`Failed to remove roles from user ${userId}: ${error.message}`);
        }
    },

    searchRoles: async (query: string): Promise<Role[]> => {
        try {
            return await apiService.get<Role[]>(
                `${API_CONFIG.ENDPOINTS.ROLES}/search?q=${encodeURIComponent(query)}`
            );
        } catch (error: any) {
            throw new Error(`Failed to search roles: ${error.message}`);
        }
    },

    getRolesWithUserCount: async (): Promise<Role[]> => {
        try {
            return await apiService.get<Role[]>(`${API_CONFIG.ENDPOINTS.ROLES}/with-user-count`);
        } catch (error: any) {
            throw new Error(`Failed to fetch roles with user count: ${error.message}`);
        }
    },
};

export default rolePermissionService;