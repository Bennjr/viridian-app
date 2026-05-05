import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useLanguage } from "../../../context/LanguageContext";
import { getTranslations } from "../../../utils/translations";

type Lang = "no" | "en" | "es" | "de";

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  no: {
    dictionary: "Ordbok",
    searchWords: "Søk etter ord...",
    searching: "Søker...",
    resultsFor: "Fant resultater for",
    exactMatches: "Eksakte treff",
    noExact: "Ingen eksakte treff",
    similarWords: "Lignende ord",
  },
  en: {
    dictionary: "Dictionary",
    searchWords: "Search for words...",
    searching: "Searching...",
    resultsFor: "Found results for",
    exactMatches: "Exact matches",
    noExact: "No exact matches",
    similarWords: "Similar words",
  },
  es: {
    dictionary: "Diccionario",
    searchWords: "Buscar palabras...",
    searching: "Buscando...",
    resultsFor: "Encontrados resultados para",
    exactMatches: "Coincidencias exactas",
    noExact: "No hay coincidencias exactas",
    similarWords: "Palabras similares",
  },
  de: {
    dictionary: "Wörterbuch",
    searchWords: "Nach Wörtern suchen...",
    searching: "Suchen...",
    resultsFor: "Ergebnisse gefunden für",
    exactMatches: "Exakte Treffer",
    noExact: "Keine exakten Treffer",
    similarWords: "Ähnliche Wörter",
  },
};

type DictResponse = {
  q: string;
  cnt: number;
  cmatch: number;
  a: {
    exact: [string, number][];
    similar: [string, number][];
  };
};

export default function Dict() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<DictResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const { language } = useLanguage();
  const t = (key: string) => TRANSLATIONS[language][key] || key;

  // Reset data when language changes
  useEffect(() => {
    setData(null);
  }, [language]);

  useEffect(() => {
    if (!query.trim()) {
      setData(null);
      return;
    }

    const timeout = setTimeout(() => {
      setLoading(true);
      invoke<DictResponse>("suggest_word", { query: query, lang: language })
        .then((res) => setData(res))
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 500);

    return () => clearTimeout(timeout);
  }, [query, language]);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl tracking-tight">{t("dictionary")}</h2>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <input
          type="text"
          placeholder={t("searchWords")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-c-secondary border border-white/5 rounded-2xl px-5 py-4 text-c-text placeholder:text-c-text/20 focus:border-c-brand/50 outline-none transition-all shadow-sm"
        />
        {loading && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 animate-pulse text-c-brand text-xs font-bold uppercase tracking-widest">
            {t("searching")}
          </div>
        )}
      </div>

      {/* Result Info (Spans full width) */}
      {!loading && data && (
        <div className="text-sm text-c-muted_text px-1">
          {t("resultsFor")} <span className="text-c-brand font-bold">"{data.q}"</span>
        </div>
      )}

      {/* Two Column Content Area */}
      <div className="grid grid-cols-2 gap-8 items-start">

        {/* LEFT COLUMN: Exact Matches */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-30 px-1">
            {t("exactMatches")}
          </h3>

          <div className="flex flex-col gap-2">
            {data?.a.exact.length ? (
              data.a.exact.map(([word, score], i) => (
                <div
                  key={`exact-${word}-${i}`}
                  className="flex justify-between items-center bg-c-secondary border border-white/5 rounded-xl px-4 py-3 hover:border-c-brand/30 hover:bg-c-secondary/80 transition-all group"
                >
                  <span className="font-bold text-c-text group-hover:text-c-brand transition-colors">{word}</span>
                  <span className="text-[10px] font-mono opacity-20 group-hover:opacity-100">{score}</span>
                </div>
              ))
            ) : (
              <div className="p-8 border-2 border-dashed border-white/5 rounded-2xl text-center opacity-20 text-sm">
                {t("noExact")}
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: Similar Matches */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-30 px-1">
            {t("similarWords")}
          </h3>

          <div className="flex flex-col gap-2">
            {data?.a.similar.length ? (
              data.a.similar.map(([word, score], i) => (
                <div
                  key={`similar-${word}-${i}`}
                  className="flex justify-between items-center bg-c-secondary/40 border border-white/5 rounded-xl px-4 py-3 hover:border-c-brand/30 transition-all group"
                >
                  <span className="text-c-text/80 group-hover:text-c-text transition-colors">{word}</span>
                  <span className="text-[10px] font-mono opacity-20">{score}</span>
                </div>
              ))
            ) : (
              <div className="p-8 border-2 border-dashed border-white/5 rounded-2xl text-center opacity-20 text-sm">
                Ingen lignende ord
              </div>
            )}
          </div>
        </section>

      </div>

      {/* Empty State */}
      {!loading && query && !data && (
        <div className="py-20 text-center opacity-30 italic">
          Skriv noe for å starte søket...
        </div>
      )}
    </div>
  );
}