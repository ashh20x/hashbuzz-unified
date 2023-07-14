import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import { Main } from "./screens/Main";
import { ProtectedRoute } from "./APIConfig/AuthGuard";
import { Dashboard, CreateCampaign, PageNotfound  , Landing} from "./Ver2Designs";
import { AdminDashboard } from "./Ver2Designs/Admin";
import StyledComponentTheme from "./theme/Theme";
import AdminAuthGuard from "./Ver2Designs/Admin/AdminAuthGuard";
import MainLayout from "./Ver2Designs/Layout";

const router = createBrowserRouter([
  {
    index: true,
    element: <Landing />
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
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "create-campaign",
        element: <CreateCampaign />,
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

const AppRouter = () => (
  <StyledComponentTheme>
    <RouterProvider router={router} />
  </StyledComponentTheme>
);

export default AppRouter;
