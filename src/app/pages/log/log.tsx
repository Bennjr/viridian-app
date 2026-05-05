import "../../global.css";
import { useLanguage } from "../../../context/LanguageContext";

type Lang = "no" | "en" | "es" | "de";

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  no: {
    log: "Logg",
    appTheme: "App Tema",
    someDesc: "Noen beskrivelse",
  },
  en: {
    log: "Log",
    appTheme: "App Theme",
    someDesc: "Some description",
  },
  es: {
    log: "Registro",
    appTheme: "Tema de la Aplicación",
    someDesc: "Alguna descripción",
  },
  de: {
    log: "Protokoll",
    appTheme: "App-Design",
    someDesc: "Einige Beschreibung",
  },
};

interface logProps {
    label: string;
    desc: string;
}

const LogInstance = ({ label, desc }: logProps) => (
    <div className="p-4 grid grid-row-[auto_auto] bg-c-secondary border border-c-divider min-h-16 hover:bg-c-hover">
        <div>{label}</div>
        <div>{desc}</div>
    </div>
);

export default function Log() {
    const { language } = useLanguage();
    const t = (key: string) => TRANSLATIONS[language as Lang][key] || key;

    return (
        <div className="grid grid-rows-[auto_auto] gap-6">
            <h1 className="text-xl font-bold">{t("log")}</h1>
            <main>
                <LogInstance label={t("appTheme")} desc={t("someDesc")}></LogInstance>
                <LogInstance label={t("appTheme")} desc={t("someDesc")}></LogInstance>
                <LogInstance label={t("appTheme")} desc={t("someDesc")}></LogInstance>
            </main>
        </div>
    )
}