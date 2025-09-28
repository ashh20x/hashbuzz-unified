import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './APIConfig/AuthGuard';
import StepGuard from './components/StepGuard';
import {
  CampaignCreatorWrapper,
  ContentPage,
  Dashboard,
  PageNotfound,
} from './Ver2Designs';
import MainLayout from './Ver2Designs/Layout';
import {
  AssociateTokens,
  AuthAndOnBoardLayout,
  ConnectXAccount,
  OnboardingSteps,
  PairWalletAndAuthenticate,
  SignAuthentication,
  TwitterCallback,
} from './Ver2Designs/Pages/AuthAndOnboard';
import { ConnectXSuccess } from './Ver2Designs/Pages/AuthAndOnboard/ConnectXAccount/ConnectXSuccess';
import LeaderBoard from './Ver2Designs/Pages/Dashboard/Leaderboard/LeaderBoard';
import { LandingV3 } from './Ver2Designs/Pages/Landing';

const router = createBrowserRouter([
  {
    path: '/',
    index: true,
    element: <LandingV3 />,
  },
  {
    path: 'business-handle-callback',
    element: <TwitterCallback variant='business' />,
  },
  {
    path: '/auth',
    element: <AuthAndOnBoardLayout />,
    children: [
      { index: true, element: <Navigate to='pair-wallet' replace /> },
      {
        path: 'pair-wallet',
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
        path: 'twitter-callback',
        element: <TwitterCallback variant='personal' />,
      },
    ],
  },
  {
    path: OnboardingSteps.ConnectXSuccess,
    element: <ConnectXSuccess />,
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to='dashboard' replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'leaderboard', element: <LeaderBoard /> },
      // { path: "campaign", element: <Template /> },
      { path: 'create-campaign', element: <CampaignCreatorWrapper /> },

      // Uncomment and add these routes as needed:
      // { path: "invoice", element: <Invoice /> },
      // { path: "settings", element: <Settings /> },
      // { path: "transactions", element: <Transactions /> },
      // { path: "archived", element: <Archived /> },
    ],
  },
  { path: '/terms-of-use', element: <ContentPage page='TermsOfUse' /> },
  { path: '/privacy-policy', element: <ContentPage page='PrivacyPolicy' /> },
  { path: '/cookies', element: <ContentPage page='PrivacyPolicy' /> },
  { path: '/*', element: <PageNotfound /> },
]);

export default router;

// --------- IGNORE BELOW THIS LINE ---------

// import { createBrowserRouter, Navigate } from 'react-router-dom';
// import { ProtectedRoute } from './APIConfig/AuthGuard';
// import StepGuard from './components/StepGuard';
// import {
//   ContentPage,
//   CreateCampaignContainer,
//   Dashboard,
//   PageNotfound,
// } from './Ver2Designs';
// import MainLayout from './Ver2Designs/Layout';
// import {
//   AssociateTokens,
//   AuthAndOnBoardLayout,
//   ConnectXAccount,
//   OnboardingSteps,
//   PairWalletAndAuthenticate,
//   SignAuthentication,
//   TwitterCallback,
// } from './Ver2Designs/Pages/AuthAndOnboard';
// import { ConnectXSuccess } from './Ver2Designs/Pages/AuthAndOnboard/ConnectXAccount/ConnectXSuccess';
// import { LandingV3 } from './Ver2Designs/Pages/Landing';

// const router = createBrowserRouter([
//   {
//     path: '/',
//     index: true,
//     element: <LandingV3 />,
//   },
//   {
//     path: 'business-handle-callback',
//     element: <TwitterCallback variant='business' />,
//   },
//   {
//     path: '/auth',
//     element: <AuthAndOnBoardLayout />,
//     children: [
//       { index: true, element: <Navigate to='pair-wallet' replace /> },
//       {
//         path: 'pair-wallet',
//         element: (
//           <StepGuard step={OnboardingSteps.PairWallet}>
//             <PairWalletAndAuthenticate />
//           </StepGuard>
//         ),
//       },
//       {
//         path: OnboardingSteps.SignAuthentication,
//         element: (
//           <StepGuard step={OnboardingSteps.SignAuthentication}>
//             <SignAuthentication />
//           </StepGuard>
//         ),
//       },
//       {
//         path: OnboardingSteps.ConnectXAccount,
//         element: (
//           <StepGuard step={OnboardingSteps.ConnectXAccount}>
//             <ConnectXAccount />
//           </StepGuard>
//         ),
//       },

//       {
//         path: OnboardingSteps.AssociateTokens,
//         element: (
//           <StepGuard step={OnboardingSteps.AssociateTokens}>
//             <AssociateTokens />
//           </StepGuard>
//         ),
//       },
//       {
//         path: 'twitter-callback',
//         element: <TwitterCallback variant='personal' />,
//       },
//     ],
//   },
//   {
//     path: OnboardingSteps.ConnectXSuccess,
//     element: <ConnectXSuccess />,
//   },
//   {
//     path: '/app',
//     element: (
//       <ProtectedRoute>
//         <MainLayout />
//       </ProtectedRoute>
//     ),
//     children: [
//       { index: true, element: <Navigate to='/dashboard' replace /> },
//       { path: 'dashboard', element: <Dashboard /> },
//       // { path: "campaign", element: <Template /> },
//       { path: 'create-campaign', element: <CreateCampaignContainer /> },

//       // Uncomment and add these routes as needed:
//       // { path: "invoice", element: <Invoice /> },
//       // { path: "settings", element: <Settings /> },
//       // { path: "transactions", element: <Transactions /> },
//       // { path: "archived", element: <Archived /> },
//     ],
//   },
//   { path: '/terms-of-use', element: <ContentPage page='TermsOfUse' /> },
//   { path: '/privacy-policy', element: <ContentPage page='PrivacyPolicy' /> },
//   { path: '/cookies', element: <ContentPage page='PrivacyPolicy' /> },
//   { path: '/*', element: <PageNotfound /> },
// ]);

// export default router;
