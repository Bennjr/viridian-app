import "../../global.css";
import { useState, useEffect } from "react";

import { useLanguage } from "../../../context/LanguageContext";

type Lang = "no" | "en" | "es" | "de" | "fr" | "ru" | "lt" | "ar";

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  no: {
    progress: "Fremgang",
    step: "Steg",
    of: "av",
    welcome: "Velkommen til Viridian",
    welcomeDesc: "Et verktøy designet for å gjøre lesing og skriving enklere for deg med dysleksi.",
    getStarted: "Kom i gang",
    fontSizeTitle: "Velg tekststørrelse",
    fontSizeDesc: "Velg den størrelsen som er mest behagelig å lese.",
    small: "Liten",
    medium: "Medium",
    large: "Stor",
    menuPosition: "Menyplassering",
    menuDesc: "Hvordan vil du ha tilgang til verktøyene dine?",
    floating: "Flytende",
    floatingDesc: "Alltid nær teksten",
    fixed: "Topp",
    fixedDesc: "Fast i toppen av skjermen",
    back: "Tilbake",
    next: "Neste",
    startApp: "Start Viridian",
  },
  en: {
    progress: "Progress",
    step: "Step",
    of: "of",
    welcome: "Welcome to Viridian",
    welcomeDesc: "A tool designed to make reading and writing easier for you with dyslexia.",
    getStarted: "Get Started",
    fontSizeTitle: "Choose Font Size",
    fontSizeDesc: "Choose the size that's most comfortable to read.",
    small: "Small",
    medium: "Medium",
    large: "Large",
    menuPosition: "Menu Position",
    menuDesc: "How would you like to access your tools?",
    floating: "Floating",
    floatingDesc: "Always near the text",
    fixed: "Top",
    fixedDesc: "Fixed at the top of the screen",
    themeTitle: "Choose Color Theme",
    themeDesc: "Dark mode is often best for dyslexia.",
    back: "Back",
    next: "Next",
    startApp: "Start Viridian",
  },
  es: {
    progress: "Progreso",
    step: "Paso",
    of: "de",
    welcome: "Bienvenido a Viridian",
    welcomeDesc: "Una herramienta diseñada para facilitar la lectura y escritura para personas con dislexia.",
    getStarted: "Comenzar",
    fontSizeTitle: "Elegir Tamaño de Fuente",
    fontSizeDesc: "Elige el tamaño que sea más cómodo de leer.",
    small: "Pequeño",
    medium: "Mediano",
    large: "Grande",
    menuPosition: "Posición del Menú",
    menuDesc: "¿Cómo quieres acceder a tus herramientas?",
    floating: "Flotante",
    floatingDesc: "Siempre cerca del texto",
    fixed: "Superior",
    fixedDesc: "Fijo en la parte superior de la pantalla",
    back: "Volver",
    next: "Siguiente",
    startApp: "Iniciar Viridian",
  },
  de: {
    progress: "Fortschritt",
    step: "Schritt",
    of: "von",
    welcome: "Willkommen bei Viridian",
    welcomeDesc: "Ein Werkzeug, das entwickelt wurde, um das Lesen und Schreiben für Menschen mit Dyslexie zu erleichtern.",
    getStarted: "Loslegen",
    fontSizeTitle: "Schriftgröße wählen",
    fontSizeDesc: "Wähle die Größe, die am angenehmsten zu lesen ist.",
    small: "Klein",
    medium: "Mittel",
    large: "Groß",
    menuPosition: "Menüposition",
    menuDesc: "Wie möchtest du auf deine Werkzeuge zugreifen?",
    floating: "Schwebend",
    floatingDesc: "Immer nahe am Text",
    fixed: "Oben",
    fixedDesc: "Fest oben auf dem Bildschirm",
    back: "Zurück",
    next: "Weiter",
    startApp: "Viridian starten",
    themeTitle: "Farbthema wählen",
    themeDesc: "Dark Mode ist oft am besten für Dyslexie.",
  },
  fr: {
    progress: "Progression",
    step: "Étape",
    of: "sur",
    welcome: "Bienvenue dans Viridian",
    welcomeDesc: "Un outil conçu pour faciliter la lecture et l'écriture pour les personnes dyslexiques.",
    getStarted: "Commencer",
    fontSizeTitle: "Choisir la taille de la police",
    fontSizeDesc: "Choisissez la taille la plus confortable à lire.",
    small: "Petite",
    medium: "Moyenne",
    large: "Grande",
    menuPosition: "Position du menu",
    menuDesc: "Comment voulez-vous accéder à vos outils ?",
    floating: "Flottant",
    floatingDesc: "Toujours près du texte",
    fixed: "Haut",
    fixedDesc: "Fixé en haut de l'écran",
    back: "Retour",
    next: "Suivant",
    startApp: "Démarrer Viridian",
    themeTitle: "Choisir le thème de couleur",
    themeDesc: "Le mode sombre est souvent le meilleur pour la dyslexie.",
  },
  ru: {
    progress: "Прогресс",
    step: "Шаг",
    of: "из",
    welcome: "Добро пожаловать в Viridian",
    welcomeDesc: "Инструмент, созданный для упрощения чтения и письма людям с дислексией.",
    getStarted: "Начать",
    fontSizeTitle: "Выберите размер шрифта",
    fontSizeDesc: "Выберите размер, который наиболее удобен для чтения.",
    small: "Маленький",
    medium: "Средний",
    large: "Большой",
    menuPosition: "Положение меню",
    menuDesc: "Как вы хотите получить доступ к своим инструментам?",
    floating: "Плавающий",
    floatingDesc: "Всегда рядом с текстом",
    fixed: "Сверху",
    fixedDesc: "Закреплено в верхней части экрана",
    back: "Назад",
    next: "Далее",
    startApp: "Запустить Viridian",
    themeTitle: "Выберите цветовую тему",
    themeDesc: "Темный режим часто лучше всего подходит для дислексии.",
  },
  lt: {
    progress: "Pažanga",
    step: "Žingsnis",
    of: "iš",
    welcome: "Sveiki atvykę į Viridian",
    welcomeDesc: "Įrankis, skirtas palengvinti skaitymą ir rašymą žmonėms su disleksija.",
    getStarted: "Pradėti",
    fontSizeTitle: "Pasirinkite šrifto dydį",
    fontSizeDesc: "Pasirinkite dydį, kuris yra patogiausias skaityti.",
    small: "Mažas",
    medium: "Vidutinis",
    large: "Didelis",
    menuPosition: "Meniu padėtis",
    menuDesc: "Kaip norite pasiekti savo įrankius?",
    floating: "Plūduriuojantis",
    floatingDesc: "Visada prie teksto",
    fixed: "Viršuje",
    fixedDesc: "Fiksuota ekrano viršuje",
    back: "Atgal",
    next: "Toliau",
    startApp: "Pradėti Viridian",
    themeTitle: "Pasirinkite spalvų temą",
    themeDesc: "Tamsus režimas dažnai geriausias disleksijai.",
  },
  ar: {
    progress: "التقدم",
    step: "خطوة",
    of: "من",
    welcome: "مرحبًا بك في Viridian",
    welcomeDesc: "أداة مصممة لتسهيل القراءة والكتابة للأشخاص الذين يعانون من عسر القراءة.",
    getStarted: "ابدأ",
    fontSizeTitle: "اختر حجم الخط",
    fontSizeDesc: "اختر الحجم الأكثر راحة للقراءة.",
    small: "صغير",
    medium: "متوسط",
    large: "كبير",
    menuPosition: "موضع القائمة",
    menuDesc: "كيف تريد الوصول إلى أدواتك؟",
    floating: "عائم",
    floatingDesc: "دائمًا بالقرب من النص",
    fixed: "أعلى",
    fixedDesc: "مثبت في أعلى الشاشة",
    back: "رجوع",
    next: "التالي",
    startApp: "ابدأ Viridian",
    themeTitle: "اختر مظهر اللون",
    themeDesc: "الوضع الداكن غالبًا ما يكون الأفضل لعسر القراءة.",
  },
};

const ProgressBar = ({ step, total, t }: { step: number; total: number; t: (key: string) => string }) => {
    return (
        <div className="flex flex-col gap-2 w-full max-w-xs mx-auto mb-8">
            <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-50 font-bold">
                <span>{t("progress")}</span>
                <span>{t("step")} {step} {t("of")} {total}</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-c-brand transition-all duration-500 ease-out"
                    style={{ width: `${(step / total) * 100}%` }}
                />
            </div>
        </div>
    );
};

interface Props {
    setFirstStart: any;
}

export default function Onboarding({ setFirstStart }: Props) {
    const [step, setStep] = useState(0);
    const totalSteps = 4;

    const [fontSize, setFontSize] = useState("medium");
    const [theme, setTheme] = useState("light");
    const [textMode, setTextMode] = useState("floating");
    const [selectedLanguage, setSelectedLanguage] = useState<Lang>("no");

    const { language, setLanguage } = useLanguage();
    const t = (key: string) => TRANSLATIONS[language][key] || key;

    useEffect(() => {
        setFontSize(localStorage.getItem("fontSize") || "medium");
        setTheme(localStorage.getItem("theme") || "light");
        setTextMode(localStorage.getItem("textMode") || "floating");
    }, []);

    useEffect(() => {
        localStorage.setItem("fontSize", fontSize);
        localStorage.setItem("theme", theme);
        localStorage.setItem("textMode", textMode);
    }, [fontSize, theme, textMode]);

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    return (
        <div className="h-screen w-screen bg-c-primary text-c-text overflow-hidden flex flex-col">

            {/* INTRO SCREEN (Step 0) */}
            {step === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-in fade-in zoom-in duration-700">
                    <div className="mb-6 size-24 bg-c-brand rounded-3xl shadow-2xl shadow-c-brand/20 flex items-center justify-center text-4xl font-black text-white">V</div>
                    <h1 className="text-5xl font-black tracking-tight mb-4">{t("welcome")}</h1>
                    <p className="text-xl opacity-60 max-w-md leading-relaxed mb-10">
                        {t("welcomeDesc")}
                    </p>
                    <button
                        className="bg-c-brand text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-c-brand/20 hover:scale-105 active:scale-95 transition-all"
                        onClick={nextStep}
                    >
                        {t("getStarted")}
                    </button>
                </div>
            )}

            {step > 0 && (
                <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-8">

                    <ProgressBar step={step} total={totalSteps} t={t} />

                    <div className="flex-1 flex flex-col justify-center">

                        {/* STEP 1: FONT SIZE */}
                        {step === 1 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold mb-2">{t("fontSizeTitle")}</h2>
                                    <p className="opacity-50">{t("fontSizeDesc")}</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: 'small', label: t('small'), size: 'text-sm' },
                                        { id: 'medium', label: t('medium'), size: 'text-base' },
                                        { id: 'large', label: t('large'), size: 'text-xl' }
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
                        )}

                        {/* STEP 2: UI MODE */}
                        {step === 2 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold mb-2">{t("menuPosition")}</h2>
                                    <p className="opacity-50">{t("menuDesc")}</p>
                                </div>

                                <div className="flex gap-4">
                                    {[
                                        { id: 'floating', label: t('floating'), desc: t('floatingDesc') },
                                        { id: 'fixed', label: t('fixed'), desc: t('fixedDesc') }
                                    ].map((mode) => (
                                        <button
                                            key={mode.id}
                                            onClick={() => setTextMode(mode.id)}
                                            className={`flex-1 p-6 rounded-2xl border-2 transition-all text-left
                                                            ${textMode === mode.id ? 'border-c-brand bg-c-brand/5' : 'border-white/5 bg-c-secondary hover:border-white/10'}
                                                        `}
                                        >
                                            <div className="h-24 bg-c-primary rounded-lg mb-4 relative overflow-hidden border border-white/5">
                                                {mode.id === 'floating' ? (
                                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-3 bg-c-brand rounded-full shadow-lg" />
                                                ) : (
                                                    <div className="absolute top-0 left-0 w-full h-3 bg-c-brand" />
                                                )}
                                            </div>
                                            <p className="font-bold">{mode.label}</p>
                                            <p className="text-xs opacity-50">{mode.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STEP 4: LANGUAGE */}
                        {step === 4 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold mb-2">Velg språk</h2>
                                    <p className="opacity-50">Velg språket du vil bruke i appen.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { id: 'no', label: 'Norsk', flag: '🇳🇴' },
                                        { id: 'en', label: 'English', flag: '🇺🇸' },
                                        { id: 'es', label: 'Español', flag: '🇪🇸' },
                                        { id: 'de', label: 'Deutsch', flag: '🇩🇪' }
                                    ].map((lang) => (
                                        <button
                                            key={lang.id}
                                            onClick={() => setSelectedLanguage(lang.id as Lang)}
                                            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4
                                                            ${selectedLanguage === lang.id ? 'border-c-brand bg-c-brand/5' : 'border-white/5 bg-c-secondary hover:border-white/10'}
                                                        `}
                                        >
                                            <span className="text-3xl">{lang.flag}</span>
                                            <span className="text-sm font-bold">{lang.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* NAVIGATION BAR */}
                    <div className="mt-auto py-10 flex items-center justify-between">
                        <button
                            onClick={prevStep}
                            className="px-6 py-2 font-bold opacity-40 hover:opacity-100 transition-opacity"
                            disabled={step === 0}
                        >
                            {t("back")}
                        </button>

                        <button
                            className="bg-c-brand text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-c-brand/20 hover:scale-105 active:scale-95 transition-all"
                            onClick={() => {
                                if (step === totalSteps) {
                                    setLanguage(selectedLanguage);
                                    setFirstStart(false);
                                } else {
                                    nextStep();
                                }
                            }}
                        >
                            {step === totalSteps ? t("startApp") : t("next")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}