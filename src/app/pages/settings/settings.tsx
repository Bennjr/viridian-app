import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../../components";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";
import { ModalFrame } from "./components/ModalFrame";
import { GridAdapter, ListAdapter } from "./components/GridAdapter";

type Lang = "no" | "en" | "es" | "de";

const proEase = [0.4, 0, 0.2, 1];

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
    no: { title: "Innstillinger", appearance: "Utseende", general: "Generelt", language: "Språk", theme: "Tema", search: "Søk i innstillinger..." },
    en: { title: "Settings", appearance: "Appearance", general: "General", language: "Language", theme: "Theme", search: "Search settings..." },
    es: { title: "Configuración", appearance: "Apariencia", general: "General", language: "Idioma", theme: "Tema", search: "Buscar..." },
    de: { title: "Einstellungen", appearance: "Aussehen", general: "Allgemein", language: "Sprache", theme: "Thema", search: "Suchen..." },
};

export default function Settings({ onClose }: { onClose: () => void }) {
    const { language, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();
    const [modalConfig, setModalConfig] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const t = (key: string) => TRANSLATIONS[language as Lang][key] || key;

    const openLanguage = () => setModalConfig({
        title: t("language"),
        subtitle: "Velg ditt foretrukne språk for grensesnittet",
        type: "LIST",
        activeId: language,
        onSelect: (id: string) => { setLanguage(id as any); setModalConfig(null); },
        options: [
            { id: "no", label: "Norsk" },
            { id: "en", label: "English" },
            { id: "es", label: "Español" },
            { id: "de", label: "Deutsch" },
        ]
    });

    const openTheme = () => setModalConfig({
        title: t("theme"),
        subtitle: "Velg fargetema for applikasjonen",
        type: "GRID",
        activeId: theme,
        onSelect: (id: string) => { setTheme(id); setModalConfig(null); },
        options: [
            { id: "default", label: "System", icon: "🌓" },
            { id: "dark", label: "Mørk", icon: "🌑" },
            { id: "light", label: "Lys", icon: "☀️" },
            { id: "contrast", label: "Kontrast", icon: "🏁" },
        ]
    });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center sm:px-4 md:px-6 lg:px-8 2xl:px-64">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: proEase }}
                className="relative h-full w-full max-h-[90vh] flex flex-col bg-c-primary rounded-[32px] shadow-2xl border border-white/5 overflow-hidden font-sans"
            >
                <div className="h-full w-full flex flex-col bg-c-primary overflow-hidden font-sans">
                    <header className="px-8 pt-10 pb-6 max-w-4xl w-full mx-auto shrink-0">
                        <div className="flex items-center gap-4 mb-6">
                            {/* BACK BUTTON */}
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-c-secondary rounded-xl transition-all border border-c-divider group"
                            >
                                <Icon src="/chevron-down.svg" className="rotate-90 opacity-40 group-hover:opacity-100" />
                            </button>
                            <h2 className="text-xl font-black uppercase tracking-tighter text-c-text">
                                Innstillinger
                            </h2>
                        </div>

                        <div className="relative group">
                            <Icon src="/search.svg" size="w-4 h-4" className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity" />
                            <input
                                type="text"
                                placeholder={t("search")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-c-secondary border border-c-divider rounded-xl py-2.5 pl-11 pr-4 text-[12px] font-medium outline-none focus:border-c-brand/50 transition-all placeholder:text-c-text/10"
                            />
                        </div>
                    </header>

                    {/* 2. SCROLLABLE CONTENT */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <main className="max-w-4xl mx-auto p-8 pt-0 space-y-10">

                            <section className="space-y-3">
                                <h3 className="text-[9px] font-black tracking-[0.3em] opacity-20 uppercase ml-4">{t("appearance")}</h3>
                                <div className="bg-c-secondary/30 border border-white/5 rounded-[24px] p-2">
                                    <SettingsRow
                                        label={t("language")}
                                        description={language.toUpperCase()}
                                        icon="/translate.svg"
                                        onClick={openLanguage}
                                    />
                                    <div className="h-[1px] bg-c-divider mx-4 opacity-50" />
                                    <SettingsRow
                                        label={t("theme")}
                                        description={theme.toUpperCase()}
                                        icon="/star.svg"
                                        onClick={openTheme}
                                    />
                                </div>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-[9px] font-black tracking-[0.3em] opacity-20 uppercase ml-4">{t("general")}</h3>
                                <div className="bg-c-secondary/30 border border-white/5 rounded-[24px] p-2">
                                    <SettingsRow label="System-varslinger" description="Administrer hvordan appen varsler deg" icon="/notes.svg">
                                        <div className="size-2 rounded-full bg-c-brand" />
                                    </SettingsRow>
                                </div>
                            </section>
                        </main>
                    </div>

                    {/* 3. MODAL ADAPTER SYSTEM */}
                    <ModalFrame
                        isOpen={!!modalConfig}
                        onClose={() => setModalConfig(null)}
                        title={modalConfig?.title}
                        subtitle={modalConfig?.subtitle}
                    >
                        {modalConfig?.type === "GRID" && <GridAdapter {...modalConfig} />}
                        {modalConfig?.type === "LIST" && <ListAdapter {...modalConfig} />}
                        {modalConfig?.type === "CUSTOM" && modalConfig.content}
                    </ModalFrame>
                </div>
            </motion.div>
        </div>
    );
}

function SettingsRow({ label, description, icon, onClick, children }: any) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center justify-between p-3 rounded-xl transition-all border border-transparent 
                ${onClick ? 'cursor-pointer hover:bg-c-hover group' : ''}`}
        >
            <div className="flex items-center gap-4">
                <div className="size-9 bg-c-primary border border-c-divider rounded-lg flex items-center justify-center transition-colors group-hover:border-c-brand/30">
                    <Icon src={icon || "/folder.svg"} size="w-4 h-4" className="opacity-30 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                    <p className="text-[12px] font-bold text-c-text/80">{label}</p>
                    {description && <p className="text-[9px] font-bold text-c-text/20 uppercase tracking-tighter">{description}</p>}
                </div>
            </div>

            <div className="flex items-center gap-3">
                {children}
                {onClick && <Icon src="/chevron-down.svg" className="-rotate-90 opacity-10 group-hover:opacity-40 transition-all" size="w-3.5 h-3.5" />}
            </div>
        </div>
    );
}