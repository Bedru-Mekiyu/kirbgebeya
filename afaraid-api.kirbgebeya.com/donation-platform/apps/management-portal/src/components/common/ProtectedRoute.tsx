import { Navigate } from "react-router";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("authToken");
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
