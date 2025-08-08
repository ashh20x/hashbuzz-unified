import { RouterProvider } from 'react-router-dom';
import StyledComponentTheme from './theme/Theme';
import router from './Router.tsx';
import useWalletPairingStatus from './hooks/use-wallet-pairing-status.ts';

const AppRouter = () => {
  useWalletPairingStatus()
  return (
    <StyledComponentTheme>
      <RouterProvider router={router} />
    </StyledComponentTheme>
  );
};

export default AppRouter;
