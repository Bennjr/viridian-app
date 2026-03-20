import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from 'react-router-dom';
import Router from "./app/router";

import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <HashRouter>
        <Router />
      </HashRouter>
    </ThemeProvider>
  </React.StrictMode>
);