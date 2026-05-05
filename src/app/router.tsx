import "./global.css";

import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";

import Layout from "./pages/layout/layout";

//pages
import Index from "./pages/index/index";
import Library from "./pages/library/library";
import Settings from "./pages/settings/settings";
import Fileview from "./pages/fileview/fileview";
import Notes from "./pages/notes/notes";
import Dict from "./pages/dictionary/dict";
import Typing from "./pages/typing/typing";

//other
import Onboarding from "./pages/start/start";


export default function Router() {
  const [isFirstStart, setIsFirstStart] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("has-onboarded");
    if (saved === "true") setIsFirstStart(false);
  }, []);

  const handleSetFirstStart = (val: boolean) => {
    setIsFirstStart(val);
    if (!val) localStorage.setItem("has-onboarded", "true");
  };

  useEffect(() => {
    const unlisten = listen<string>("navigate", (event) => {
      const targetPath = event.payload;
      setIsFirstStart(false);
      navigate(targetPath);
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, [navigate]);

  return (
    <Routes>
      <Route
        path="/"
        element={isFirstStart ? <Onboarding setFirstStart={handleSetFirstStart} /> : <Layout />}
      >
        <Route index element={<Index />} />
        <Route path="library" element={<Library />} />
        <Route path="fileview" element={<Fileview />} />
        <Route path="notes" element={<Notes />} />
        <Route path="dict" element={<Dict />} />
        <Route path="typing" element={<Typing />} />
      </Route>

      <Route path="/settings" element={<Settings />} />

      <Route path="*" element={<Index />} />
    </Routes>
  );
}