import "./global.css";

import { Route, Routes } from "react-router-dom";

import Layout from "./pages/layout/layout";
import Index from "./pages/index/index";
import Library from "./pages/library/library";


export default function Router() {
  return (
    <Routes>
        <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="library" element={<Library />} />
        </Route>
    </Routes>
  );
}