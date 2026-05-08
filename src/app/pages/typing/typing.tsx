import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useLanguage } from "../../../context/LanguageContext";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "../../../components";

type Lang = "no" | "en" | "es" | "de" | "fr" | "ru" | "lt" | "ar";

type DictResult = {
  q: string;
  cnt: number;
  cmatch: number;
  a: {
    exact: [string, number][];
    similar: [string, number][];
  };
};

const LANG_LABELS: Record<Lang, string> = {
  no: "Norsk",
  en: "English",
  es: "Español",
  de: "Deutsch",
  fr: "Français",
  ru: "Русский",
  lt: "Lietuvių",
  ar: "العربية",
};

const MYMEMORY_LANG: Record<Lang, string> = {
  no: "nb",
  en: "en",
  es: "es",
  de: "de",
  fr: "fr",
  ru: "ru",
  lt: "lt",
  ar: "ar",
};

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  no: {
    title: "Ordbok & oversetter",
    description: "Skriv et ord, velg språk og få rettelser, lignende ord og oversettelse.",
    from: "Fra",
    to: "Til",
    language: "Velg språk",
    placeholder: "Skriv et ord...",
    loading: "Laster...",
    corrected: "Rettet",
    correctedTo: "til",
    showing: "Viser resultater for",
    translation: "Oversettelse",
    word: "Ord",
    noTranslation: "Ingen oversettelse funnet",
    suggestions: "Forslag",
    exactMatches: "Eksakte treff",
    noExact: "Ingen eksakte treff",
    startSearch: "Skriv noe for å starte søket...",
    didYouMean: "Mente du",
  },
  en: {
    title: "Dictionary & Translator",
    description: "Type a word, choose languages and get corrections, similar words and translation.",
    from: "From",
    to: "To",
    language: "Choose language",
    placeholder: "Type a word...",
    loading: "Loading...",
    corrected: "Corrected",
    correctedTo: "to",
    showing: "Showing results for",
    translation: "Translation",
    word: "Word",
    noTranslation: "No translation found",
    suggestions: "Suggestions",
    exactMatches: "Exact matches",
    noExact: "No exact matches",
    startSearch: "Type something to start searching...",
    didYouMean: "Did you mean",
  },
  es: {
    title: "Diccionario y Traductor",
    description: "Escribe una palabra, elige idiomas y obtén correcciones, palabras similares y traducción.",
    from: "De",
    to: "A",
    language: "Elegir idioma",
    placeholder: "Escribe una palabra...",
    loading: "Cargando...",
    corrected: "Corregido",
    correctedTo: "a",
    showing: "Mostrando resultados para",
    translation: "Traducción",
    word: "Palabra",
    noTranslation: "No se encontró traducción",
    suggestions: "Sugerencias",
    exactMatches: "Coincidencias exactas",
    noExact: "No hay coincidencias exactas",
    startSearch: "Escribe algo para empezar a buscar...",
    didYouMean: "Quizás quisiste decir",
  },
  de: {
    title: "Wörterbuch & Übersetzer",
    description: "Schreibe ein Wort, wähle Sprachen und erhalte Korrektionen, ähnliche Wörter und Übersetzung.",
    from: "Von",
    to: "Zu",
    language: "Sprache wählen",
    placeholder: "Schreibe ein Wort...",
    loading: "Lädt...",
    corrected: "Korrigiert",
    correctedTo: "zu",
    showing: "Zeigt Ergebnisse für",
    translation: "Übersetzung",
    word: "Ord",
    noTranslation: "Keine Übersetzung gefunden",
    suggestions: "Vorschläge",
    exactMatches: "Exakte Treffer",
    noExact: "Keine exakten Treffer",
    startSearch: "Schreibe etwas, um zu suchen...",
    didYouMean: "Meintest du",
  },
  fr: {
    title: "Dictionnaire et Traducteur",
    description: "Tapez un mot, choisissez des langues et obtenez des corrections, des mots similaires et une traduction.",
    from: "De",
    to: "À",
    language: "Choisir la langue",
    placeholder: "Tapez un mot...",
    loading: "Chargement...",
    corrected: "Corrigé",
    correctedTo: "à",
    showing: "Affichage des résultats pour",
    translation: "Traduction",
    word: "Mot",
    noTranslation: "Aucune traduction trouvée",
    suggestions: "Suggestions",
    exactMatches: "Correspondances exactes",
    noExact: "Aucune correspondance exacte",
    startSearch: "Tapez quelque chose pour commencer la recherche...",
    didYouMean: "Vouliez-vous dire",
  },
  ru: {
    title: "Словарь и Переводчик",
    description: "Введите слово, выберите языки и получите исправления, похожие слова и перевод.",
    from: "С",
    to: "На",
    language: "Выбрать язык",
    placeholder: "Введите слово...",
    loading: "Загрузка...",
    corrected: "Исправлено",
    correctedTo: "на",
    showing: "Показ результатов для",
    translation: "Перевод",
    word: "Слово",
    noTranslation: "Перевод не найден",
    suggestions: "Предложения",
    exactMatches: "Точные совпадения",
    noExact: "Нет точных совпадений",
    startSearch: "Введите что-нибудь, чтобы начать поиск...",
    didYouMean: "Вы имели в виду",
  },
  lt: {
    title: "Žodynas ir Vertėjas",
    description: "Įveskite žodį, pasirinkite kalbas ir gaukite pataisas, panašius žodžius ir vertimą.",
    from: "Nuo",
    to: "Į",
    language: "Pasirinkti kalbą",
    placeholder: "Įveskite žodį...",
    loading: "Kraunama...",
    corrected: "Pataisyta",
    correctedTo: "į",
    showing: "Rodyti rezultatus už",
    translation: "Vertimas",
    word: "Žodis",
    noTranslation: "Vertimas nerastas",
    suggestions: "Pasiūlymai",
    exactMatches: "Tikslios atitikties",
    noExact: "Nėra tikslių atitikimų",
    startSearch: "Įveskite kažką, kad pradėtumėte paiešką...",
    didYouMean: "Turėjote omenyje",
  },
  ar: {
    title: "القاموس والمترجم",
    description: "اكتب كلمة، اختر لغات وحصل على تصحيحات وكلمات مشابهة وترجمة.",
    from: "من",
    to: "إلى",
    language: "اختر اللغة",
    placeholder: "اكتب كلمة...",
    loading: "جارٍ التحميل...",
    corrected: "تم التصحيح",
    correctedTo: "إلى",
    showing: "عرض النتائج لـ",
    translation: "الترجمة",
    word: "كلمة",
    noTranslation: "لم يتم العثور على ترجمة",
    suggestions: "اقتراحات",
    exactMatches: "مطابقات دقيقة",
    noExact: "لا توجد مطابقات دقيقة",
    startSearch: "اكتب شيئًا لبدء البحث...",
    didYouMean: "هل كنت تقصد",
  },
};

function createJsonFetcher<T>(timeout = 5000) {
  return async (url: string): Promise<T | null> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) return null;
      return (await res.json()) as T;
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  };
}

const fetchJson = createJsonFetcher<any>(5000);

async function fetchDictionarySuggestions(word: string, lang: "no" | "en" | "es" | "de"): Promise<DictResult> {
  try {
    const data = await invoke<DictResult>("suggest_word", { query: word, lang: lang });
    return data;
  } catch {
    return { q: word, cnt: 0, cmatch: 0, a: { exact: [[word, 100]], similar: [] } };
  }
}

async function fetchDatamuseSuggestions(word: string, lang: "en" | "es" | "de"): Promise<DictResult> {
  const exactUrl = `https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&max=5&v=${lang}`;
  const similarUrl = `https://api.datamuse.com/words?ml=${encodeURIComponent(word)}&max=6&v=${lang}`;
  const exactData = await fetchJson(exactUrl);
  const similarData = await fetchJson(similarUrl);
  const exactMatches: [string, number][] = Array.isArray(exactData) ? exactData.slice(0, 5).map((item: any, i: number) => [String(item.word), 100 - i]) : [];
  const similarMatches: [string, number][] = Array.isArray(similarData) ? similarData.slice(0, 6).map((item: any, i: number) => [String(item.word), 80 - i]) : [];
  if (exactMatches.length === 0) exactMatches.push([word, 100]);
  return { q: word, cnt: exactMatches.length + similarMatches.length, cmatch: exactMatches.length, a: { exact: exactMatches, similar: similarMatches } };
}

async function fetchDefinition(word: string, lang: Lang): Promise<string> {
  if (lang === "no") {
    const url = `https://ordbokapi.org/api/v1/entries/${encodeURIComponent(word)}`;
    const data = await fetchJson(url);
    if (Array.isArray(data) && data.length > 0) {
      const entry = data[0];
      if (entry.definitions && entry.definitions.length > 0) return entry.definitions[0].text || "Ingen definisjon";
    }
    return "Ingen definisjon";
  } else {
    const url = `https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&md=d&v=${lang}`;
    const data = await fetchJson(url);
    if (Array.isArray(data) && data.length > 0 && data[0].defs) return data[0].defs[0].split('\t')[1] || "No definition";
    return "No definition";
  }
}

async function fetchAllDefinitions(word: string): Promise<Record<Lang, string>> {
  const langs: Lang[] = ["no", "en", "es", "de"];
  const promises = langs.map(lang => fetchDefinition(word, lang).then(def => ({ lang, def })));
  const results = await Promise.all(promises);
  const defs: Record<Lang, string> = {} as any;
  results.forEach(({ lang, def }) => { defs[lang] = def; });
  return defs;
}

async function checkSpelling(text: string, lang: Lang): Promise<string> {
  const langMap: Record<Lang, string> = {
    no: "nb-NO",
    en: "en-US",
    es: "es",
    de: "de",
    fr: "fr-FR",
    ru: "ru-RU",
    lt: "lt",
    ar: "ar",
  };

  const url = `https://api.languagetool.org/v2/check?text=${encodeURIComponent(text)}&language=${langMap[lang]}`;
  const data = await fetchJson(url);
  if (data?.matches) {
    let corrected = text;
    data.matches.sort((a: any, b: any) => b.offset - a.offset).forEach((match: any) => {
      if (match.replacements && match.replacements.length > 0) {
        const replacement = match.replacements[0].value;
        corrected = corrected.substring(0, match.offset) + replacement + corrected.substring(match.offset + match.length);
      }
    });
    return corrected;
  }
  return text;
}

async function translateWord(word: string, from: Lang, to: Lang): Promise<string> {
  if (!word || from === to) return word;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=${MYMEMORY_LANG[from]}|${MYMEMORY_LANG[to]}`;
  const result = await fetchJson(url);
  return result?.responseData?.translatedText?.trim() || word;
}

export default function Typing() {
  const [query, setQuery] = useState("");
  const [sourceLang, setSourceLang] = useState<Lang>("no");
  const [targetLang, setTargetLang] = useState<Lang>("en");
  const [data, setData] = useState<DictResult | null>(null);
  const [translation, setTranslation] = useState("");
  const [corrected, setCorrected] = useState("");
  const [definitions, setDefinitions] = useState<Record<string, Record<Lang, string>>>({});
  const [loading, setLoading] = useState(false);

  const { language: uiLang } = useLanguage();
  const t = (key: string) => TRANSLATIONS[uiLang as Lang][key] || key;

  useEffect(() => {
    if (!query.trim()) {
      setData(null); setTranslation(""); setCorrected(""); setDefinitions({}); return;
    }
    const timeout = setTimeout(() => {
      setLoading(true);
      const normalized = query.trim().toLowerCase();
      const lookup = async () => {
        let correctedText = normalized;
        if (normalized.includes(' ')) correctedText = await checkSpelling(normalized, sourceLang);
        const words = correctedText.split(/\s+/).filter(w => w.length > 0);
        const uniqueWords = [...new Set(words)];
        const wordPromises = uniqueWords.map(async (word) => {
          return (sourceLang === "no" || sourceLang === "en" || sourceLang === "es" || sourceLang === "de")
            ? await fetchDictionarySuggestions(word, sourceLang)
            : await fetchDatamuseSuggestions(word, sourceLang as "en" | "es" | "de");
        });
        const wordDicts = await Promise.all(wordPromises);
        const allExact: [string, number][] = [];
        wordDicts.forEach(dict => allExact.push(...dict.a.exact));
        const uniqueExact = allExact.filter((item, index, arr) => arr.findIndex(([w]) => w === item[0]) === index);
        const combinedDict: DictResult = { q: normalized, cnt: uniqueExact.length, cmatch: uniqueExact.length, a: { exact: uniqueExact, similar: [] } };
        const translatedWord = await translateWord(correctedText, sourceLang, targetLang);
        setData(combinedDict); setCorrected(correctedText); setTranslation(translatedWord);
        const defPromises = uniqueExact.map(([word]) => fetchAllDefinitions(word).then(defs => ({ word, defs })));
        const defs = await Promise.all(defPromises);
        const defObj = Object.fromEntries(defs.map(({ word, defs }) => [word, defs]));
        setDefinitions(defObj);
      };
      lookup().catch(console.error).finally(() => setLoading(false));
    }, 500);
    return () => clearTimeout(timeout);
  }, [query, sourceLang, targetLang]);

  return (
    <div className="h-full w-full custom-scrollbar overflow-y-auto">
      <div className="flex flex-col max-w-6xl gap-6 p-8 mx-auto">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-bold text-2xl tracking-tight">{t("title")}</h2>
            <p className="mt-1 text-xs text-c-muted_text max-w-xl">{t("description")}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Moved Language Selectors right above container sides */}
          <div className="grid grid-cols-2 px-2">
            <div className="flex">
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value as Lang)}
                className="bg-transparent text-xs font-bold uppercase tracking-widest text-c-muted_text outline-none cursor-pointer hover:text-c-text transition-colors"
              >
                <option value="no">Norsk</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
            <div className="flex pl-6">
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value as Lang)}
                className="bg-transparent text-xs font-bold uppercase tracking-widest text-c-brand outline-none cursor-pointer hover:brightness-110 transition-colors"
              >
                <option value="no">Norsk</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>

          <section className="relative overflow-hidden rounded-xl border border-white/5 bg-c-secondary shadow-2xl shadow-black/20">
            <div className="grid grid-cols-2 divide-x divide-white/10">
              <div className="flex flex-col p-6 min-h-[450px]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">Source</span>
                  {loading && <div className="w-4 h-4 border-2 border-c-brand/30 border-t-c-brand rounded-full animate-spin" />}
                </div>
                <textarea
                  rows={3}
                  placeholder={t("placeholder")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent text-2xl font-semibold text-c-text placeholder:text-white/10 outline-none resize-none"
                />
                <AnimatePresence>
                  {!loading && data && corrected !== query.trim().toLowerCase() && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-auto pt-4 text-sm text-c-muted_text">
                      <span className="opacity-50">{t("didYouMean")}</span>{" "}
                      <button onClick={() => setQuery(corrected)} className="text-c-brand font-bold hover:underline decoration-c-brand/30 underline-offset-4">"{corrected}"</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col p-6 bg-white/[0.01] min-h-[200px]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-c-brand">Translation</span>
                  <Icon src="/copy.svg" size="w-4 h-4" className="opacity-20 hover:opacity-100 cursor-pointer transition-opacity" />
                </div>
                <div className={`text-2xl font-semibold transition-all duration-300 ${translation ? 'text-c-text' : 'text-white/10'}`}>
                  {translation || t("noTranslation")}
                </div>
                {translation && (
                  <div className="mt-auto pt-4 flex gap-2">
                    <div className="px-2 py-1 rounded bg-c-brand/10 text-c-brand text-[10px] font-bold uppercase">AI Verified</div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-30 px-1">{t("suggestions")}</h3>
            <div className="rounded-3xl border border-white/5 bg-c-secondary p-6 space-y-4">
              <div className="text-xs uppercase tracking-[0.2em] opacity-50">{t("exactMatches")}</div>
              <div className="flex flex-col gap-2">
                {data?.a.exact.length ? (
                  data.a.exact.map(([word, score], index) => (
                    <div key={`exact-${word}-${index}`} className="rounded-xl border border-white/5 bg-c-secondary/80 px-4 py-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-c-text">{word}</span>
                        <span className="text-[10px] font-mono opacity-20">{score}</span>
                      </div>
                      <div className="space-y-1 text-xs text-c-muted_text">
                        <div><strong>{LANG_LABELS[sourceLang].toUpperCase()}:</strong> {definitions[word]?.[sourceLang] || "Laster..."}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-white/5 px-4 py-8 text-center opacity-40 text-sm">{t("noExact")}</div>
                )}
              </div>
            </div>
          </section>

          <section>
            <h1 className="font-bold text-2xl tracking-tight">Last ned Språkpakker lokalt</h1>
          </section>
        </div>

        {!loading && query && !data && (
          <div className="py-20 text-center opacity-30 italic">{t("startSearch")}</div>
        )}
      </div>
    </div>
  );
}