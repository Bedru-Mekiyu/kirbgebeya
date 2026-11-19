import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import userService from "@/services/userService";
import {
  rolePermissionService,
  type Role,
} from "@/services/rolePermissionService";
import type { User } from "@/services/authService";
import toast from "react-hot-toast";

interface EditUserModalProps {
  user: User;
  isOpen?: boolean;
  onClose: () => void;
  updateUserInList: (user: User) => void;
}

export default function EditUserModal({
  user,
  isOpen = true,
  onClose,
  updateUserInList,
}: EditUserModalProps) {
  const [firstName, setFirstName] = useState(user.first_name || "");
  const [lastName, setLastName] = useState(user.last_name || "");
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [role, setRole] = useState(user.role || "");
  const [roles, setRoles] = useState<Role[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(user.isActive ?? true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await rolePermissionService.getAllRoles();
        setRoles(response);
        console.log(response)
        if (!role && response.length > 0) setRole(response[0].name);
      } catch (err: any) {
        toast.error("Failed to load roles");
        console.error(err);
      }
    };
    fetchRoles();
  }, []);

  const resetForm = () => {
    setFirstName(user.first_name || "");
    setLastName(user.last_name || "");
    setUsername(user.username || "");
    setEmail(user.email || "");
    setRole(user.role || roles[0]?.name || "");
    setIsActive(user.isActive ?? true);
    setError(null);
  };

  const handleUpdate = async () => {
    if (!firstName || !lastName || !username || !email || !role) {
      setError("Please fill in all required fields");
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const updatedUser = await userService.updateUser(user.id, {
        first_name: firstName,
        last_name: lastName,
        username,
        email,
        role,
        isActive,
      });

      updateUserInList(updatedUser);
      toast.success("User updated successfully!");
      onClose();
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update user";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[600px] m-4">
      <div className="relative w-full p-6 bg-white dark:bg-gray-900 rounded-3xl">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-2">
          Edit User
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Update the user details below.
        </p>

        {error && (
          <div className="text-red-500 mb-4 font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>First Name *</Label>
              <Input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
                disabled={submitting}
              />
            </div>
            <div>
              <Label>Last Name *</Label>
              <Input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                required
                disabled={submitting}
              />
            </div>
          </div>

          <div>
            <Label>Username *</Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe123"
              required
              disabled={submitting}
            />
          </div>

          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
              disabled={submitting}
            />
          </div>

          <div>
            <Label>Role</Label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {roles?.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Label>Status</Label>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-300 focus:outline-none ${isActive ? "bg-green-500" : "bg-red-500"
                }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${isActive ? "translate-x-6" : "translate-x-1"
                  }`}
              />
            </button>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              onClick={handleUpdate}
              disabled={submitting}
              loading={submitting}
            >
              {submitting ? "Updating..." : "Update User"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
