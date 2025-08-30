import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from './AppRouter';
import { store } from './Store/store';
import HashbuzzWalletProvider from './Wallet/hashconnectService';
import './index.css';

const theme = createTheme();

const App = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <HashbuzzWalletProvider>
          <ThemeProvider theme={theme}>
            <AppRouter />
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
