import { NavLink } from "react-router-dom";
import "../../global.css";

import { Icon } from "../../../components";

import { DoubleSelect, Slider, Toggle, ThemeSelector, FontSize, ToolbarDragDrop } from "../../../components"
import { useLanguage } from "../../../context/LanguageContext";
import { getTranslations } from "../../../utils/translations";

type Lang = "no" | "en" | "es" | "de";

const LANG_LABELS: Record<Lang, string> = {
    no: "Norsk",
    en: "English",
    es: "Español",
    de: "Deutsch",
};

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
    no: {
        title: "Innstillinger",
        subtitle: "Tilpass Viridian for din leseopplevelse",
        searchPlaceholder: "Søk i innstillinger...",
        general: "Generelt",
        appearance: "Utseende",
        accessibility: "Tilgjengelighet",
        about: "Om Appen",
        autoStart: "Start automatisk ved pålogging",
        notifications: "System-varslinger",
        on: "På",
        off: "Av",
        fontSize: "Tekststørrelse",
        menuTransparency: "Meny Gjennomsiktighet",
        colorTheme: "Fargetema",
        language: "Språk",
    },
    en: {
        title: "Settings",
        subtitle: "Customize Viridian for your reading experience",
        searchPlaceholder: "Search settings...",
        general: "General",
        appearance: "Appearance",
        accessibility: "Accessibility",
        about: "About App",
        autoStart: "Start automatically on login",
        notifications: "System notifications",
        on: "On",
        off: "Off",
        fontSize: "Font Size",
        menuTransparency: "Menu Transparency",
        colorTheme: "Color Theme",
        language: "Language",
    },
    es: {
        title: "Configuración",
        subtitle: "Personaliza Viridian para tu experiencia de lectura",
        searchPlaceholder: "Buscar en configuración...",
        general: "General",
        appearance: "Apariencia",
        accessibility: "Accesibilidad",
        about: "Acerca de la App",
        autoStart: "Iniciar automáticamente al iniciar sesión",
        notifications: "Notificaciones del sistema",
        on: "Activado",
        off: "Desactivado",
        fontSize: "Tamaño de fuente",
        menuTransparency: "Transparencia del menú",
        colorTheme: "Tema de color",
        language: "Idioma",
    },
    de: {
        title: "Einstellungen",
        subtitle: "Passe Viridian an deine Leseerfahrung an",
        searchPlaceholder: "In Einstellungen suchen...",
        general: "Allgemein",
        appearance: "Aussehen",
        accessibility: "Barrierefreiheit",
        about: "Über die App",
        autoStart: "Automatisch beim Anmelden starten",
        notifications: "Systembenachrichtigungen",
        on: "Ein",
        off: "Aus",
        fontSize: "Schriftgröße",
        menuTransparency: "Menütransparenz",
        colorTheme: "Farbthema",
        language: "Sprache",
    },
};

export default function Settings() {
    const { language, setLanguage } = useLanguage();
    const settingsTranslations = getTranslations(language as Lang, 'settings');
    const langTranslations = getTranslations(language as Lang, 'languages');
    const LANG_LABELS = langTranslations;
    const t = (key: string) => settingsTranslations[key] || TRANSLATIONS[language as Lang]?.[key] || key;

    return (
        <div className="bg-c-primary text-c-text h-screen flex flex-col overflow-hidden">
            <header className="px-8 pt-12 pb-8 max-w-5xl w-full mx-auto flex-shrink-0">
                <div className="flex items-end gap-4 mb-6">
                    <NavLink to="/" className="p-2 hover:bg-c-secondary rounded-full transition-colors">
                        <Icon src="/chevron-down.svg" className="rotate-90" />
                    </NavLink>
                    <div>
                        <h2 className="text-4xl font-black tracking-tight">{t("title")}</h2>
                        <p className="opacity-50 text-sm">{t("subtitle")}</p>
                    </div>
                </div>

                <div className="relative group">
                    <input
                        type="text"
                        placeholder={t("searchPlaceholder")}
                        className="w-full pl-12 pr-4 py-3 bg-c-secondary border border-white/5 rounded-2xl outline-none"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20">
                        <Icon src="/search.svg" size="w-5 h-5" />
                    </div>
                </div>
            </header>

            {/* 3. MAIN AREA: Takes up the remaining space */}
            <main className="flex-1 max-w-5xl w-full mx-auto grid grid-cols-[200px_1fr] gap-12 overflow-hidden px-8 pb-8">

                {/* 4. NAV: Stays put because the parent main is overflow-hidden */}
                <nav className="flex flex-col gap-2 h-fit pt-2">
                    <button className="text-left px-4 py-2 rounded-lg bg-c-brand/10 text-c-brand font-bold text-sm">{t("general")}</button>
                    <button className="text-left px-4 py-2 rounded-lg hover:bg-white/5 text-sm opacity-50">{t("appearance")}</button>
                    <button className="text-left px-4 py-2 rounded-lg hover:bg-white/5 text-sm opacity-50">{t("accessibility")}</button>
                    <button className="text-left px-4 py-2 rounded-lg hover:bg-white/5 text-sm opacity-50">{t("about")}</button>
                </nav>

                <div className="space-y-10 overflow-y-auto pr-6 h-full custom-scrollbar">

                    <section className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-30 ml-1">{t("general")}</h3>
                        <div className="bg-c-secondary/30 border border-white/5 rounded-3xl p-6 space-y-6">
                            <Toggle label={t("autoStart")} enabled={true} onChange={() => { }} />
                            <div className="h-[1px] bg-white/5 w-full" />
                            <DoubleSelect label={t("notifications")}>
                                <button className="bg-c-brand px-12 py-1.5 text-xs font-bold text-white">{t("on")}</button>
                                <button className="bg-c-secondary px-12 py-1.5 text-xs font-bold opacity-40">{t("off")}</button>
                            </DoubleSelect>
                        </div>
                    </section>
                    <section className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-30 ml-1">{t("appearance")}</h3>
                        <div className="bg-c-secondary/30 border border-white/5 rounded-3xl p-6 space-y-8">
                            <div>
                                <p className="text-sm font-bold mb-4">{t("fontSize")}</p>
                                <FontSize />
                            </div>
                            <div className="h-[1px] bg-white/5 w-full" />
                            <Slider label={t("menuTransparency")} range={100} />
                            <div>
                                <p className="text-sm font-bold mb-4">{t("colorTheme")}</p>
                                <ThemeSelector />
                            </div>
                            <div className="h-[1px] bg-white/5 w-full" />
                            <div>
                                <p className="text-sm font-bold mb-4">{t("language")}</p>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value as Lang)}
                                    className="bg-c-secondary border border-white/5 rounded-2xl px-4 py-3 text-c-text outline-none w-full"
                                >
                                    <option value="no">{LANG_LABELS.no || "Norsk"}</option>
                                    <option value="en">{LANG_LABELS.en || "English"}</option>
                                    <option value="es">{LANG_LABELS.es || "Español"}</option>
                                    <option value="de">{LANG_LABELS.de || "Deutsch"}</option>
                                </select>
                            </div>
                        </div>
                    </section>


                    <section className="space-y-4">
                        <ToolbarDragDrop></ToolbarDragDrop>
                    </section>
                    <div className="h-20" />
                </div >
            </main >
        </div >
    );
}