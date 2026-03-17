import "./global.css";

import { Route, Routes } from "react-router-dom";
import { useState } from "react";

import Layout from "./pages/layout/layout";

//pages
import Index from "./pages/index/index";
import Library from "./pages/library/library";
import Settings from "./pages/settings/settings";
import Log from "./pages/log/log";

//other
import Onboarding from "./pages/overlays/overlays";


export default function Router() {
  const [isFirstStart, setIsFirstStart] = useState(true);

  if (!isFirstStart) {
    return (
      <Routes>
        <Route path="/settings" element={<Settings />} /> {/* Make settings its own page outside outlet */}

        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="library" element={<Library />} />
          <Route path="log" element={<Log />} />
        </Route>
      </Routes>
    );
  } else {
    return (
      <Routes>
        <Route path="/" element={< Onboarding setFirstStart={setIsFirstStart} />} />
      </Routes>
    )
  }
}