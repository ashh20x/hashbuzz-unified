import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { ProtectedRoute, RedirectIfAuthenticated } from "./APIConfig/AuthGuard";
import StepGuard from "./components/StepGuard";
import { Invoice } from "./screens/Invoice";
import { OnBoarding } from "./screens/OnBoarding";
import { Template } from "./screens/Template";
import StyledComponentTheme from "./theme/Theme";
import { ContentPage, CreateCampaign, Dashboard, PageNotfound } from "./Ver2Designs";
import { AdminDashboard } from "./Ver2Designs/Admin";
import AdminAuthGuard from "./Ver2Designs/Admin/AdminAuthGuard";
import MainLayout from "./Ver2Designs/Layout";
import { AssociateTokens, AuthAndOnBoardLayout, ConnectXAccount, PairWalletAndAuthenticate } from "./Ver2Designs/Pages/AuthAndOnboard";
import { LandingV3 } from "./Ver2Designs/Pages/Landing";
import { OnboardingSteps } from "./Ver2Designs/Pages/AuthAndOnboard/authStoreSlice";

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
      { index: true, element: <Navigate to="pair-wallet" replace /> },
      {
        path: "pair-wallet",
        element: (
          <StepGuard step={OnboardingSteps.PairWallet}>
            <PairWalletAndAuthenticate />
          </StepGuard>
        ),
      },
      {
        path: "connect-x-account",
        element: (
          <StepGuard step={OnboardingSteps.ConnectXAccount}>
            <ConnectXAccount />
          </StepGuard>
        ),
      },
      {
        path: "associate-tokens",
        element: (
          <StepGuard step={OnboardingSteps.AssociateTokens}>
            <AssociateTokens />
          </StepGuard>
        ),
      },
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
