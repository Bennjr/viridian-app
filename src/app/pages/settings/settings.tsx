import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../../components";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";
import { GridAdapter, ListAdapter } from "./components/GridAdapter";
import Overlay from "./components/Overlay";

type Lang = "no" | "en" | "es" | "de";
const proEase = [0.4, 0, 0.2, 1];

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
    no: { title: "Innstillinger", appearance: "Utseende", general: "Generelt", language: "Språk", theme: "Tema", search: "Søk...", accessibility: "Tilgjengelighet", overlay: "Overlay" },
    en: { title: "Settings", appearance: "Appearance", general: "General", language: "Language", theme: "Theme", search: "Search...", accessibility: "Accessibility", overlay: "Overlay" },
    es: { title: "Configuración", appearance: "Apariencia", general: "General", language: "Idioma", theme: "Tema", search: "Buscar...", accessibility: "Accesibilidad", overlay: "Superposición" },
    de: { title: "Einstellungen", appearance: "Aussehen", general: "Allgemein", language: "Sprache", theme: "Thema", search: "Suchen...", accessibility: "Barrierefreiheit", overlay: "Overlay" },
};

export default function Settings({ onClose }: { onClose: () => void }) {
    const { language, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("general");
    const [selectedOption, setSelectedOption] = useState("Primary Display");

    const t = (key: string) => TRANSLATIONS[language as Lang][key] || key;

    const CATEGORIES = [
        { id: "general", label: t("general"), icon: "/gear.svg" },
        { id: "appearance", label: t("appearance"), icon: "/eye.svg" },
        { id: "accessibility", label: t("accessibility"), icon: "/user.svg" },
        { id: "overlay", label: t("overlay"), icon: "/layers.svg" },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-white/10 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                transition={{ duration: 0.25, ease: proEase }}
                className="relative w-full max-w-[1400px] h-[85vh] flex bg-c-primary rounded-[24px] shadow-2xl border border-white/5 overflow-hidden"
            >
                {/* Sidebar */}
                <aside className="w-64 bg-c-secondary/40 border-r border-white/5 flex flex-col pt-12 pb-6">
                    <div className="px-6 mb-8">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-30 mb-4 px-2">App Settings</h2>
                        <div className="space-y-1">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all group
                                    ${activeTab === cat.id
                                            ? 'bg-c-brand text-white shadow-lg shadow-c-brand/20'
                                            : 'text-c-text/50 hover:bg-white/5 hover:text-c-text'}`}
                                >
                                    <Icon src={cat.icon} size="w-4 h-4" color={activeTab === cat.id ? "bg-white" : "bg-c-text/30"} />
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto px-6">
                        <button
                            onClick={onClose}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/5 text-[12px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:bg-white/5 transition-all"
                        >
                            Esc
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col bg-c-primary">
                    <header className="px-10 pt-12 pb-6 flex justify-between items-center">
                        <h1 className="text-2xl font-black tracking-tighter text-c-text">
                            {CATEGORIES.find(c => c.id === activeTab)?.label}
                        </h1>
                        <div className="relative w-64">
                            <Icon src="/search.svg" size="w-3.5 h-3.5" className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" />
                            <input
                                type="text"
                                placeholder={t("search")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-c-secondary border border-c-divider rounded-xl py-2 pl-10 pr-4 text-[12px] outline-none focus:border-c-brand/40 transition-all"
                            />
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto custom-scrollbar px-10 pb-12">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="max-w-3xl space-y-3"
                            >
                                {activeTab === "general" && (
                                    <section className="space-y-3">
                                        <SettingsRow label="System-varslinger" description="Administrer hvordan appen varsler deg" icon="/notes.svg">
                                            <div className="size-2 rounded-full bg-c-brand shadow-[0_0_8px_rgba(var(--c-brand-rgb),0.6)]" />
                                        </SettingsRow>
                                        <SettingsRow label="Åpne på oppstart" description="Auto-start appen" icon="/notes.svg" />
                                    </section>
                                )}

                                {activeTab === "appearance" && (
                                    <section className="space-y-3">
                                        <SettingsRow
                                            label={t("language")}
                                            description="Endre applikasjonsspråk"
                                            icon="/translate.svg"
                                            expandedContent={
                                                <ListAdapter
                                                    activeId={language}
                                                    onSelect={(id: string) => setLanguage(id as any)}
                                                    options={[
                                                        { id: "no", label: "Norsk" }, { id: "en", label: "English" }, { id: "es", label: "Español" }, { id: "de", label: "Deutsch" },
                                                    ]}
                                                />
                                            }
                                        >
                                            <span className="text-[10px] font-bold text-c-brand bg-c-brand/10 px-2 py-1 rounded-lg uppercase tracking-wider">
                                                {language}
                                            </span>
                                        </SettingsRow>

                                        <SettingsRow
                                            label={t("theme")}
                                            description="Tilpass fargene i grensesnittet"
                                            icon="/star.svg"
                                            expandedContent={
                                                <GridAdapter
                                                    activeId={theme}
                                                    onSelect={(id: string) => setTheme(id)}
                                                    options={[
                                                        { id: "default", label: "System", icon: "🌓" }, { id: "dark", label: "Mørk", icon: "🌑" }, { id: "light", label: "Lys", icon: "☀️" }, { id: "contrast", label: "Kontrast", icon: "🏁" },
                                                    ]}
                                                />
                                            }
                                        >
                                            <span className="text-[10px] font-bold text-c-text/40 bg-white/5 px-2 py-1 rounded-lg uppercase tracking-wider">
                                                {theme}
                                            </span>
                                        </SettingsRow>
                                    </section>
                                )}

                                {activeTab === "accessibility" && (
                                    <section className="space-y-3">
                                        <SettingsRow label="Høy Kontrast" description="Forbedrer lesbarhet" icon="/eye.svg" />
                                        <SettingsRow label="Skriftstørrelse" description="Juster tekststørrelsen i hele appen" icon="/text.svg" />
                                    </section>
                                )}

                                {activeTab === "overlay" && (
                                    <section className="space-y-6">
                                        <div className="bg-c-secondary/30 border border-white/5 rounded-3xl p-4">
                                            <h3 className="text-[11px] font-black uppercase tracking-widest opacity-30 mb-6 px-2">
                                                Overlay Preview & Target
                                            </h3>
                                            <DisplaySelection
                                                activeId={selectedOption}
                                                onSelect={(label) => setSelectedOption(label)}
                                                display={<Overlay previewLabel={selectedOption} />}
                                                options={[
                                                    { id: "1", label: "Primary Display", icon: "🖥️" },
                                                    { id: "2", label: "Secondary Display", icon: "📺" },
                                                    { id: "3", label: "Drawing Tablet", icon: "✍️" }
                                                ]}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <SettingsRow label="Aktiver Overlay" description="Vis verktøy over andre vinduer" icon="/layers.svg" />
                                            <SettingsRow label="Gjennomsiktighet" description="Juster overlay-synlighet" icon="/eye.svg">
                                                <div className="w-24 h-1 bg-white/10 rounded-full" />
                                            </SettingsRow>
                                        </div>
                                    </section>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function SettingsRow({ label, description, icon, children, expandedContent }: any) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasExpansion = !!expandedContent;

    return (
        <div className={`flex flex-col rounded-2xl border transition-all duration-300
            ${isExpanded
                ? 'bg-white/[0.05] border-white/10 shadow-xl shadow-black/20'
                : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'}`}
        >
            {/* Header */}
            <div
                onClick={() => hasExpansion && setIsExpanded(!isExpanded)}
                className={`flex items-center justify-between p-4 ${hasExpansion ? 'cursor-pointer group' : ''}`}
            >
                <div className="flex items-center gap-4">
                    <div className={`size-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center transition-colors 
                        ${isExpanded ? 'border-c-brand/50 bg-c-brand/5' : 'group-hover:border-c-brand/40'}`}>
                        <Icon
                            src={icon || "/folder.svg"}
                            size="w-4 h-4"
                            className={isExpanded ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}
                        />
                    </div>
                    <div>
                        <p className="text-[13px] font-bold text-c-text leading-tight">{label}</p>
                        {description && (
                            <p className="text-[10px] font-medium text-c-text/30 uppercase tracking-tight mt-0.5">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Hide children badges when expanded to keep it clean */}
                    {!isExpanded && children}

                    {hasExpansion && (
                        <Icon
                            src="/chevron-down.svg"
                            className={`transition-transform duration-300 opacity-20 group-hover:opacity-60 
                                ${isExpanded ? 'rotate-180 opacity-100' : 'rotate-0'}`}
                            size="w-3 h-3"
                        />
                    )}
                </div>
            </div>

            {/* Accordion Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: proEase }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 pt-2 border-t border-white/5 mx-4 mt-1">
                            <div className="py-2">
                                {expandedContent}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function DisplaySelection({ display, options, activeId, onSelect }: any) {
    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="relative w-full lg:w-[400px] aspect-video bg-black/40 rounded-3xl border border-white/5 overflow-hidden shadow-inner p-4 flex items-center justify-center">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', size: '20px 20px', backgroundSize: '20px 20px' }} />
                <div className="relative w-[320px] h-[200px] scale-[0.8] origin-center shadow-2xl">
                    {display}
                </div>
            </div>

            <div className="flex-1 w-full space-y-2">
                <p className="text-[10px] font-bold text-c-text/20 uppercase tracking-widest mb-3 ml-2">Select Target Window</p>
                {options.map((opt: any) => (
                    <button
                        key={opt.id}
                        onClick={() => onSelect(opt.label)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border
                            ${activeId === opt.label
                                ? 'bg-c-brand/10 border-c-brand/50 text-white'
                                : 'bg-white/5 border-transparent text-c-text/40 hover:bg-white/10'}`}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-lg">{opt.icon}</span>
                            <span className="text-sm font-bold">{opt.label}</span>
                        </div>
                        {activeId === opt.label && (
                            <div className="size-2 rounded-full bg-c-brand shadow-[0_0_8px_var(--c-brand)]" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}