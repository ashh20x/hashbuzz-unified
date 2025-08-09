import { RouterProvider } from 'react-router-dom';
import RefreshTokenProvider from './components/TokenRefreshProvider.tsx';
import router from './Router.tsx';
import StyledComponentTheme from './theme/Theme';
import useTokenAssociationSync from './hooks/use-token-association-sync.ts';

const AppRouter = () => {
  useTokenAssociationSync();
  return (
    <StyledComponentTheme>
      <RefreshTokenProvider>
        <RouterProvider router={router} />
      </RefreshTokenProvider>
    </StyledComponentTheme>
  );
};

export default AppRouter;
