import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import userService from "@/services/userService";
import type { User } from "@/services/authService";
import toast from "react-hot-toast";

interface AddUserCardProps {
  addUserToList: (user: User) => void;
}

export default function AddUserCard({ addUserToList }: AddUserCardProps) {
  const { isOpen, openModal, closeModal } = useModal();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setError(null);
  };

  const handleSave = async () => {
    // Basic validation
    if (!firstName || !lastName || !username || !email || !password) {
      setError("Please fill in all required fields");
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const newUser = await userService.createUser({
        first_name: firstName,
        last_name: lastName,
        username,
        email,
        password,
      });

      addUserToList(newUser);
      resetForm();
      closeModal();

      toast.success("User created successfully!", {
        duration: 4000,
        position: "top-right",
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to add user";
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 5000,
        position: "top-right",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    closeModal();
  };

  return (
    <>
      <Button onClick={openModal} className="mb-4">
        Add New User
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[600px] m-4">
        <div className="relative w-full p-6 bg-white dark:bg-gray-900 rounded-3xl">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-2">
            Add New User
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Fill in the details to create a new user.
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
              handleSave();
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

            <div className="relative w-full">
              <Label>Password *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="StrongPassword123!"
                  required
                  disabled={submitting}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={submitting}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
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
                onClick={handleSave}
                disabled={submitting}
                loading={submitting}
              >
                {submitting ? "Creating..." : "Create User"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}