import { RouterProvider } from 'react-router-dom';
import RefreshTokenProvider from './components/TokenRefreshProvider.tsx';
import router from './Router.tsx';
import StyledComponentTheme from './theme/Theme';

const AppRouter = () => {
  return (
    <StyledComponentTheme>
      <RefreshTokenProvider>
        <RouterProvider router={router} />
      </RefreshTokenProvider>
    </StyledComponentTheme>
  );
};

export default AppRouter;
