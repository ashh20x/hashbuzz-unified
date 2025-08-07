import { RouterProvider } from 'react-router-dom';
import StyledComponentTheme from './theme/Theme';
import router from './router.tsx';

const AppRouter = () => (
  <StyledComponentTheme>
    <RouterProvider router={router} />
  </StyledComponentTheme>
);

export default AppRouter;
