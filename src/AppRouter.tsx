import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute, RedirectIfAuthenticated } from "./APIConfig/AuthGuard";
import { CreateCampaign, Dashboard, Landing, PageNotfound, ContentPage } from "./Ver2Designs";
import { AdminDashboard } from "./Ver2Designs/Admin";
import AdminAuthGuard from "./Ver2Designs/Admin/AdminAuthGuard";
import MainLayout from "./Ver2Designs/Layout";
import StyledComponentTheme from "./theme/Theme";
import { Template } from "./screens/Template";
import { Invoice } from "./screens/Invoice";
import { OnBoarding } from "./screens/OnBoarding";
import { LandingV3 } from "./Ver2Designs/Pages/Landing";
import { AuthAndOnBoardLayout, ConnectWallet } from "./Ver2Designs/Pages/AuthAndOnboard";

const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: (
      <RedirectIfAuthenticated>
        <LandingV3 />
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: "/auth",
    element: <AuthAndOnBoardLayout />,
    children: [
      { path: "", element: <ConnectWallet /> },
      { path: "connect-wallet", element: <ConnectWallet /> },
    ],
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
  {
    path: "/terms-of-use",
    element: <ContentPage page="TermsOfUse" />,
  },
  {
    path: "/privacy-policy",
    element: <ContentPage page="PrivacyPolicy" />,
  },
  {
    path: "/cookies",
    element: <ContentPage page="PrivacyPolicy" />,
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
