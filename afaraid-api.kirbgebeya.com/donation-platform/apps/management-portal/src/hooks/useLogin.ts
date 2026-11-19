import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "@/services/authService";
import type { AuthResponse } from "@/types/auth";
import { useNavigate } from "react-router";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setServerError(null);

    try {
      await authService.login({
        email: data.email,
        password: data.password,
      });

      await new Promise<void>((resolve) => setTimeout(resolve, 1200));

      navigate("/", { replace: true });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
          err?.message?.includes("Failed to login")
          ? "Invalid email or password."
          : err?.message || "Something went wrong.";

      setServerError(message);

      if (message.toLowerCase().includes("email")) {
        setError("email", { message });
      } else if (message.toLowerCase().includes("password")) {
        setError("password", { message });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    serverError,
    loading,
    isValid,
  };
};
