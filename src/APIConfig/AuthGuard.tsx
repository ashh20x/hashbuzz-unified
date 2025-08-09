import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { RootState } from "../Store/store";
import { useAppSelector } from "../Store/store";

/**
 * ProtectedRoute: Guards routes that require full authentication and onboarding completion
 * Redirects to appropriate step if user hasn't completed all onboarding steps
 */
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  // Get onboarding state
  const { wallet, auth, xAccount, token } = useAppSelector(
    (state: RootState) => state.auth.userAuthAndOnBoardSteps
  );

  // Check if user has completed all onboarding steps
  const isFullyOnboarded = 
    wallet.isPaired && 
    auth.isAuthenticated && 
    xAccount.isConnected && 
    token.allAssociated;

  // If not fully onboarded, redirect to the appropriate onboarding step
  if (!isFullyOnboarded) {
    // Determine which step to redirect to
    if (!wallet.isPaired) {
      return <Navigate to="/auth/pair-wallet" state={{ from: location }} replace />;
    }
    if (!auth.isAuthenticated) {
      return <Navigate to="/auth/sign-authentication" state={{ from: location }} replace />;
    }
    if (!xAccount.isConnected) {
      return <Navigate to="/auth/connect-x-account" state={{ from: location }} replace />;
    }
    if (!token.allAssociated) {
      return <Navigate to="/auth/associate-tokens" state={{ from: location }} replace />;
    }
  }

  // User is fully authenticated and onboarded
  return <>{children}</>;
};

/**
 * RedirectIfAuthenticated: Redirects authenticated users away from landing/login pages
 * Checks if user is in the middle of onboarding or fully authenticated
 */
export const RedirectIfAuthenticated: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { wallet, auth, xAccount, token } = useAppSelector(
    (state: RootState) => state.auth.userAuthAndOnBoardSteps
  );

  // Check if user has started any onboarding process
  const hasStartedOnboarding = wallet.isPaired || auth.isAuthenticated || xAccount.isConnected || token.allAssociated;

  // Check if user is fully onboarded
  const isFullyOnboarded = 
    wallet.isPaired && 
    auth.isAuthenticated && 
    xAccount.isConnected && 
    token.allAssociated;

  // If fully onboarded, redirect to dashboard
  if (isFullyOnboarded) {
    return <Navigate to="/dashboard" replace />;
  }

  // If in middle of onboarding, redirect to appropriate step
  if (hasStartedOnboarding) {
    if (!wallet.isPaired) {
      return <Navigate to="/auth/pair-wallet" replace />;
    }
    if (!auth.isAuthenticated) {
      return <Navigate to="/auth/sign-authentication" replace />;
    }
    if (!xAccount.isConnected) {
      return <Navigate to="/auth/connect-x-account" replace />;
    }
    if (!token.allAssociated) {
      return <Navigate to="/auth/associate-tokens" replace />;
    }
  }

  // User hasn't started onboarding, show landing page
  return <>{children}</>;
};

/**
 * OnboardingGuard: Ensures users can only access onboarding if they haven't completed it
 * Redirects completed users to dashboard
 */
export const OnboardingGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { wallet, auth, xAccount, token } = useAppSelector(
    (state: RootState) => state.auth.userAuthAndOnBoardSteps
  );

  // Check if user is fully onboarded
  const isFullyOnboarded = 
    wallet.isPaired && 
    auth.isAuthenticated && 
    xAccount.isConnected && 
    token.allAssociated;

  // If fully onboarded, redirect to dashboard
  if (isFullyOnboarded) {
    return <Navigate to="/dashboard" replace />;
  }

  // User still needs to complete onboarding
  return <>{children}</>;
};

/**
 * AuthenticationGuard: Guards routes that require authentication but not full onboarding
 * Used for intermediate onboarding steps that require auth
 */
export const AuthenticationGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  const { wallet, auth } = useAppSelector(
    (state: RootState) => state.auth.userAuthAndOnBoardSteps
  );

  // Must have paired wallet and be authenticated
  if (!wallet.isPaired || !auth.isAuthenticated) {
    return <Navigate to="/auth/pair-wallet" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

/**
 * AdminGuard: Guards admin routes - requires full authentication plus admin role
 */
export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  const { wallet, auth, xAccount, token } = useAppSelector(
    (state: RootState) => state.auth.userAuthAndOnBoardSteps
  );

  // Check if user is fully onboarded first
  const isFullyOnboarded = 
    wallet.isPaired && 
    auth.isAuthenticated && 
    xAccount.isConnected && 
    token.allAssociated;

  if (!isFullyOnboarded) {
    return <Navigate to="/auth/pair-wallet" state={{ from: location }} replace />;
  }

  // TODO: Add admin role check here when user roles are implemented
  // const currentUser = useAppSelector(state => state.auth.currentUser);
  // if (!currentUser?.isAdmin) {
  //   return <Navigate to="/dashboard" replace />;
  // }

  return <>{children}</>;
};
