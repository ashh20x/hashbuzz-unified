import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from './AppRouter';
import RemoteConfigLoader from './RemoteConfigLoader';
import SplashScreen from './SplashScreen';
import { store } from './Store/store';
import HashbuzzWalletProvider from './Wallet/hashconnectService';

const theme = createTheme();

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <Suspense fallback={<SplashScreen message='Loading application...' />}>
        <Provider store={store}>
          <HashbuzzWalletProvider>
            <ThemeProvider theme={theme}>
              <RemoteConfigLoader>
                <AppRouter />
              </RemoteConfigLoader>
            </ThemeProvider>
          </HashbuzzWalletProvider>
        </Provider>
        <ToastContainer />
      </Suspense>
    </React.StrictMode>
  );
};

export default App;
