import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Icon } from "../index"
import { invoke } from "@tauri-apps/api/core";
import { useLanguage } from "../../context/LanguageContext";

type Lang = "no" | "en" | "es" | "de";

interface SettingItemProps {
    label: string;
    children: React.ReactNode;
}

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
    no: {
        system: "System",
        light: "Lys",
        dark: "Mørk",
        contrast: "Kontrast",
        chooseFontSize: "Velg tekststørrelse",
        chooseFontDesc: "Velg den størrelsen som er mest behagelig å lese.",
        small: "Liten",
        medium: "Medium",
        large: "Stor",
        settings: "Instillinger",
        speak: "Les opp tekst",
        chat: "AI Assistent",
        translate: "Oversett",
        hide: "Skjul vindu",
        resize: "Vis/Skjul felt",
    },
    en: {
        system: "System",
        light: "Light",
        dark: "Dark",
        contrast: "Contrast",
        chooseFontSize: "Choose Font Size",
        chooseFontDesc: "Select the size that is most comfortable to read.",
        small: "Small",
        medium: "Medium",
        large: "Large",
        settings: "Settings",
        speak: "Read Text Aloud",
        chat: "AI Assistant",
        translate: "Translate",
        hide: "Hide Window",
        resize: "Show/Hide Field",
    },
    es: {
        system: "Sistema",
        light: "Claro",
        dark: "Oscuro",
        contrast: "Contraste",
        chooseFontSize: "Elegir Tamaño de Fuente",
        chooseFontDesc: "Selecciona el tamaño que sea más cómodo de leer.",
        small: "Pequeño",
        medium: "Mediano",
        large: "Grande",
        settings: "Configuración",
        speak: "Leer en Voz Alta",
        chat: "Asistente de IA",
        translate: "Traducir",
        hide: "Ocultar Ventana",
        resize: "Mostrar/Ocultar Campo",
    },
    de: {
        system: "System",
        light: "Hell",
        dark: "Dunkel",
        contrast: "Kontrast",
        chooseFontSize: "Schriftgröße Wählen",
        chooseFontDesc: "Wählen Sie die Größe, die am angenehmsten zu lesen ist.",
        small: "Klein",
        medium: "Mittel",
        large: "Groß",
        settings: "Einstellungen",
        speak: "Text Vorlesen",
        chat: "KI-Assistent",
        translate: "Übersetzen",
        hide: "Fenster Ausblenden",
        resize: "Feld Anzeigen/Ausblenden",
    },
};

// Inside settingitems.tsx
export function DoubleSelect({ label, children }: SettingItemProps) {
    return (
        <div className="flex items-center justify-between group">
            <div className="text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                {label}
            </div>
            <div className="flex border border-white/10 rounded-xl overflow-hidden divide-x divide-white/10 shadow-lg">
                {children}
            </div>
        </div>
    );
}

export function Slider({ label }: { label: string, range?: number }) {
    const [val, setVal] = useState("50");
    return (
        <div className="flex items-center justify-between group py-2">
            <div className="text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                {label}
            </div>
            <div className="flex items-center gap-4 w-1/2">
                <span className="text-[10px] font-mono opacity-40 w-8">{val}%</span>
                <input
                    type="range"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    className="flex-1 accent-c-brand cursor-pointer h-1.5 bg-white/10 rounded-full appearance-none"
                />
            </div>
        </div>
    );
}

interface ToggleProps {
    label: string;
    enabled: boolean;
    onChange: (state: boolean) => void;
}

export function Toggle({ label, enabled, onChange }: ToggleProps) {
    return (
        <label className="flex items-center justify-between group cursor-pointer select-none py-2">
            <span className="text-sm font-medium text-c-text opacity-80 group-hover:opacity-100 transition-opacity">
                {label}
            </span>

            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={enabled}
                    onChange={(e) => onChange(e.target.checked)}
                />

                <div className="w-11 h-6 bg-c-tertiery rounded-full peer peer-checked:bg-c-brand transition-colors duration-200 border border-white/5 shadow-inner" />

                <div className="absolute left-[4px] top-[4px] bg-white w-4 h-4 rounded-full transition-transform duration-200 peer-checked:translate-x-5 shadow-md" />
            </div>
        </label>
    );
}

export function ThemeSelector() {
    const { theme, setTheme } = useTheme();
    const { language } = useLanguage();
    const t = (key: string) => TRANSLATIONS[language as Lang][key] || key;

    const THEMES = [
        { id: 'default', label: t("system") },
        { id: 'light', label: t("light") },
        { id: 'dark', label: t("dark") },
        { id: 'contrast', label: t("contrast") },
    ];

    return (
        <ul className="grid grid-cols-4 gap-3 select-none p-6 border border-c-divider rounded-lg">
            {THEMES.map((t) => {
                const isActive = theme === t.id;

                return (
                    <li key={t.id}>
                        <button
                            onClick={() => setTheme(t.id)}
                            className="group w-full flex flex-col gap-2 transition-all"
                        >
                            <div
                                data-theme={t.id !== 'default' ? t.id : undefined}
                                className={`
                                    relative aspect-[16/10] w-full rounded-lg border-2 overflow-hidden bg-c-primary transition-all
                                    ${isActive ? 'border-c-brand ring-2 ring-c-brand/20' : 'border-c-dividers hover:border-c-text/30'}
                                `}
                                style={t.id === 'default' ? {
                                    background: 'linear-gradient(to top right, #2a2b2a 50%, #f5f5f5 50%)'
                                } : {}}
                            >
                                <div className={`
                                    absolute left-0 top-0 bottom-0 w-1/3 border-r transition-colors
                                    ${t.id === 'default'
                                        ? 'bg-black/10 border-black/10 backdrop-blur-[1px]'
                                        : 'bg-c-secondary_bg border-c-dividers'}
                                `}>
                                    <div className="mt-2 ml-1 h-1 w-2/3 rounded-full bg-c-brand/40" />
                                    <div className="mt-1 ml-1 h-1 w-1/2 rounded-full bg-c-text/20" />
                                </div>

                                <div className="absolute left-[33%] right-0 top-0 bottom-0 p-2 flex flex-col gap-1">
                                    <div className={`h-1.5 w-full rounded-full ${t.id === 'default' ? 'bg-black/20' : 'bg-c-text/10'}`} />
                                    <div className={`h-1.5 w-2/3 rounded-full ${t.id === 'default' ? 'bg-black/20' : 'bg-c-text/10'}`} />
                                    <div className="mt-auto h-2 w-full rounded bg-c-brand" />
                                </div>

                                {isActive && (
                                    <div className="absolute inset-0 bg-c-brand/10 flex items-center justify-center backdrop-blur-[0.5px]">
                                        <div className="bg-c-brand text-white rounded-full p-0.5 shadow-lg">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isActive ? 'text-c-brand' : 'opacity-40'}`}>
                                {t.label}
                            </span>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}

export function FontSize() {
    const [fontSize, setFontSize] = useState(() => {
        return localStorage.getItem("fontSize") || "medium";
    });

    const { language } = useLanguage();
    const t = (key: string) => TRANSLATIONS[language as Lang][key] || key;

    useEffect(() => {
        localStorage.setItem("fontSize", fontSize);
    }, [fontSize]);

    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">{t("chooseFontSize")}</h2>
                <p className="opacity-50">{t("chooseFontDesc")}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {[
                    { id: 'small', label: t("small"), size: 'text-sm' },
                    { id: 'medium', label: t("medium"), size: 'text-base' },
                    { id: 'large', label: t("large"), size: 'text-xl' }
                ].map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => setFontSize(opt.id)}
                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4
                                                            ${fontSize === opt.id ? 'border-c-brand bg-c-brand/5' : 'border-white/5 bg-c-secondary hover:border-white/10'}
                                                        `}
                    >
                        <span className={`${opt.size} font-bold text-c-text`}>Aa</span>
                        <span className="text-xs font-medium opacity-50">{opt.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export function ToolbarDragDrop() {
    const [toolbarActions, setToolbarActions] = useState<string[]>(() => {
        const stored = localStorage.getItem("toolbarActions");
        return stored ? JSON.parse(stored) : [];
    });

    const { language } = useLanguage();
    const t = (key: string) => TRANSLATIONS[language as Lang][key] || key;

    useEffect(() => {
        localStorage.setItem("toolbarActions", JSON.stringify(toolbarActions));
    }, [toolbarActions]);

    const toggleToolbarAction = (action: string) => {
        setToolbarActions((prev) => {
            if (prev.includes(action)) {
                return prev.filter((a) => a !== action);
            } else {
                return [...prev, action];
            }
        });
        invoke("trigger_w_len", { len: localStorage.getItem("toolbarActions") ? JSON.parse(localStorage.getItem("toolbarActions") || "[]").length : 0 })
    };

    const TOOLBAR_ACTIONS = [
        { id: 'settings', icon: "/settings.svg", title: t("settings"), action: "settings" },
        { id: 'speak', icon: '/audio.svg', title: t("speak"), action: 'speak' },
        { id: 'chat', icon: '/star.svg', title: t("chat"), action: 'toggleChat' },
        { id: 'translate', icon: '/translate.svg', title: t("translate"), action: 'translate' },
        { id: 'hide', icon: '/eye.svg', title: t("hide"), action: 'toggleEye' },
        { id: 'resize', icon: '/chevron-down.svg', title: t("resize"), action: 'windowSizeToggle', isChevron: true },
    ];

    return (
        <div className="z-10 flex items-center gap-2     h-[75px] pr-2 bg-c-secondary/80 backdrop-blur-lg">
            {TOOLBAR_ACTIONS.map((item) => {
                return (
                    <button
                        key={item.id}
                        title={item.title}
                        className={`group relative bg-c-secondary flex items-center justify-center size-12 rounded-2xl non-draggable
                            transition-all duration-200 active:scale-90`}
                    >
                        <Icon
                            src={item.icon}
                        />
                    </button>
                );
            })}
        </div>
    )
}

import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    maxWidth?: string;
}

const proEase = [0.4, 0, 0.2, 1];

export function SettingsModal({ isOpen, onClose, title, description, children, maxWidth = "max-w-2xl" }: ModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Surface */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: proEase }}
                        className={`relative w-full ${maxWidth} bg-c-secondary border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col`}
                    >
                        <header className="p-8 pb-4 flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-c-text uppercase">{title}</h2>
                                {description && <p className="text-sm text-c-text/40 mt-1">{description}</p>}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors opacity-40 hover:opacity-100"
                            >
                                <Icon src="/eye.svg" size="w-5 h-5" /> {/* Use a close icon if you have one */}
                            </button>
                        </header>

                        <div className="p-8 pt-0 overflow-y-auto custom-scrollbar max-h-[70vh]">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

interface SettingsRowProps {
    label: string;
    description?: string;
    icon?: string;
    onClick?: () => void;
    children?: React.ReactNode;
}

export function SettingsRow({ label, description, icon, onClick, children }: SettingsRowProps) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center justify-between p-4 rounded-2xl transition-all border border-transparent 
                ${onClick ? 'cursor-pointer hover:bg-white/5 hover:border-white/5' : ''}`}
        >
            <div className="flex items-center gap-4">
                {icon && (
                    <div className="size-10 bg-c-primary rounded-xl flex items-center justify-center border border-white/5">
                        <Icon src={icon} size="w-5 h-5" className="opacity-40" />
                    </div>
                )}
                <div>
                    <p className="text-[13px] font-bold text-c-text/80">{label}</p>
                    {description && <p className="text-[10px] text-c-text/30 font-bold uppercase tracking-tight">{description}</p>}
                </div>
            </div>
            <div className="flex items-center gap-3">
                {children}
                {onClick && !children && <Icon src="/chevron-down.svg" className="-rotate-90 opacity-20" size="w-4 h-4" />}
            </div>
        </div>
    );
}