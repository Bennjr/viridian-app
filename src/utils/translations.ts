import noTranslations from '../data/lang/no.json';
import enTranslations from '../data/lang/en.json';
import esTranslations from '../data/lang/es.json';
import deTranslations from '../data/lang/de.json';
import frTranslations from '../data/lang/fr.json';
import ruTranslations from '../data/lang/ru.json';
import ltTranslations from '../data/lang/lt.json';
import arTranslations from '../data/lang/ar.json';

export type Lang = "no" | "en" | "es" | "de" | "fr" | "ru" | "lt" | "ar";

const translations: Record<Lang, any> = {
  no: noTranslations,
  en: enTranslations,
  es: esTranslations,
  de: deTranslations,
  fr: frTranslations,
  ru: ruTranslations,
  lt: ltTranslations,
  ar: arTranslations,
};

export const getTranslations = (language: Lang, namespace: string): Record<string, any> => {
  return translations[language]?.[namespace] || {};
};

export const t = (language: Lang, namespace: string, key: string): string => {
  return String(getTranslations(language, namespace)[key] || key);
};

export const getLangLabels = (language: Lang): Record<string, string> => {
  return getTranslations(language, 'languages') || {};
};
