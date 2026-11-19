// pages/RoleManagement.tsx
import { useEffect, useState, useMemo } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiKey,
  FiShield,
  FiAlertTriangle,
  FiCheck,
  FiX,
  FiUserCheck,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "react-data-table-component";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import {
  rolePermissionService,
  type Role,
  type Permission,
  type CreateRoleData,
  type UpdateRoleData,
} from "@/services/rolePermissionService";
import { Tooltip } from "react-tooltip";

// Reuse the same modal components from before with minor adjustments
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  role,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  role: Role | null;
}) => {
  return (
    <AnimatePresence>
      {isOpen && role && (
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 mx-4 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <FiAlertTriangle
                  className="text-red-600 dark:text-red-400"
                  size={32}
                />
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Delete Role
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {role.name}
                </span>
                ? This action will affect {role.userCount || 0} users.
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-700 dark:text-red-300">
                  <strong>Warning:</strong> Users with this role will lose their
                  permissions.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 flex items-center justify-center gap-2"
              >
                <FiTrash2 size={18} />
                Delete Role
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const RoleModal = ({
  isOpen,
  onClose,
  role,
  permissions,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleData: CreateRoleData | UpdateRoleData) => void;
  role?: Role;
  permissions: Permission[];
}) => {
  const [formData, setFormData] = useState({
    name: role?.name || "",
    description: role?.description || "",
    permissionIds: role?.permissions?.map((p) => p.id) || [],
  });
  useEffect(() => {
    setFormData({
      name: role?.name || "",
      description: role?.description || "",
      permissionIds: role?.permissions?.map((p) => p.id) || [],
    });
  }, [role]);

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (role?.id) {
        await rolePermissionService.updateRole(role.id, {
          name: formData.name,
          description: formData.description,
          permissionIds: formData.permissionIds,
        });

        await rolePermissionService.syncRolePermissions(
          role.id,
          formData.permissionIds
        );
      } else {
        const newRole = await rolePermissionService.createRole({
          name: formData.name,
          description: formData.description,
          permissionIds: formData.permissionIds,
        });
        if (formData.permissionIds.length) {
          await rolePermissionService.assignPermissionsToRole(
            newRole.id,
            formData.permissionIds
          );
        }
      }

      onClose(); // close modal
    } catch (error: any) {
      console.error("Error saving role:", error);
      alert(error.message || "Failed to save role");
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter((id) => id !== permissionId)
        : [...prev.permissionIds, permissionId],
    }));
  };

  const permissionGroups = useMemo(() => {
    const groups: { [resource: string]: Permission[] } = {};
    permissions.forEach((permission) => {
      if (!groups[permission.resource]) {
        groups[permission.resource] = [];
      }
      groups[permission.resource].push(permission);
    });
    return groups;
  }, [permissions]);

  const selectAllForResource = (permissions: Permission[]) => {
    const allSelected = permissions.every((p) =>
      formData.permissionIds.includes(p.id)
    );
    console.log(allSelected)

    setFormData((prev) => ({
      ...prev,
      permissionIds: allSelected
        ? prev.permissionIds.filter(
          (id) => !permissions.some((p) => p.id === id)
        )
        : [
          ...new Set([
            ...prev.permissionIds,
            ...permissions.map((p) => p.id),
          ]),
        ],
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 mx-4 max-w-4xl w-full shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {role ? "Edit Role" : "Create New Role"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter role name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter role description"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Permissions
                  </label>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formData.permissionIds.length} permissions selected
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
                  {Object.entries(permissionGroups).map(([resource, perms]) => {
                    const selectedCount = perms.filter((p) =>
                      formData.permissionIds.includes(p.id)
                    ).length;
                    const allSelected = selectedCount === perms.length;

                    return (
                      <div
                        key={resource}
                        className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                            {resource}
                          </h4>
                          <button
                            type="button"
                            onClick={() =>
                              selectAllForResource(perms)
                            }
                            className={`px-2 py-1 text-xs rounded ${allSelected
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                              }`}
                          >
                            {allSelected ? "Deselect All" : "Select All"}
                          </button>
                        </div>
                        <div className="space-y-2">
                          {perms.map((permission) => (
                            <label
                              key={permission.id}
                              className="flex items-center space-x-3 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={formData.permissionIds.includes(
                                  permission.id
                                )}
                                onChange={() => togglePermission(permission.id)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                {permission.action} {permission.resource}
                              </span>
                              {permission.description && (
                                <div className="group relative">
                                  <FiKey className="text-gray-400" size={14} />
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    {permission.description}
                                  </div>
                                </div>
                              )}
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !formData.name.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <FiRefreshCw size={18} className="animate-spin" />
                  ) : (
                    <FiCheck size={18} />
                  )}
                  {role ? "Update Role" : "Create Role"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    role: Role | null;
  }>({
    isOpen: false,
    role: null,
  });

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesResponse, permissionsResponse] = await Promise.all([
        rolePermissionService.getRolesWithUserCount(),
        rolePermissionService.getAllPermissions(),
      ]);
      setRoles(rolesResponse);
      setPermissions(permissionsResponse);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = useMemo(() => {
    return roles.filter(
      (role) =>
        role.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [roles, searchTerm]);

  const handleCreateRole = async (roleData: CreateRoleData) => {
    try {
      const newRole = await rolePermissionService.createRole(roleData);
      setRoles((prev) => [...prev, newRole]);
    } catch (err: any) {
      throw new Error(err.message || "Failed to create role");
    }
  };

  const handleUpdateRole = async (roleData: UpdateRoleData) => {
    if (!selectedRole) return;
    try {
      const updatedRole = await rolePermissionService.updateRole(
        selectedRole.id,
        roleData
      );
      setRoles((prev) =>
        prev.map((role) => (role.id === selectedRole.id ? updatedRole : role))
      );
      setSelectedRole(null);
    } catch (err: any) {
      throw new Error(err.message || "Failed to update role");
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      await rolePermissionService.deleteRole(roleId);
      setRoles((prev) => prev.filter((role) => role.id !== roleId));
      setDeleteModal({ isOpen: false, role: null });
    } catch (err: any) {
      alert(err.message || "Failed to delete role");
    }
  };

  const openEditModal = async (role: Role) => {
    try {
      const fullRole = await rolePermissionService.getRoleById(role.id);
      setSelectedRole(fullRole);
      setIsModalOpen(true);
    } catch (err: any) {
      alert(err.message || "Failed to load role details");
    }
  };

  const openDeleteModal = (role: Role) => {
    setDeleteModal({ isOpen: true, role });
  };

  const handleSaveRole = async (roleData: CreateRoleData | UpdateRoleData) => {
    if (selectedRole) {
      await handleUpdateRole(roleData as UpdateRoleData);
    } else {
      await handleCreateRole(roleData as CreateRoleData);
    }
  };

  const columns = [
    {
      name: "Role",
      selector: (row: Role) => row.name,
      sortable: true,
      minWidth: "200px",
      cell: (row: Role) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            <FiShield size={16} />
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {row.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {row.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Users",
      selector: (row: Role) => row.userCount || 0,
      sortable: true,
      width: "100px",
      center: true,
      cell: (row: Role) => (
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <FiUserCheck size={16} />
          <span className="font-semibold">{row.userCount || 0}</span>
        </div>
      ),
    },
    {
      name: "Permissions",
      selector: (row: Role) => row.permissions.length,
      sortable: true,
      width: "150px",
      center: true,
      cell: (row: Role) => (
        <span className="px-3 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-semibold">
          {row.permissions?.length} permissions
        </span>
      ),
    },
    {
      name: "Key Permissions",
      minWidth: "250px",
      cell: (row: Role) => {
        const keyPermissions = row.permissions.slice(0, 3);
        const remaining = row.permissions?.length - 3;

        return (
          <div className="flex flex-wrap gap-1">
            {keyPermissions.map((permission) => (
              <span
                key={permission.id}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium capitalize"
              >
                {permission.action} {permission.resource}
              </span>
            ))}
            {remaining > 0 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded text-xs">
                +{remaining} more
              </span>
            )}
          </div>
        );
      },
    },
    {
      name: "Actions",
      cell: (row: Role) => (
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => openEditModal(row)}
            className="p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30 shadow-sm hover:shadow-md"
            title="Edit role"
          >
            <FiEdit size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => openDeleteModal(row)}
            disabled={row.userCount && row.userCount > 0}
            className={`p-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md ${row.userCount && row.userCount > 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-red-600 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30"
              }`}
            title={
              row.userCount && row.userCount > 0
                ? "Cannot delete role with users"
                : "Delete role"
            }
          >
            <FiTrash2 size={18} />
          </motion.button>
        </div>
      ),
      width: "140px",
      center: true,
      sortable: false,
    },
  ];

  // Custom styles remain the same as previous implementation
  const customStyles = {
    // ... (same custom styles as before)
  };

  return (
    <>
      <PageMeta
        title="Role Management | Afar Aid"
        description="Advanced role and permission management system with granular access controls"
      />
      <PageBreadcrumb pageTitle="Role Management" />

      <div className="space-y-6">
        <ComponentCard
          title={
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Role & Permission Management
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage roles, permissions, and access controls across the
                  platform
                </p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedRole(null);
                    setIsModalOpen(true);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 flex items-center gap-2"
                >
                  <FiPlus size={18} />
                  Create Role
                </motion.button>
              </div>
            </div>
          }
        >
          {/* Advanced Controls */}
          <div className="mb-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <FiSearch
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search roles by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Refresh Button */}
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRefreshTrigger((prev) => prev + 1)}
                className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
                data-tooltip-id="refreshTip"
                data-tooltip-content="Refresh data"
              >
                <FiRefreshCw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />
              </motion.button>
              <Tooltip id="refreshTip" place="bottom" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {roles?.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Roles
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {permissions?.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Available Permissions
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {roles.reduce((acc, role) => acc + (role.userCount || 0), 0)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Users
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {Math.max(
                    ...roles.map((role) => role.permissions?.length),
                    0
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Max Permissions/Role
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <DataTable
                columns={columns}
                data={filteredRoles}
                progressPending={loading}
                highlightOnHover
                pagination
                responsive
                customStyles={customStyles}
                noHeader
                persistTableHead
                striped
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
              />
            </motion.div>
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400"
            >
              {error}
            </motion.div>
          )}
        </ComponentCard>
      </div>

      <RoleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRole(null);
        }}
        onSave={handleSaveRole}
        role={selectedRole || undefined}
        permissions={permissions}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, role: null })}
        onConfirm={() =>
          deleteModal.role && handleDeleteRole(deleteModal.role.id)
        }
        role={deleteModal.role}
      />
    </>
  );
}
