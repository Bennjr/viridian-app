import "./global.css";

import { Route, Routes } from "react-router-dom";

import Layout from "./pages/layout/layout";
import Index from "./pages/index/index";
import Library from "./pages/library/library";
import On_first_start from "./pages/overlays/overlays";
import { useState } from "react";


export default function Router() {
  const [isFirstStart, setIsFirstStart] = useState(false);

  if (!isFirstStart) {
    return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="library" element={<Library />} />
        </Route>
      </Routes>
    );
  } else {
    return (
      <Routes>
        <Route path="/" element={< On_first_start />} />
      </Routes>
    )
  }
}