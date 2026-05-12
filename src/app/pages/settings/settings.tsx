import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../../components";
import { useTranslation, proEase } from "../../../utils/uiHelpers";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";
import { GridAdapter, ListAdapter } from "./components/GridAdapter";
import Overlay from "./components/Overlay";
import { ColorPicker } from 'primereact/colorpicker';

const OVERLAY_FUNCS = [
    { id: 'settings', icon: "/settings.svg", title: "Instillinger", action: "settings" },
    { id: 'speak', icon: '/audio.svg', title: 'Les opp tekst', action: 'speak' },
    { id: 'chat', icon: '/star.svg', title: 'AI Assistent', action: 'toggleChat' },
    { id: 'translate', icon: '/translate.svg', title: 'Oversett', action: 'translate' },
    { id: 'hide', icon: '/eye.svg', title: 'Skjul vindu', action: 'toggleEye' },
    { id: 'resize', icon: '/chevron-down.svg', title: 'Vis/Skjul felt', action: 'windowSizeToggle', isChevron: true },
];

export default function Settings({ onClose }: { onClose?: () => void }) {
    const { language, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("general");

    const [selectedOverlayOptions, setOverlaySelectedOptions] = useState<string[]>([]);
    const [overlayColor, setOverlayColor] = useState("#4ade80");

    const t = useTranslation("settings");

    const CATEGORIES = [
        { id: "general", label: t("general"), icon: "/gear.svg" },
        { id: "appearance", label: t("appearance"), icon: "/eye.svg" },
        { id: "accessibility", label: t("accessibility"), icon: "/user.svg" },
        { id: "overlay", label: t("overlay"), icon: "/layers.svg" },
    ];

    const handleOverlayToggle = (label: string) => {
        setOverlaySelectedOptions(prev =>
            prev.includes(label)
                ? prev.filter(item => item !== label)
                : [...prev, label]
        );
    };

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
                                            content={
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
                                            content={
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
                                        <SettingsRow label="Fargemetning" description="Juster metning på farger" icon="/text.svg" />
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
                                                activeIds={selectedOverlayOptions}
                                                onSelect={handleOverlayToggle}
                                                display={<Overlay previewLabel={selectedOverlayOptions[0]} activeIds={selectedOverlayOptions} />}
                                                options={OVERLAY_FUNCS.map(func => ({
                                                    id: func.id,
                                                    label: func.title,
                                                    icon: <Icon src={func.icon} size="w-4 h-4" color="bg-c-text/30" />,
                                                }))}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <SettingsRow
                                                label="Overlay Farge"
                                                description="Velg primærfarge for overlay-vinduet"
                                                icon="/star.svg"
                                                content={
                                                    <OverlayCustomization setColor={setOverlayColor} color={overlayColor} />
                                                }
                                            />
                                            <SettingsRow label="Aktiver Overlay" description="Vis verktøy over andre vinduer" icon="/layers.svg" />
                                            <SettingsRow label="Gjennomsiktighet" description="Juster overlay-synlighet" icon="/eye.svg">
                                                <div className="w-24 h-1 bg-white/10 rounded-full" />
                                            </SettingsRow>
                                            <SettingsRow
                                                label="Tastatursnarveier"
                                                description="Tilpass hurtigtaster for raskere tilgang"
                                                icon="/keyboard.svg"
                                                content={<KeybindManager />}
                                            />
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

function SettingsRow({ label, description, icon, children, content }: any) {
    return (
        <div className="flex flex-col rounded-2xl border bg-white/[0.02] border-white/5 overflow-hidden transition-all">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                    <div className="size-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center">
                        <Icon
                            src={icon || "/folder.svg"}
                            size="w-4 h-4"
                            className="opacity-40"
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
                    {children}
                </div>
            </div>

            {content && (
                <div className="px-4 pb-5 pt-2 border-t border-white/5 mx-4 mt-1">
                    <div className="py-2">
                        {content}
                    </div>
                </div>
            )}
        </div>
    );
}

function DisplaySelection({ display, options, activeIds, onSelect }: any) {
    return (
        <div className="flex flex-col gap-8">
            <div className="relative w-full aspect-video bg-black/40 rounded-3xl border border-white/5 overflow-hidden p-4 flex items-center justify-center">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="relative w-[320px] h-[200px] scale-[0.8] origin-center">
                    {display}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <p className="text-[10px] font-bold text-c-text/20 uppercase tracking-widest ml-2">
                    Select Quick Functions (Multiple)
                </p>

                <div className="flex flex-row flex-wrap gap-3">
                    {options.map((opt: any) => {
                        const isActive = Array.isArray(activeIds)
                            ? activeIds.includes(opt.label)
                            : activeIds === opt.label;

                        return (
                            <button
                                key={opt.id}
                                onClick={() => onSelect(opt.label)}
                                className={`
                                    relative flex flex-col items-center justify-center gap-3 
                                    w-28 aspect-square rounded-2xl transition-all border
                                    ${isActive
                                        ? 'bg-c-brand/10 border-c-brand text-white'
                                        : 'bg-white/5 border-white/5 text-c-text/40 hover:bg-white/10 hover:border-white/10'
                                    }
                                `}
                            >
                                {isActive && (
                                    <div className="absolute top-2 right-2 size-1.5 rounded-full bg-c-brand shadow-[0_0_8px_var(--c-brand)]" />
                                )}

                                <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'opacity-50'}`}>
                                    {opt.icon}
                                </div>

                                <span className={`text-[10px] font-bold text-center px-2 leading-tight ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                                    {opt.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function OverlayCustomization({ setColor, color }: { setColor: any; color: string }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFileName(file.name);
            // Handle your upload logic here (e.g., invoke tauri command)
            console.log("Selected file:", file);
        }
    };

    return (
        <div className="w-full flex flex-row justify-between items-start gap-8">
            <div className="flex flex-col items-start flex-1">
                <p className="text-[10px] font-bold text-c-text/20 uppercase tracking-widest mb-2 ml-1">
                    Custom Background
                </p>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-[100px] bg-white/[0.03] border border-white/5 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 hover:border-c-brand/40 transition-all group"
                >
                    <Icon
                        src={selectedFileName ? "/file.svg" : "/upload.svg"}
                        size="w-5 h-5"
                        className={selectedFileName ? "text-c-brand opacity-100" : "opacity-20"}
                    />
                    <span className="text-[10px] font-bold text-c-text/40 truncate max-w-[150px] px-2">
                        {selectedFileName || "Upload Image"}
                    </span>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </button>
                {selectedFileName && (
                    <button
                        onClick={() => setSelectedFileName(null)}
                        className="mt-2 text-[9px] font-bold text-red-500/40 hover:text-red-500 uppercase tracking-tighter"
                    >
                        Remove file
                    </button>
                )}
            </div>

            {/* Right Side: Color Picker */}
            <div className="flex flex-col items-end">
                <p className="text-[10px] font-bold text-c-text/20 uppercase tracking-widest mb-2 mr-2">
                    Primary Color
                </p>
                <div className="bg-white/[0.02] p-2 rounded-xl border border-white/5">
                    <ColorPicker value={color} onChange={(e) => setColor(e.value)} inline />
                </div>
            </div>
        </div>
    );
}

interface Keybind {
    id: string;
    label: string;
    bind: string;
}

const MOCK_KEYBINDS: Keybind[] = [
    { id: "1", label: "Åpne Overlay", bind: "Alt + Space" },
    { id: "2", label: "Start Diktering", bind: "Ctrl + Shift + D" },
    { id: "3", label: "Ta Skjermbilde", bind: "Cmd + P" },
    { id: "4", label: "Skjul alle vinduer", bind: "Shift + Esc" },
];


function KeybindManager() {
    const [keybinds, setKeybinds] = useState(MOCK_KEYBINDS);
    const [recordingId, setRecordingId] = useState<string | null>(null);

    // Listen for key presses when in recording mode
    useEffect(() => {
        if (!recordingId) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();

            const keys = [];
            if (e.ctrlKey) keys.push("Ctrl");
            if (e.shiftKey) keys.push("Shift");
            if (e.altKey) keys.push("Alt");
            if (e.metaKey) keys.push("Cmd");

            // Add the actual key (avoid adding just the modifiers)
            if (!["Control", "Shift", "Alt", "Meta"].includes(e.key)) {
                keys.push(e.key.toUpperCase());
            }

            if (keys.length > 0) {
                const newBind = keys.join(" + ");
                setKeybinds(prev => prev.map(kb =>
                    kb.id === recordingId ? { ...kb, bind: newBind } : kb
                ));
                setRecordingId(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [recordingId]);

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center px-2 mb-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-20">Funksjon</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-20">Snarvei</p>
            </div>

            {keybinds.map((kb) => (
                <div
                    key={kb.id}
                    className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl border border-white/5 hover:bg-white/[0.04] transition-all group"
                >
                    <span className="text-[12px] font-bold text-c-text/80 group-hover:text-c-text transition-colors">
                        {kb.label}
                    </span>

                    <button
                        onClick={() => setRecordingId(kb.id)}
                        className={`
                            relative min-w-[100px] px-3 py-1.5 rounded-lg border text-[11px] font-black transition-all
                            ${recordingId === kb.id
                                ? 'bg-c-brand border-c-brand text-white animate-pulse shadow-[0_0_15px_rgba(var(--c-brand-rgb),0.4)]'
                                : 'bg-white/5 border-white/10 text-c-text/40 hover:border-white/20 hover:text-c-text'}
                        `}
                    >
                        {recordingId === kb.id ? "Trykk en tast..." : kb.bind}
                    </button>
                </div>
            ))}
        </div>
    );
}