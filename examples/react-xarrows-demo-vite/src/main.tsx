import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import BundleApp from "./BundleApp";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
    {/*<BundleApp />*/}
  </React.StrictMode>
);
