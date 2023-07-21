import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom";
import AppRouter from "./AppRouter";
import { HashconnectAPIProvider } from "./Wallet";
import "./index.css";
import { CookiesProvider } from "react-cookie";
import { StoreProvider } from "./Store/StoreProvider";
import { NETWORK } from "./Utilities/helpers";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme();

const App = () => {
  return (
    <React.StrictMode>
      <CookiesProvider>
        <StoreProvider>
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
              <ToastContainer />
            </ThemeProvider>
          </HashconnectAPIProvider>
        </StoreProvider>
      </CookiesProvider>
    </React.StrictMode>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
