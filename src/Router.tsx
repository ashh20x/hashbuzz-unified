import { createBrowserRouter, Navigate } from "react-router-dom";
import { RedirectIfAuthenticated } from "./APIConfig/AuthGuard";
import StepGuard from "./components/StepGuard";
import { ContentPage, PageNotfound } from "./Ver2Designs";
import {
    AssociateTokens,
    AuthAndOnBoardLayout,
    ConnectXAccount,
    PairWalletAndAuthenticate,
    SignAuthentication,
} from "./Ver2Designs/Pages/AuthAndOnboard";
import TwitterCallback from "./Ver2Designs/Pages/AuthAndOnboard/TwitterCallback";
import { OnboardingSteps } from "./Ver2Designs/Pages/AuthAndOnboard/authStoreSlice";
import { LandingV3 } from "./Ver2Designs/Pages/Landing";

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
                path: OnboardingSteps.SignAuthentication,
                element: (
                    <StepGuard step={OnboardingSteps.SignAuthentication}>
                        <SignAuthentication />
                    </StepGuard>
                ),
            },
            {
                path: OnboardingSteps.ConnectXAccount,
                element: (
                    <StepGuard step={OnboardingSteps.ConnectXAccount}>
                        <ConnectXAccount />
                    </StepGuard>
                ),
            },
            {
                path: OnboardingSteps.AssociateTokens,
                element: (
                    <StepGuard step={OnboardingSteps.AssociateTokens}>
                        <AssociateTokens />
                    </StepGuard>
                ),
            },
            {
                path: "twitter-callback",
                element: <TwitterCallback />,
            },
        ],
    },
    // {
    //     path: "/",
    //     element: (
    //         <ProtectedRoute>
    //             <MainLayout />
    //         </ProtectedRoute>
    //     ),
    //     children: [
    //         { path: "/", element: <Dashboard /> },
    //         { path: "dashboard", element: <Dashboard /> },
    //         { path: "campaign", element: <Template /> },
    //         { path: "create-campaign", element: <CreateCampaign /> },
    //         { path: "invoice", element: <Invoice /> },
    //         { path: "onboarding", element: <OnBoarding /> },
    //         { path: "settings", element: "" },
    //         { path: "transactions", element: "" },
    //         { path: "archived", element: "" },
    //     ],
    // },
    // {
    //     path: "/admin",
    //     element: (
    //         <AdminAuthGuard>
    //             <AdminDashboard />
    //         </AdminAuthGuard>
    //     ),
    // },
    { path: "/terms-of-use", element: <ContentPage page="TermsOfUse" /> },
    { path: "/privacy-policy", element: <ContentPage page="PrivacyPolicy" /> },
    { path: "/cookies", element: <ContentPage page="PrivacyPolicy" /> },
    { path: "/*", element: <PageNotfound /> },
]);

export default router;
