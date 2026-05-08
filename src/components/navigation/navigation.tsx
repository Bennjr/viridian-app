import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "..";
import { useLanguage } from "../../context/LanguageContext";
import { getTranslations } from "../../utils/translations";
import { useState } from "react";
import { motion } from "framer-motion";

type Lang = "no" | "en" | "es" | "de" | "fr" | "ru" | "lt" | "ar";

type LinkItem = { key: string; svg: string; to: string; isFolder?: boolean };
type Category = { labelKey: string; items: LinkItem[] };

const navigation: Category[] = [
    {
        labelKey: "",
        items: [
            { key: "home", svg: "/home.svg", to: "/" },
            { key: "Stats", svg: "/stats.svg", to: "/stats" },
        ]
    },
    {
        labelKey: "Biblotek",
        items: [
            { key: "library", svg: "/folder.svg", to: "/library", isFolder: true },
            { key: "Filer", svg: "/file-text.svg", to: "/fileview" },
        ]
    },
    {
        labelKey: "Verktøy",
        items: [
            { key: "notes", svg: "/notes.svg", to: "/notes" },
            { key: "dictionary", svg: "/dict.svg", to: "/dict" },
            { key: "typing", svg: "/type.svg", to: "/typing" },
        ]
    }
];

export default function Sidebar({ onToggleSettings }: { onToggleSettings: () => void }) {
    const { language } = useLanguage();
    const sidebarTranslations = getTranslations(language as Lang, 'sidebar');
    const t = (key: string) => sidebarTranslations[key] || key;

    return (
        <aside className="bg-c-secondary backdrop-blur-md text-c-text w-56 h-full flex flex-col justify-between sticky top-0 z-50 shadow-2xl border-r border-c-divider font-sans">
            <div className="h-14 border-b border-c-divider flex items-center px-6">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-c-brand">VIRIDIAN</h2>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
                <div className="space-y-8">
                    {navigation.map((group) => (
                        <div key={group.labelKey} className="px-3">
                            <h3 className="font-bold tracking-[0.2em] text-c-text px-3 mb-2">
                                {t(group.labelKey)}
                            </h3>

                            <ul className="space-y-1">
                                {group.items.map((link) => (
                                    <li key={link.to}>
                                        <NavLink
                                            to={link.to}
                                            end={link.to === "/"}
                                            className={({ isActive }) => `
                                                group relative flex items-center px-4 py-2 rounded-xl transition-all duration-200 
                                                active:scale-[0.97] select-none gap-3
                                                ${isActive
                                                    ? "bg-c-brand/10 text-c-brand font-bold"
                                                    : "text-c-text/50 hover:bg-c-hover hover:text-c-text"}
                                            `}
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    {isActive && (
                                                        <motion.div
                                                            layoutId="sidebar-active"
                                                            className="absolute left-0 w-1 h-5 bg-c-brand rounded-r-full"
                                                        />
                                                    )}

                                                    <Icon
                                                        src={link.svg}
                                                        color={isActive ? "bg-c-brand" : "bg-current"}
                                                        size="w-4 h-4"
                                                        className="group-hover:scale-110 transition-transform opacity-80"
                                                    />
                                                    <span className="text-[13px] tracking-tight">{t(link.key)}</span>
                                                </>
                                            )}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </nav>

            {/* SYSTEM SECTION */}
            <div className="flex flex-col gap-1 p-4 border-t border-c-divider bg-c-primary/20">
                <button
                    onClick={onToggleSettings}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all text-c-text/40 hover:bg-c-hover hover:text-c-text group"
                >
                    <Icon
                        src="/settings.svg"
                        color="bg-current"
                        size="w-4 h-4"
                        className="group-hover:rotate-90 transition-transform duration-500"
                    />
                    <span className="text-[13px] font-bold uppercase tracking-widest">{t("settings")}</span>
                </button>

                <button className="flex items-center gap-3 p-3 rounded-xl transition-all text-c-text/40 hover:bg-c-hover group">
                    <div className="size-5 rounded-full bg-red-500 flex items-center justify-center text-[9px] text-white font-black group-hover:scale-110 transition-transform">C</div>
                    <span className="text-[13px] font-bold uppercase tracking-widest">Konto</span>
                </button>
            </div>
        </aside>
    );
}

export function Topbar() {
    const { language } = useLanguage();
    const location = useLocation();

    const tSidebar = (key: string) => getTranslations(language as any, 'sidebar')[key] || key;
    const tLib = (key: string) => getTranslations(language as any, 'library')[key] || key;

    const [searchQuery, setSearchQuery] = useState("");

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === "/") return tSidebar("home");
        if (path === "/library") return tSidebar("library");
        if (path === "/fileview") return tSidebar("fileview")
        if (path === "/notes") return tSidebar("notes");
        if (path === "/dict") return tSidebar("dictionary");
        if (path === "/typing") return tSidebar("typing");
        if (path === "/settings") return "Innstillinger";
        return "Viridian";
    };

    const isLibrary = location.pathname === "/library";

    return (
        <header className="h-14 flex items-center px-8 bg-c-secondary border-b border-c-divider shrink-0 z-40 select-none">
            <div className="flex-1 flex items-center justify-between">

                <h2 className="text-sm font-bold tracking-[0.2em] text-c-text/80">
                    {getPageTitle()}
                </h2>

                {isLibrary && (
                    <div className="flex items-center gap-4 animate-in fade-in duration-300">
                        <div className="flex relative group">
                            <Icon
                                src="/search.svg"
                                size="w-3.5 h-3.5"
                                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity pointer-events-none"
                            />
                            <input
                                type="text"
                                placeholder={tLib("quickSearch") || "SØK..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64 bg-c-primary border border-c-divider rounded-lg px-9 py-1.5 text-[11px] font-bold tracking-wider outline-none focus:border-c-brand/50 transition-all placeholder:text-c-text/10"
                            />
                        </div>

                        <button className="flex items-center gap-2 bg-c-opposite text-c-text_opposite font-bold px-4 py-1.5 rounded-lg text-[11px] hover:brightness-110 active:scale-95 transition-all shadow-sm">
                            <span>{tLib("addFile") || "UPLOAD"}</span>
                            <Icon src="/upload.svg" size="w-3 h-3" color="bg-c-primary" />
                        </button>
                    </div>
                )}

                {!isLibrary && (
                    <div className="text-[10px] font-bold text-c-text/20 tracking-[0.2em] uppercase">
                        Viridian System v1.0
                    </div>
                )}
            </div>
        </header>
    );
};