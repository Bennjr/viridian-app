import React from "react";
import ReactDOM from "react-dom/client";
import Overlay from "./app/overlay/overlay";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <Overlay />
    </ThemeProvider>
  </React.StrictMode>
);