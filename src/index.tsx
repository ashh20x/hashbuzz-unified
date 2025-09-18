import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useEffect, useState } from 'react';
import AppRouter from './AppRouter';
import { store } from './Store/store';
import HashbuzzWalletProvider from './Wallet/hashconnectService';
import './index.css';
import { initRemoteConfig } from './remoteConfig';


const theme = createTheme();

const RemoteConfigLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    initRemoteConfig().finally(() => setLoading(false));
  }, []);
  if (loading) return <div>Loading configuration...</div>;
  return <>{children}</>;
};

const App = () => {
  return (
    <React.StrictMode>
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
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />);
