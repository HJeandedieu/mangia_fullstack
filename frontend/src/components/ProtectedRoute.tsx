import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('CUSTOMER' | 'ADMIN')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthLoading } = useApp();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F2ED]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#01311F] border-t-transparent mb-2"></div>
          <p className="text-[#01311F] font-semibold text-sm">Authenticating with Mangia Server...</p>
        </div>
      </div>
    );
  }

  // Not logged in -> Auth redirect
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Role restriction mismatch
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If Admin tries to visit customer or vice versa, redirect them gracefully to their dashboard
    const target = user.role === "ADMIN" ? "/admin" : "/menu";
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
};
