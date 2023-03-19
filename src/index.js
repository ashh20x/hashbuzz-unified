import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { HashconnectAPIProvider } from "./HashConnect";
import "./index.css";
import { StoreProvider } from "./Providers/StoreProvider";
import { NETWORK } from "./Utilities/Constant";

const theme = createTheme();

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <HashconnectAPIProvider
        metaData={{
          name: "hashbuzz would like to connect to your wallet.",
          description: `Please select which account you wish to connect with, hashbuzz will never store your private key information or your seed phrases. \n
        Note - Ledger accounts are unable to be used with HashConnect at this time.`,
          icon: "https://pbs.twimg.com/profile_images/1485974523325595648/7vVwVfdC_400x400.jpg",
        }}
        network={NETWORK}
        debug={true}
      >
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </HashconnectAPIProvider>
    </StoreProvider>
  </React.StrictMode>,

  document.getElementById("root")
);
