import { RouterProvider } from 'react-router-dom';
import useAppSessionManager from './hooks/use-appSession-manager.ts';
import router from './Router.tsx';
import StyledComponentTheme from './theme/Theme';

const AppRouter = () => {
  useAppSessionManager({
    sessionExpireMinutes: 2
  })
  return (
    <StyledComponentTheme>
      <RouterProvider router={router} />
    </StyledComponentTheme>
  );
};

export default AppRouter;
