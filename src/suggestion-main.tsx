import React from "react";
import ReactDOM from "react-dom/client";
import Suggestion from "./app/suggestion/suggestion";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider>
            <Suggestion />
        </ThemeProvider>
    </React.StrictMode>
);