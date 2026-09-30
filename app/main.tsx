import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { AppProviders } from "./providers/AppProviders";
import { browserMockProvider } from "../commerce/mock-provider/browser-mock-provider";
import "./styles/main.scss";
import "./styles/experience.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders provider={browserMockProvider}>
      <App />
    </AppProviders>
  </React.StrictMode>,
);
