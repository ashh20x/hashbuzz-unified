import React from "react";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";
import { useStore } from "../Store/StoreProvider";
import { useEffect } from "react";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cookies] = useCookies(["aSToken"]);
  const store = useStore();

  if (cookies.aSToken && store?.ping.status) return <>{children}</>;

  return <Navigate to={"/"} />;
};

export const RedirectIfAuthenticated: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { ping, auth } = useStore();
  const [cookies] = useCookies(["aSToken", "refreshToken"]);

  const isAuthenticated = ping.status && (auth?.auth || cookies.aSToken);

  if (isAuthenticated) {
    // Redirect authenticated users to Dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
