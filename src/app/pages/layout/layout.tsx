import { Outlet } from "react-router-dom";
import { Sidebar, Bottombar, Topbar } from "../../../components";
import "../../global.css";
import { useEffect, useState } from "react";
import Settings from "../settings/settings"
import { AnimatePresence, motion } from "framer-motion";
import { AddOverlay } from "../../../components";
import { useLanguage } from "../../../context/LanguageContext";
import { getTranslations } from "../../../utils/translations";
import { show } from "@tauri-apps/api/app";

export default function Layout() {
    const [fontSize, setFontSize] = useState("medium");
    const [showSettings, setShowSettings] = useState(false)
    const [showAddOverlay, setShowAddOverlay] = useState(false)

    const { language } = useLanguage();
    const t = (key: string) => getTranslations(language as any, 'library')[key] || key;

    useEffect(() => {
        const savedSize = localStorage.getItem("fontSize") || "medium";
        setFontSize(savedSize);
    }, []);

    const fontConfig: Record<string, string> = {
        small: `
            [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm
            [&_p]:text-[11px] [&_span]:text-[10px] [&_button]:text-[10px]
        `,
        medium: `
            [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base
            [&_p]:text-[13px] [&_span]:text-[12px] [&_button]:text-[12px]
        `,
        large: `
            [&_h1]:text-3xl [&_h2]:text-xl [&_h3]:text-lg
            [&_p]:text-base [&_span]:text-sm [&_button]:text-sm
        `
    };

    const toggleSettings = () => setShowSettings(!showSettings);
    const toggleAddOverlay = () => setShowAddOverlay(!showAddOverlay);

    return (
        <>
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="fixed inset-0 z-[100]"
                    >
                        <Settings onClose={toggleSettings} />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showAddOverlay && (
                    <AddOverlay
                        isOpen={showAddOverlay}
                        onClose={toggleAddOverlay}
                        // 3. Pass the 't' prop here
                        t={t}
                        type={window.location.pathname.includes('library') ? 'book' : 'file'}
                    />
                )}
            </AnimatePresence>

            <main className={`
            w-screen h-screen flex flex-col overflow-hidden 
            bg-c-primary text-c-text select-none
            ${fontConfig[fontSize] || fontConfig.medium}
        `}>
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar onToggleSettings={toggleSettings} />

                    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                        <Topbar toggleAddOverlay={toggleAddOverlay} />

                        <section className="flex-1 overflow-hidden relative">
                            <Outlet />
                        </section>
                    </div>
                </div>

                <Bottombar />
            </main>
        </>
    );
}