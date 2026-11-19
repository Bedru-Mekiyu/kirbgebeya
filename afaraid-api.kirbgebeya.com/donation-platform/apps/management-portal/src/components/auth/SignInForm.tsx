import { useState, useEffect } from "react";
import { Link } from "react-router";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useLogin } from "@/hooks/useLogin";

export default function SignInForm() {
  const { register, handleSubmit, errors, serverError, loading, isValid } =
    useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("keepLoggedIn");
    if (saved === "true") setKeepLoggedIn(true);
  }, []);

  const handleKeepLoggedInChange = (checked: boolean) => {
    setKeepLoggedIn(checked);
    localStorage.setItem("keepLoggedIn", checked.toString());
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-6">
              <div>
                <Label htmlFor="email">
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="username"
                  disabled={loading}
                  required
                  {...register("email")}
                />
                {errors.email && !serverError && (
                  <p className="mt-1 text-sm text-error-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={loading}
                    required
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeIcon className="w-5 h-5" />
                    ) : (
                      <EyeOffIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-error-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="keep-logged-in"
                    checked={keepLoggedIn}
                    onChange={handleKeepLoggedInChange}
                    disabled={loading}
                  />
                  <Label
                    htmlFor="keep-logged-in"
                    className="text-sm font-normal text-gray-700 dark:text-gray-400 cursor-pointer"
                  >
                    Keep me logged in
                  </Label>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Forgot password?
                </Link>
              </div>

              {serverError && (
                <div className="p-3 text-sm text-error-600 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
                  {serverError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="sm"
                disabled={loading || !isValid}
                loading={loading}
              >
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
