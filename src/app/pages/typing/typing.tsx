import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useLanguage } from "../../../context/LanguageContext";

type Lang = "no" | "en" | "es" | "de";

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
};

const MYMEMORY_LANG: Record<Lang, string> = {
  no: "nb",
  en: "en",
  es: "es",
  de: "de",
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
    description: "Schreibe ein Wort, wähle Sprachen und erhalte Korrekturen, ähnliche Wörter und Übersetzung.",
    from: "Von",
    to: "Zu",
    language: "Sprache wählen",
    placeholder: "Schreibe ein Wort...",
    loading: "Lädt...",
    corrected: "Korrigiert",
    correctedTo: "zu",
    showing: "Zeigt Ergebnisse für",
    translation: "Übersetzung",
    word: "Wort",
    noTranslation: "Keine Übersetzung gefunden",
    suggestions: "Vorschläge",
    exactMatches: "Exakte Treffer",
    noExact: "Keine exakten Treffer",
    startSearch: "Schreibe etwas, um zu suchen...",
    didYouMean: "Meintest du",
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
    return {
      q: word,
      cnt: 0,
      cmatch: 0,
      a: { exact: [[word, 100]], similar: [] },
    };
  }
}

async function fetchDatamuseSuggestions(word: string, lang: "en" | "es" | "de"): Promise<DictResult> {
  const exactUrl = `https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&max=5&v=${lang}`;
  const similarUrl = `https://api.datamuse.com/words?ml=${encodeURIComponent(word)}&max=6&v=${lang}`;

  const exactData = await fetchJson(exactUrl);
  const similarData = await fetchJson(similarUrl);

  const exactMatches: [string, number][] = Array.isArray(exactData)
    ? exactData.slice(0, 5).map((item: any, i: number) => [String(item.word), 100 - i])
    : [];

  const similarMatches: [string, number][] = Array.isArray(similarData)
    ? similarData.slice(0, 6).map((item: any, i: number) => [String(item.word), 80 - i])
    : [];

  if (exactMatches.length === 0) {
    exactMatches.push([word, 100]);
  }

  return {
    q: word,
    cnt: exactMatches.length + similarMatches.length,
    cmatch: exactMatches.length,
    a: { exact: exactMatches, similar: similarMatches },
  };
}

const SLANG_TRANSLATIONS: Record<string, Record<Lang, string>> = {
  // Spansk slang
  "que tal": { no: "Hva skjer", en: "What's up", es: "Qué tal", de: "Wie geht's" },
  "vale": { no: "Ok", en: "Okay", es: "Vale", de: "Okay" },
  "tio": { no: "Kompis", en: "Dude", es: "Tío", de: "Kumpel" },
  "guay": { no: "Kult", en: "Cool", es: "Guay", de: "Cool" },
  "joder": { no: "Faen", en: "Damn", es: "Joder", de: "Verdammt" },
  "hostia": { no: "Herregud", en: "Holy shit", es: "Hostia", de: "Heilige Scheiße" },
  "coño": { no: "Faen", en: "Fuck", es: "Coño", de: "Scheiße" },
  "puta": { no: "Fitte", en: "Bitch", es: "Puta", de: "Schlampe" },
  "cabrón": { no: "Svin", en: "Bastard", es: "Cabrón", de: "Bastard" },
  "hola": { no: "Hei", en: "Hi", es: "Hola", de: "Hallo" },
  "como estas": { no: "Hvordan har du det", en: "How are you", es: "Cómo estás", de: "Wie geht es dir" },
  // Norsk naturlig
  "æ": { no: "Jeg", en: "I", es: "Yo", de: "Ich" },
  "du": { no: "Du", en: "You", es: "Tú", de: "Du" },
  "han": { no: "Han", en: "He", es: "Él", de: "Er" },
  "hun": { no: "Hun", en: "She", es: "Ella", de: "Sie" },
  "vi": { no: "Vi", en: "We", es: "Nosotros", de: "Wir" },
  "dere": { no: "Dere", en: "You (pl)", es: "Vosotros", de: "Ihr" },
  "de": { no: "De", en: "They", es: "Ellos", de: "Sie" },
  "hva skjer": { no: "Hva skjer", en: "What's up", es: "Qué pasa", de: "Was geht" },
  "hvordan går det": { no: "Hvordan går det", en: "How's it going", es: "Cómo va", de: "Wie läuft's" },
  "faen": { no: "Faen", en: "Damn", es: "Joder", de: "Verdammt" },
  "herregud": { no: "Herregud", en: "Oh my god", es: "Dios mío", de: "Mein Gott" },
  "fitte": { no: "Fitte", en: "Bitch", es: "Puta", de: "Schlampe" },
  "svin": { no: "Svin", en: "Bastard", es: "Cabrón", de: "Bastard" },
  "hey": { no: "Hei", en: "Hey", es: "Ey", de: "Hey" },
  "sup": { no: "Hva skjer", en: "What's up", es: "Qué pasa", de: "Was los" },
  "yo": { no: "Jeg", en: "I", es: "Yo", de: "Ich" },
  "tu": { no: "Du", en: "You", es: "Tú", de: "Du" },
  "el": { no: "Han", en: "He", es: "Él", de: "Er" },
  "la": { no: "Hun", en: "She", es: "Ella", de: "Sie" },
  "wie gehts": { no: "Hvordan går det", en: "How's it going", es: "Cómo estás", de: "Wie geht's" },
  "was geht": { no: "Hva skjer", en: "What's up", es: "Qué pasa", de: "Was geht" },
  // Legg til flere etter behov
};

async function checkSpelling(text: string, lang: Lang): Promise<string> {
  if (lang === "no") {
    // Bruk LanguageTool for norsk
    const url = `https://api.languagetool.org/v2/check?text=${encodeURIComponent(text)}&language=nb-NO`;
    const data = await fetchJson(url);
    if (data?.matches) {
      let corrected = text;
      data.matches.forEach((match: any) => {
        if (match.replacements && match.replacements.length > 0) {
          const offset = match.offset;
          const length = match.length;
          const replacement = match.replacements[0].value;
          corrected = corrected.substring(0, offset) + replacement + corrected.substring(offset + length);
        }
      });
      return corrected;
    }
  } else if (lang === "es") {
    // For spansk, bruk LanguageTool
    const url = `https://api.languagetool.org/v2/check?text=${encodeURIComponent(text)}&language=es`;
    const data = await fetchJson(url);
    if (data?.matches) {
      let corrected = text;
      data.matches.forEach((match: any) => {
        if (match.replacements && match.replacements.length > 0) {
          const offset = match.offset;
          const length = match.length;
          const replacement = match.replacements[0].value;
          corrected = corrected.substring(0, offset) + replacement + corrected.substring(offset + length);
        }
      });
      return corrected;
    }
  }
  return text;
}

async function fetchDefinition(word: string, lang: Lang): Promise<string> {
  if (lang === "no") {
    const url = `https://ordbokapi.org/api/v1/entries/${encodeURIComponent(word)}`;
    const data = await fetchJson(url);
    if (Array.isArray(data) && data.length > 0) {
      const entry = data[0];
      if (entry.definitions && entry.definitions.length > 0) {
        return entry.definitions[0].text || "Ingen definisjon";
      }
    }
    return "Ingen definisjon";
  } else {
    // For English, Spanish, and German, use Datamuse
    const url = `https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&md=d&v=${lang}`;
    const data = await fetchJson(url);
    if (Array.isArray(data) && data.length > 0 && data[0].defs) {
      return data[0].defs[0].split('\t')[1] || "No definition";
    }
    return "No definition";
  }
}

async function fetchAllDefinitions(word: string): Promise<Record<Lang, string>> {
  const langs: Lang[] = ["no", "en", "es", "de"];
  const promises = langs.map(lang => fetchDefinition(word, lang).then(def => ({ lang, def })));
  const results = await Promise.all(promises);
  const defs: Record<Lang, string> = {} as any;
  results.forEach(({ lang, def }) => {
    defs[lang] = def;
  });
  return defs;
}

async function translateWord(word: string, from: Lang, to: Lang): Promise<string> {
  if (!word || from === to) return word;

  // For setninger, oversett hele
  if (word.includes(' ')) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=${MYMEMORY_LANG[from]}|${MYMEMORY_LANG[to]}`;
    const result = await fetchJson(url);
    const translated = result?.responseData?.translatedText;
    if (typeof translated === "string" && translated.trim().length > 0) {
      return translated.trim();
    }
    return word;
  }

  // For enkeltord, sjekk slang først
  const lowerWord = word.toLowerCase();
  if (SLANG_TRANSLATIONS[lowerWord]) {
    return SLANG_TRANSLATIONS[lowerWord][to] || word;
  }

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=${MYMEMORY_LANG[from]}|${MYMEMORY_LANG[to]}`;
  const result = await fetchJson(url);

  const translated = result?.responseData?.translatedText;
  if (typeof translated === "string" && translated.trim().length > 0) {
    return translated.trim();
  }

  return word;
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

  const t = (key: string) => TRANSLATIONS[uiLang][key] || key;

  useEffect(() => {
    if (!query.trim()) {
      setData(null);
      setTranslation("");
      setCorrected("");
      setDefinitions({});
      return;
    }

    const timeout = setTimeout(() => {
      setLoading(true);
      const normalized = query.trim().toLowerCase();

      const lookup = async () => {
        let correctedText = normalized;
        if (normalized.includes(' ')) {
          // Setning: Rett stavefeil
          correctedText = await checkSpelling(normalized, sourceLang);
        }

        const words = correctedText.split(/\s+/).filter(w => w.length > 0);
        const uniqueWords = [...new Set(words)];

        // Få forslag for hvert unike ord
        const wordPromises = uniqueWords.map(async (word) => {
          if (sourceLang === "no" || sourceLang === "en" || sourceLang === "es" || sourceLang === "de") {
            return await fetchDictionarySuggestions(word, sourceLang);
          } else {
            return await fetchDatamuseSuggestions(word, sourceLang as "en" | "es" | "de");
          }
        });

        const wordDicts = await Promise.all(wordPromises);

        // Kombiner alle exact matches
        const allExact: [string, number][] = [];
        wordDicts.forEach(dict => {
          allExact.push(...dict.a.exact);
        });
        const uniqueExact = allExact.filter((item, index, arr) =>
          arr.findIndex(([w]) => w === item[0]) === index
        );

        const combinedDict: DictResult = {
          q: normalized,
          cnt: uniqueExact.length,
          cmatch: uniqueExact.length,
          a: { exact: uniqueExact, similar: [] }
        };

        const translatedWord = await translateWord(correctedText, sourceLang, targetLang);

        setData(combinedDict);
        setCorrected(correctedText);
        setTranslation(translatedWord);

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
    <div className="flex flex-col gap-6 max-w-6xl mx-auto p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">{t("title")}</h2>
          <p className="mt-1 text-xs text-c-muted_text max-w-xl">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] opacity-60 text-c-muted_text">
            {t("from")}
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value as Lang)}
              className="bg-c-secondary border border-white/5 rounded-2xl px-4 py-3 text-c-text outline-none"
            >
              <option value="no">Norsk</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="de">Deutsch</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] opacity-60 text-c-muted_text">
            {t("to")}
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value as Lang)}
              className="bg-c-secondary border border-white/5 rounded-2xl px-4 py-3 text-c-text outline-none"
            >
              <option value="no">Norsk</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="de">Deutsch</option>
            </select>
          </label>
        </div>
      </div>

      <div className="relative group">
        <input
          type="text"
          placeholder={t("placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-c-secondary border border-white/5 rounded-2xl px-5 py-5 text-c-text placeholder:text-c-text/20 focus:border-c-brand/50 outline-none transition-all shadow-sm text-lg"
        />
        {loading && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 animate-pulse text-c-brand text-xs font-bold uppercase tracking-widest">
            {t("loading")}
          </div>
        )}
      </div>

      {!loading && data && corrected !== query.trim().toLowerCase() && (
        <div className="text-sm text-c-muted_text px-1">
          {t("didYouMean")} <span className="text-c-brand font-bold">"{corrected}"</span>?
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-30 px-1">{t("translation")}</h3>
          <div className="rounded-3xl border border-white/5 bg-c-secondary p-6 space-y-4">
            <div className="text-sm text-c-muted_text">{t("from")} {LANG_LABELS[sourceLang]} {t("to")} {LANG_LABELS[targetLang]}</div>
            <div className="rounded-3xl border border-white/5 bg-c-secondary/80 px-4 py-5">
              <div className="text-xs uppercase tracking-[0.2em] text-c-muted_text">{t("word")}</div>
              <div className="mt-2 text-2xl font-bold text-c-text">{corrected || "—"}</div>
            </div>
            <div className="rounded-3xl border border-white/5 bg-c-secondary/80 px-4 py-5">
              <div className="text-xs uppercase tracking-[0.2em] text-c-muted_text">{t("translation")}</div>
              <div className="mt-2 text-xl font-semibold text-c-brand">{translation || t("noTranslation")}</div>
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
                <div className="rounded-2xl border-2 border-dashed border-white/5 px-4 py-8 text-center opacity-40 text-sm">
                  {t("noExact")}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {!loading && query && !data && (
        <div className="py-20 text-center opacity-30 italic">
          {t("startSearch")}
        </div>
      )}
    </div>
  );
}

