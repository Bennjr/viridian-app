import { Route, Routes } from "react-router-dom";

import App from "./pages/main/app";

export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<App />} />
        </Routes>
    );
}