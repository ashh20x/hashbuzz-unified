import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import {HashconnectAPIProvider} from "./HashConnect";
import { NETWORK } from "./Utilities/Constant";



ReactDOM.render(
  <React.StrictMode>
     <HashconnectAPIProvider
        metaData={{
          name: "Hashbuzz",
          description: "Allow your extension to connect with hashbuzz dApp",
          icon: "https://pbs.twimg.com/profile_images/1485974523325595648/7vVwVfdC_400x400.jpg",
        }}
        network={NETWORK}
        debug={true}
      >
      <App />
    </HashconnectAPIProvider>
  </React.StrictMode>,

  document.getElementById("root")
);
