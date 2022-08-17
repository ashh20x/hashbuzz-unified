import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { HashConnectAPIProvider } from "./HashConnect";
import { NETWORK } from "./Utilities/Constant";



ReactDOM.render(
  <React.StrictMode>
     <HashConnectAPIProvider
        metaData={{
          name: "Taskbar",
          description: "Allow your extension to connect with taskbar dApp",
          icon: "https://mytaskbar.io/images/apple-icon-114x114.png",
        }}
        netWork={NETWORK}
        debug={true}
      >
      <App />
    </HashConnectAPIProvider>
  </React.StrictMode>,

  document.getElementById("root")
);
