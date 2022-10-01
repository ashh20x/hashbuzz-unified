import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { HashconnectAPIProvider } from "./HashConnect";
import { NETWORK } from "./Utilities/Constant";
import { StoreProvider } from "./Providers/StoreProvider";

ReactDOM.render(
  <React.StrictMode>
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
      <StoreProvider>
        <App />
      </StoreProvider>
    </HashconnectAPIProvider>
  </React.StrictMode>,

  document.getElementById("root")
);
