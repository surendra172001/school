import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import AppRoutes from "./AppRoutes";

ReactDOM.render(
  <React.StrictMode>
    <AppRoutes></AppRoutes>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
