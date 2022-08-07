import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
// import { HashConnectProvider } from "hashconnect/dist/provider/provider";
import HashConnectProvider from "./HashConnect/HashConnectAPIProvider";
import { NETWORK } from "./Utilities/Constant";



ReactDOM.render(
  <React.StrictMode>
     <HashConnectProvider
        metaData={{
          name: "Taskbar",
          description: "Allow your extension to connect with taskbar dApp",
          icon: "https://mytaskbar.io/images/apple-icon-114x114.png",
        }}
        netWork={NETWORK}
        debug
      >
      <App />
    </HashConnectProvider>
  </React.StrictMode>,

  document.getElementById("root")
);
