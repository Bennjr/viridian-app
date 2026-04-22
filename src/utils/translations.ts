import noTranslations from '../data/lang/no.json';
import enTranslations from '../data/lang/en.json';
import esTranslations from '../data/lang/es.json';
import deTranslations from '../data/lang/de.json';

type Lang = "no" | "en" | "es" | "de";

const translations: Record<Lang, any> = {
  no: noTranslations,
  en: enTranslations,
  es: esTranslations,
  de: deTranslations,
};

export const getTranslations = (language: Lang, namespace: string): Record<string, string> => {
  return translations[language]?.[namespace] || {};
};

export const t = (language: Lang, namespace: string, key: string): string => {
  return getTranslations(language, namespace)[key] || key;
};

export const getLangLabels = (language: Lang): Record<string, string> => {
  return getTranslations(language, 'languages') || {};
};
