import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./AppRouter";
import { HashconnectAPIProvider } from "./Wallet";
import "./index.css";
import { CookiesProvider } from "react-cookie";
import { NETWORK } from "./Utilities/helpers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosProvider from "./APIConfig/AxiosProvider";
import { Provider } from "react-redux";
import { store } from "./Store/store";
import { StoreProvider as LocalStoreProvider } from "./Store/StoreProvider";

const theme = createTheme();

const App = () => {
  return (
    <React.StrictMode>
      <CookiesProvider>
        <Provider store={store}>
          <LocalStoreProvider>
            <AxiosProvider>
              <HashconnectAPIProvider
                metaData={{
                  name: "hashbuzz would like to connect to your wallet.",
                  description: `Please select which account you wish to connect with, hashbuzz will never store your private key information or your seed phrases. \n
                  Note - Ledger accounts are unable to be used with HashConnect at this time.`,
                  icon: "https://pbs.twimg.com/profile_images/1485974523325595648/7vVwVfdC_400x400.jpg",
                }}
                //@ts-ignore
                network={NETWORK}
                debug={true}
              >
                <ThemeProvider theme={theme}>
                  <AppRouter />
                </ThemeProvider>
              </HashconnectAPIProvider>
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
