import { useEffect, useState, useMemo } from "react";
import {
  FiEdit,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiUserCheck,
  FiUserX,
  FiAlertTriangle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "react-data-table-component";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import type { User } from "@/services/authService";
import userService from "@/services/userService";

import AddUserCard from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import { Tooltip } from "react-tooltip";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
}) => {
  return (
    <AnimatePresence>
      {isOpen && user && (
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 mx-4 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <FiAlertTriangle
                  className="text-red-600 dark:text-red-400"
                  size={32}
                />
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Delete User
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {user.first_name} {user.last_name}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-700 dark:text-red-300">
                  <strong>Warning:</strong> All user data will be permanently
                  removed from the system.
                </p>
              </div>
            </div>

            {/* Actions */}
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
                Delete User
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({
    isOpen: false,
    user: null,
  });

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users?.filter((user) => {
      const matchesSearch =
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "inactive" && !user.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter]);

  const addUserToList = (user: User) => setUsers((prev) => [...prev, user]);
  const updateUserInList = (updatedUser: User) =>
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );

  const handleDeleteUser = async (userId: string) => {
    try {
      await userService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setDeleteModal({ isOpen: false, user: null });

    } catch (err: any) {
      alert(err.message || "Failed to delete user");
    }
  };

  const openDeleteModal = (user: User) => {
    setDeleteModal({ isOpen: true, user });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, user: null });
  };

  const toggleUserStatus = async (user: User) => {
    try {
      const updated = await userService.updateUser(user.id, {
        isVerified: !user.isVerified,
      });
      updateUserInList(updated);
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  const columns = [
    {
      name: "No",
      selector: (_, i) => i + 1,
      width: "70px",
      center: true,
      sortable: false,
    },
    {
      name: "User",
      selector: (row: User) => `${row.first_name} ${row.last_name}`,
      sortable: true,
      minWidth: "200px",
      cell: (row: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {row.first_name[0]}
            {row.last_name[0]}
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {row.first_name} {row.last_name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Role",
      selector: (row: User) => row.roles.map((r) => r.name).join(", ") || "-",
      sortable: true,
      minWidth: "150px",
      cell: (row: User) => (
        <div className="flex flex-wrap gap-1">
          {row.roles?.map((role) => {
            const roleStyles =
              role.name === "admin"
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                : role.name === "moderator"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

            return (
              <span
                key={role.id}
                className={`px-2 py-1 rounded-full text-xs font-semibold ${roleStyles}`}
              >
                {role.name}
              </span>
            );
          })}
        </div>
      ),
    },
    {
      name: "Status",
      cell: (row: User) => (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => toggleUserStatus(row)}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${row.isActive
            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30"
            : "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30"
            }`}
        >
          {row.isActive ? <FiUserCheck size={14} /> : <FiUserX size={14} />}
          {row.isActive ? "Active" : "Inactive"}
        </motion.button>
      ),
      sortable: true,
      width: "140px",
      center: true,
    },
    {
      name: "Actions",
      cell: (row: User) => (
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setSelectedUser(row);
              setIsEditModalOpen(true);
            }}
            className="p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30 shadow-sm hover:shadow-md"
            title="Edit user"
          >
            <FiEdit size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => openDeleteModal(row)}
            className="p-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-200 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30 shadow-sm hover:shadow-md"
            title="Delete user"
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

  const customStyles = {
    table: {
      style: {
        backgroundColor: "transparent",
      },
    },
    headRow: {
      style: {
        backgroundColor: "transparent",
        borderBottomWidth: "1px",
        borderBottomColor: "#e2e8f0",
        fontWeight: "600",
        fontSize: "14px",
        color: "#374151",
        backdropFilter: "blur(8px)",
      },
    },
    headCells: {
      style: {
        fontWeight: "600",
        fontSize: "14px",
        color: "#374151",
        backgroundColor: "transparent",
        paddingLeft: "16px",
        paddingRight: "16px",
        "&:first-of-type": {
          paddingLeft: "24px",
        },
        "&:last-of-type": {
          paddingRight: "24px",
        },
      },
    },
    cells: {
      style: {
        fontSize: "14px",
        color: "#4b5563",
        paddingLeft: "16px",
        paddingRight: "16px",
        "&:first-of-type": {
          paddingLeft: "24px",
        },
        "&:last-of-type": {
          paddingRight: "24px",
        },
      },
    },
    rows: {
      style: {
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #f1f5f9",
        minHeight: "70px",
        "&:not(:last-of-type)": {
          borderBottomWidth: "1px",
          borderBottomColor: "#f1f5f9",
        },
        "&:hover": {
          backgroundColor: "#f8fafc",
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        },
      },
      highlightOnHoverStyle: {
        backgroundColor: "#eff6ff",
        borderBottomColor: "#dbeafe",
        outline: "2px solid #dbeafe",
        transform: "translateY(-1px)",
        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)",
      },
    },
    pagination: {
      style: {
        backgroundColor: "transparent",
        borderTop: "1px solid #e2e8f0",
        fontSize: "14px",
        color: "#64748b",
      },
      pageButtonsStyle: {
        borderRadius: "8px",
        height: "40px",
        width: "40px",
        padding: "8px",
        margin: "0 4px",
        color: "#64748b",
        fill: "#64748b",
        backgroundColor: "transparent",
        "&:disabled": {
          color: "#cbd5e1",
          fill: "#cbd5e1",
        },
        "&:hover:not(:disabled)": {
          backgroundColor: "#e2e8f0",
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
        "&:focus": {
          backgroundColor: "#e2e8f0",
          outline: "none",
        },
      },
    },
  };

  return (
    <>
      <PageMeta
        title="Users Dashboard | Afar Aid"
        description="Advanced user management panel with real-time controls, filtering, and analytics for Afar Aid platform administrators."
      />
      <PageBreadcrumb pageTitle="Users Management" />

      <div className="space-y-6">
        <ComponentCard
          title={
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Users Management
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage and monitor all platform users with advanced controls
                </p>
              </div>
              <div className="flex gap-3">
                <AddUserCard addUserToList={addUserToList} />
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
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${statusFilter === "all"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-500"
                      }`}
                  >
                    <FiFilter size={16} />
                    All Users
                  </button>

                  <button
                    onClick={() => setStatusFilter("active")}
                    className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${statusFilter === "active"
                      ? "bg-green-600 text-white shadow-lg shadow-green-500/25"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-green-500"
                      }`}
                  >
                    <FiUserCheck size={16} />
                    Active
                  </button>

                  <button
                    onClick={() => setStatusFilter("inactive")}
                    className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${statusFilter === "inactive"
                      ? "bg-amber-600 text-white shadow-lg shadow-amber-500/25"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-amber-500"
                      }`}
                  >
                    <FiUserX size={16} />
                    Inactive
                  </button>
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
                  {users?.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Users
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {users?.filter((u) => u.isVerified).length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Verified
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {users?.filter((u) => !u.isVerified).length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Pending
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {
                    users?.filter((u) => u.roles?.some((r) => r.name === "admin"))
                      .length
                  }
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Admins
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
                data={filteredUsers}
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

      <AnimatePresence>
        {selectedUser && (
          <EditUserModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            user={selectedUser}
            updateUserInList={updateUserInList}
          />
        )}
      </AnimatePresence>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() =>
          deleteModal.user && handleDeleteUser(deleteModal.user.id)
        }
        user={deleteModal.user}
      />
    </>
  );
}
