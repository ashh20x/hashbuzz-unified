import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import { CookiesProvider } from "react-cookie";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosProvider from "./APIConfig/AxiosProvider";
import AppRouter from "./AppRouter";
import "./index.css";
import { store } from "./Store/store";
import { StoreProvider as LocalStoreProvider } from "./Store/StoreProvider";
import HashbuzzWalletProvider from "./Wallet/hashconnectService";


const theme = createTheme();

const App = () => {
  return (
    <React.StrictMode>
      <CookiesProvider>
        <Provider store={store}>
          <LocalStoreProvider>
            <AxiosProvider>
              <HashbuzzWalletProvider>
                <ThemeProvider theme={theme}>
                  <AppRouter />
                </ThemeProvider>
              </HashbuzzWalletProvider>
            </AxiosProvider>
          </LocalStoreProvider>
        </Provider>
        <ToastContainer />
      </CookiesProvider>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
