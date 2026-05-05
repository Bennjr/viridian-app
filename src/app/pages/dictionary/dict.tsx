import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useLanguage } from "../../../context/LanguageContext";

type Lang = "no" | "en" | "es" | "de";

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  no: {
    dictionary: "Ordbok",
    subtitle: "Utforsk ord, oppdagelsene deres betydning og variasjoner",
    searchWords: "Søk etter ord...",
    searching: "Søker...",
    resultsFor: "Fant resultater for",
    exactMatches: "Eksakte treff",
    noExact: "Ingen eksakte treff",
    similarWords: "Lignende ord",
    emptyTitle: "Klar til å utforske?",
    emptyDescription: "Skriv et ord i søkefeltet for å finne eksakte treff og lignende ord",
    noSimilarWords: "Ingen lignende ord funnet",
    results: "resultater",
  },
  en: {
    dictionary: "Dictionary",
    subtitle: "Explore words, discover their meanings and variations",
    searchWords: "Search for words...",
    searching: "Searching...",
    resultsFor: "Found results for",
    exactMatches: "Exact matches",
    noExact: "No exact matches",
    similarWords: "Similar words",
    emptyTitle: "Ready to explore?",
    emptyDescription: "Type a word in the search box to find exact matches and similar words",
    noSimilarWords: "No similar words found",
    results: "results",
  },
  es: {
    dictionary: "Diccionario",
    subtitle: "Explora palabras, descubre sus significados y variaciones",
    searchWords: "Buscar palabras...",
    searching: "Buscando...",
    resultsFor: "Encontrados resultados para",
    exactMatches: "Coincidencias exactas",
    noExact: "No hay coincidencias exactas",
    similarWords: "Palabras similares",
    emptyTitle: "¿Listo para explorar?",
    emptyDescription: "Escribe una palabra en el cuadro de búsqueda para encontrar coincidencias exactas y palabras similares",
    noSimilarWords: "No se encontraron palabras similares",
    results: "resultados",
  },
  de: {
    dictionary: "Wörterbuch",
    subtitle: "Erkunde Wörter, entdecke ihre Bedeutungen und Variationen",
    searchWords: "Nach Wörtern suchen...",
    searching: "Suchen...",
    resultsFor: "Ergebnisse gefunden für",
    exactMatches: "Exakte Treffer",
    noExact: "Keine exakten Treffer",
    similarWords: "Ähnliche Wörter",
    emptyTitle: "Bereit zum Erkunden?",
    emptyDescription: "Geben Sie ein Wort in das Suchfeld ein, um genaue Treffer und ähnliche Wörter zu finden",
    noSimilarWords: "Keine ähnlichen Wörter gefunden",
    results: "Ergebnisse",
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
  const [hasSearched, setHasSearched] = useState(false);

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

    setHasSearched(true);
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
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      {/* Header with subtitle */}
      <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="font-black text-4xl bg-gradient-to-r from-c-brand to-c-brand/60 bg-clip-text text-transparent">
          {t("dictionary")}
        </h1>
        <p className="text-sm text-c-text/50">{t("subtitle")}</p>
      </div>

      {/* Enhanced Search Bar */}
      <div className="relative group animate-in fade-in slide-in-from-top-2 duration-500 delay-100">
        <div className="absolute inset-0 bg-gradient-to-r from-c-brand/20 to-c-brand/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        
        <div className="relative flex items-center gap-2">
          <svg className="absolute left-4 w-5 h-5 text-c-brand/40 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          <input
            type="text"
            placeholder={t("searchWords")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-5 py-4 bg-c-secondary border-2 border-white/5 rounded-2xl text-c-text placeholder:text-c-text/30 focus:border-c-brand/50 focus:bg-c-secondary/80 outline-none transition-all shadow-lg"
          />
          
          {loading && (
            <div className="absolute right-5 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-c-brand animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-c-brand animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-c-brand animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Stats */}
      {!loading && data && (
        <div className="flex items-center gap-2 px-1 text-sm animate-in fade-in duration-300">
          <span className="text-c-text/60">{t("resultsFor")}</span>
          <span className="font-bold text-c-brand text-base">{data.q}</span>
          <span className="text-c-text/40">•</span>
          <span className="text-c-text/40">{data.a.exact.length + data.a.similar.length} {t("results")}</span>
        </div>
      )}

      {/* Two Column Content Area */}
      {hasSearched && (
        <div className="grid grid-cols-2 gap-8 items-start animate-in fade-in duration-500">

          {/* LEFT COLUMN: Exact Matches */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-c-brand to-transparent rounded-full" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-c-brand/80">
                {t("exactMatches")}
              </h3>
              {data?.a.exact.length ? (
                <span className="ml-auto text-xs font-bold bg-c-brand/20 text-c-brand px-2 py-1 rounded-full">
                  {data.a.exact.length}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              {data?.a.exact.length ? (
                data.a.exact.map(([word, score], i) => (
                  <div
                    key={`exact-${word}-${i}`}
                    className="group relative animate-in fade-in slide-in-from-left-4 duration-500 overflow-hidden"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-c-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                    
                    <div className="relative flex justify-between items-center bg-c-secondary border border-white/5 rounded-xl px-4 py-3.5 hover:border-c-brand/50 hover:bg-c-secondary/95 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-c-brand/10">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-c-brand opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span className="font-semibold text-c-text group-hover:text-c-brand transition-colors duration-200">
                          {word}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <span className="text-[10px] font-mono opacity-40 group-hover:opacity-100 transition-opacity duration-200">
                          {(score * 100).toFixed(0)}%
                        </span>
                        <svg className="w-4 h-4 text-c-brand/0 group-hover:text-c-brand/60 transition-all duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 border-2 border-dashed border-c-brand/20 rounded-2xl text-center animate-in fade-in duration-300">
                  <div className="text-3xl mb-2">🔍</div>
                  <p className="text-sm text-c-text/40">{t("noExact")}</p>
                </div>
              )}
            </div>
          </section>

          {/* RIGHT COLUMN: Similar Matches */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-c-brand/60 to-transparent rounded-full opacity-60" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-c-text/70">
                {t("similarWords")}
              </h3>
              {data?.a.similar.length ? (
                <span className="ml-auto text-xs font-bold bg-white/5 text-c-text/60 px-2 py-1 rounded-full">
                  {data.a.similar.length}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              {data?.a.similar.length ? (
                data.a.similar.map(([word, score], i) => (
                  <div
                    key={`similar-${word}-${i}`}
                    className="group relative animate-in fade-in slide-in-from-right-4 duration-500 overflow-hidden"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-l from-c-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                    
                    <div className="relative flex justify-between items-center bg-c-secondary/40 border border-white/5 rounded-xl px-4 py-3.5 hover:border-white/20 hover:bg-c-secondary/60 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-white/5">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-1 h-1 rounded-full bg-c-text/30 group-hover:bg-c-text/60 transition-all" />
                        <span className="text-c-text/80 group-hover:text-c-text transition-colors duration-200">
                          {word}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <span className="text-[10px] font-mono opacity-30 group-hover:opacity-60 transition-opacity duration-200">
                          {(score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 border-2 border-dashed border-white/5 rounded-2xl text-center animate-in fade-in duration-300">
                  <div className="text-3xl mb-2">✨</div>
                  <p className="text-sm text-c-text/40">{t("noSimilarWords")}</p>
                </div>
              )}
            </div>
          </section>

        </div>
      )}

      {/* Empty State */}
      {!loading && !hasSearched && (
        <div className="py-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-4 text-5xl">📚</div>
          <h3 className="text-lg font-bold text-c-text mb-2">{t("emptyTitle")}</h3>
          <p className="text-c-text/50">{t("emptyDescription")}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && hasSearched && (
        <div className="py-16 text-center animate-in fade-in duration-300">
          <div className="inline-block">
            <div className="w-12 h-12 border-2 border-c-brand/20 border-t-c-brand rounded-full animate-spin" />
          </div>
          <p className="text-c-text/50 mt-4 text-sm">{t("searching")}</p>
        </div>
      )}
    </div>
  );
}