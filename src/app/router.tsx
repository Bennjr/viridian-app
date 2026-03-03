import { Route, Routes } from "react-router-dom";

import App from "./pages/main/app";
import Library from "./pages/library/library";

export default function Router() {
    return (
        <Routes>
            {/* The App component renders the sidebar/header and an <Outlet /> */}
            <Route path="/" element={<App />}>
                {/* index route could show a welcome component or reuse App's default */}
                <Route index element={<div className="p-8 text-white">Welcome to the main page</div>} />
                <Route path="library" element={<Library />} />
                {/* add more child routes here as you need additional pages */}
            </Route>
        </Routes>
    );
}