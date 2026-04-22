import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from 'react-router-dom';
import Router from "./app/router";

import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <HashRouter>
          <Router />
        </HashRouter>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);