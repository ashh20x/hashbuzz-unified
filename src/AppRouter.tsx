import { RouterProvider } from 'react-router-dom';
import StyledComponentTheme from './theme/Theme';
import router from './router';

const AppRouter = () => (
  <StyledComponentTheme>
    <RouterProvider router={router} />
  </StyledComponentTheme>
);

export default AppRouter;
