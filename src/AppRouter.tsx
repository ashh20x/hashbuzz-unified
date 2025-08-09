import { RouterProvider } from 'react-router-dom';
import useWalletPairingStatus from './hooks/use-wallet-pairing-status.ts';
import router from './Router.tsx';
import StyledComponentTheme from './theme/Theme';
import RefreshTokenProvider from './components/TokenRefreshProvider.tsx';

const AppRouter = () => {
  useWalletPairingStatus();

  return (
    <StyledComponentTheme>
      <RefreshTokenProvider>
        <RouterProvider router={router} />
      </RefreshTokenProvider>
    </StyledComponentTheme>
  );
};

export default AppRouter;
