import { RouterProvider } from 'react-router-dom';
import useAppSessionManager from './hooks/use-appSession-manager'
import router from './Router.tsx';
import StyledComponentTheme from './theme/Theme';

const AppRouter = () => {
  const sessionManager = useAppSessionManager();
  
  // Expose to window for debugging (development only)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as any).sessionManager = sessionManager;
  }
  
  return (
    <StyledComponentTheme>
      <RouterProvider router={router} />
    </StyledComponentTheme>
  );
};

export default AppRouter;
