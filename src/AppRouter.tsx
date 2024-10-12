import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute, RedirectIfAuthenticated } from "./APIConfig/AuthGuard";
import { CreateCampaign, Dashboard, Landing, PageNotfound } from "./Ver2Designs";
import { AdminDashboard } from "./Ver2Designs/Admin";
import AdminAuthGuard from "./Ver2Designs/Admin/AdminAuthGuard";
import MainLayout from "./Ver2Designs/Layout";
import StyledComponentTheme from "./theme/Theme";
import { Template } from "./screens/Template";
import { Invoice } from "./screens/Invoice";
import { OnBoarding } from "./screens/OnBoarding";
import React, { useEffect } from "react";

const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: (
      <RedirectIfAuthenticated>
        <Landing />
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "campaign",
        element: <Template />,
      },
      {
        path: "create-campaign",
        element: <CreateCampaign />,
      },
      {
        path: "invoice",
        element: <Invoice />,
      },
      {
        path: "onboarding",
        element: <OnBoarding />,
      },
      {
        path: "settings",
        element: "",
      },
      {
        path: "transactions",
        element: "",
      },
      {
        path: "archived",
        element: "",
      },
    ],
  },

  {
    path: "/admin",
    element: (
      <AdminAuthGuard>
        <AdminDashboard />
      </AdminAuthGuard>
    ),
  },
  { path: "/*", element: <PageNotfound /> },
]);

const AppRouter = () => {
  return (
    <StyledComponentTheme>
      <RouterProvider router={router} />
    </StyledComponentTheme>
  );
};

export default AppRouter;
