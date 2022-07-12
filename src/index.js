import React from "react";
import ReactDOM from "react-dom";
import { HashConnect } from "hashconnect";
import "./index.css";
import App from "./App";
// import HashConnectProvider from "./components/Pages/CreateCard/HashConnectAPIProvider";
const hashConnect = new HashConnect(true);
ReactDOM.render(
  <React.StrictMode>
    {/* <HashConnectProvider hashConnect={hashConnect} debug> */}
      <App />
    {/* </HashConnectProvider> */}
  </React.StrictMode>,

  document.getElementById("root")
);
