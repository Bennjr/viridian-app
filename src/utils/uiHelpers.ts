import { useLanguage } from "../context/LanguageContext";
import { getTranslations } from "./translations";

export const proEase = [0.4, 0, 0.2, 1] as const;

export const THEMES = {
  default: {
    root: "bg-c-primary text-c-text",
    panel: "bg-c-secondary/60 border-white/[0.04]",
    card: "bg-c-secondary/50 border-white/[0.04]",
  },

  dark: {
    root: "bg-[#111315] text-white",
    panel: "bg-[#181b1f]/70 border-white/[0.04]",
    card: "bg-[#181b1f]/50 border-white/[0.04]",
  },

  light: {
    root: "bg-[#f6f7fb] text-[#111]",
    panel: "bg-white/80 border-black/[0.04]",
    card: "bg-white/70 border-black/[0.04]",
  },

  contrast: {
    root: "bg-black text-white",
    panel: "bg-black border-white/20",
    card: "bg-black border-white/20",
  },
} as const;

export function useTranslation(namespace: string) {
  const { language } = useLanguage();
  const translations = getTranslations(language, namespace);

  return (key: string) => translations[key] ?? key;
}

export function getThemeStyles(theme: string) {
  return THEMES[theme as keyof typeof THEMES] || THEMES.default;
}
