import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";
import { Icon } from "../../../components";

type DictResponse = {
  q: string;
  cnt: number;
  cmatch: number;
  a: {
    exact: [string, number][];
    similar: [string, number][];
  };
};

type Lang = "no" | "en" | "es" | "de";

const proEase = [0.4, 0, 0.2, 1];

const TRANSLATIONS: Record<Lang, any> = {
  no: {
    search: "Søk etter ord eller uttrykk...",
    featured: "Dagens Ord",
    deep: "Se dypere betydning",
    recent: "Nylige Søk",
    history: "Historikk",
    activity: "Din Aktivitet",
    learned: "Ord lært",
    grammar: "Grammatikk-tips",
    popular: "Populært Nå",
    exact: "Eksakte Treff",
    similar: "Lignende Ord",
    adjective: "adjektiv",
    match: "Treff",

    featuredWord: "Vemodig",
    featuredDesc:
      "En stille følelse av lengsel eller nostalgi knyttet til minner og savn.",

    grammarText:
      'Husk forskjellen på "da" og "når". "Da" brukes om en hendelse i fortiden, mens "når" brukes om gjentakende hendelser eller fremtid.',

    recentWords: [
      "Implementering",
      "Kognitiv",
      "Syntese",
      "Parameter",
    ],

    tags: [
      "Kunstig Intelligens",
      "Bærekraft",
      "Innovasjon",
    ],
  },

  en: {
    search: "Search for words or expressions...",
    featured: "Word of the Day",
    deep: "Explore deeper meaning",
    recent: "Recent Searches",
    history: "History",
    activity: "Your Activity",
    learned: "Words Learned",
    grammar: "Grammar Tips",
    popular: "Trending Now",
    exact: "Exact Matches",
    similar: "Similar Words",
    adjective: "adjective",
    match: "Match",

    featuredWord: "Melancholic",
    featuredDesc:
      "A quiet emotional longing tied to memory, nostalgia, or something deeply missed.",

    grammarText:
      'Remember the difference between "then" and "when". "Then" refers to the past while "when" is used for repeated events or the future.',

    recentWords: [
      "Implementation",
      "Cognitive",
      "Synthesis",
      "Parameter",
    ],

    tags: [
      "Artificial Intelligence",
      "Sustainability",
      "Innovation",
    ],
  },

  es: {
    search: "Buscar palabras o expresiones...",
    featured: "Palabra del Día",
    deep: "Explorar significado",
    recent: "Búsquedas Recientes",
    history: "Historial",
    activity: "Tu Actividad",
    learned: "Palabras Aprendidas",
    grammar: "Consejos de Gramática",
    popular: "Popular Ahora",
    exact: "Coincidencias Exactas",
    similar: "Palabras Similares",
    adjective: "adjetivo",
    match: "Coincidencia",

    featuredWord: "Melancólico",
    featuredDesc:
      "Una sensación tranquila de nostalgia o anhelo emocional ligado a recuerdos.",

    grammarText:
      'Recuerda la diferencia entre "entonces" y "cuando".',

    recentWords: [
      "Implementación",
      "Cognitivo",
      "Síntesis",
      "Parámetro",
    ],

    tags: [
      "Inteligencia Artificial",
      "Sostenibilidad",
      "Innovación",
    ],
  },

  de: {
    search: "Nach Wörtern oder Ausdrücken suchen...",
    featured: "Wort des Tages",
    deep: "Tiefere Bedeutung ansehen",
    recent: "Letzte Suchen",
    history: "Verlauf",
    activity: "Deine Aktivität",
    learned: "Gelernte Wörter",
    grammar: "Grammatik-Tipps",
    popular: "Beliebt Jetzt",
    exact: "Exakte Treffer",
    similar: "Ähnliche Wörter",
    adjective: "adjektiv",
    match: "Treffer",

    featuredWord: "Wehmütig",
    featuredDesc:
      "Ein stilles Gefühl von Sehnsucht oder emotionaler Nostalgie.",

    grammarText:
      'Den Unterschied zwischen "dann" und "wann" beachten.',

    recentWords: [
      "Implementierung",
      "Kognitiv",
      "Synthese",
      "Parameter",
    ],

    tags: [
      "Künstliche Intelligenz",
      "Nachhaltigkeit",
      "Innovation",
    ],
  },
};

const THEMES = {
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
};

export default function Dict() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<DictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { language } = useLanguage();
  const { theme } = useTheme();

  const currentTheme =
    THEMES[theme as keyof typeof THEMES] || THEMES.default;

  const t = (key: string) =>
    TRANSLATIONS[language as Lang]?.[key] || key;

  useEffect(() => {
    if (!query.trim()) {
      setData(null);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);

    const timeout = setTimeout(() => {
      setLoading(true);

      invoke<DictResponse>("suggest_word", {
        query,
        lang: language,
      })
        .then(setData)
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timeout);
  }, [query, language]);

  return (
    <div
      className={`
        flex flex-col h-full w-full overflow-y-auto
        relative font-sans custom-scrollbar
        transition-colors duration-500
        ${currentTheme.root}
      `}
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.png')]" />

      <header className="relative z-10 flex flex-col shrink-0 pt-24 pb-14 px-8">
        <div className="w-full max-w-5xl relative group mx-auto">

          <Icon
            src="/search.svg"
            size="w-5 h-5"
            className="
              absolute left-5 top-1/2 -translate-y-1/2
              opacity-30 group-focus-within:opacity-100 transition-opacity
            "
          />

          <input
            type="text"
            placeholder={t("search")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`
              w-full h-16 rounded-3xl backdrop-blur-xl border
              pl-14 pr-14 text-[15px] font-medium outline-none
              transition-all duration-300
              hover:border-white/[0.08]
              focus:border-c-brand/30
              shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_60px_rgba(0,0,0,0.45)]
              ${currentTheme.panel}
            `}
          />

          {loading && (
            <div className="absolute right-5 top-1/2 -translate-y-1/2 size-4 border-2 border-c-brand border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </header>

      <main className="relative z-10 px-8 pb-10">
        <div className="max-w-[1700px] mx-auto">

          <AnimatePresence mode="wait">

            {!hasSearched ? (

              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: proEase }}
                className="grid grid-cols-12 auto-rows-[180px] gap-5"
              >

                {/* FEATURED */}
                <div
                  className={`
                    col-span-12 lg:col-span-7 row-span-2
                    rounded-[32px]
                    overflow-hidden
                    relative
                    border
                    backdrop-blur-2xl
                    p-10
                    transition-all
                    duration-500
                    hover:-translate-y-1
                    hover:shadow-[0_30px_120px_rgba(0,0,0,0.28)]
                    ${currentTheme.panel}
                  `}
                >
                  <div
                    className="absolute inset-0 opacity-80 pointer-events-none"
                    style={{
                      background:
                        theme === "light"
                          ? "radial-gradient(circle at top left, rgba(70,160,120,0.10), transparent 45%)"
                          : theme === "contrast"
                          ? "radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 35%)"
                          : "radial-gradient(circle at top left, rgba(80,200,120,0.14), transparent 40%)",
                    }}
                  />

                  <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:42px_42px]" />

                  <div className="relative z-10 h-full flex flex-col justify-between">

                    <div className="space-y-6">

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-[0.35em] font-black text-c-brand">
                          {t("featured")}
                        </span>

                        <div className="px-3 py-1 rounded-full bg-c-brand/10 border border-c-brand/10 text-[10px] uppercase tracking-wider text-c-brand font-bold">
                          {language.toUpperCase()}
                        </div>
                      </div>

                      <div className="space-y-4">

                        <div className="flex items-end gap-4 flex-wrap">
                          <h2 className="text-5xl md:text-6xl font-black tracking-[-0.04em] leading-none">
                            {t("featuredWord")}
                          </h2>

                          <span className="text-sm opacity-40 italic pb-2">
                            {t("adjective")}
                          </span>
                        </div>

                        <p className="text-[15px] leading-relaxed max-w-2xl opacity-70 font-medium">
                          {t("featuredDesc")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-10">

                      <button
                        className="
                          px-6 py-3 rounded-2xl
                          bg-c-brand text-white text-sm font-bold
                          hover:scale-[1.02]
                          hover:brightness-110
                          transition-all
                        "
                      >
                        {t("deep")}
                      </button>

                      <div className="hidden md:flex items-center gap-2 opacity-30">
                        <div className="w-2 h-2 rounded-full bg-c-brand" />
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* RECENT */}
                <div
                  className={`
                    col-span-12 lg:col-span-5
                    rounded-[24px]
                    backdrop-blur-xl
                    border
                    p-8
                    ${currentTheme.panel}
                  `}
                >

                  <div className="flex items-center justify-between mb-8">

                    <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase opacity-40">
                      {t("recent")}
                    </h3>

                    <span className="text-[10px] text-c-brand font-bold tracking-wider uppercase">
                      {t("history")}
                    </span>
                  </div>

                  <div className="space-y-3">

                    {t("recentWords").map((word: string) => (
                      <button
                        key={word}
                        className="
                          w-full flex items-center justify-between
                          px-5 py-4 rounded-2xl
                          bg-black/10 border border-transparent
                          hover:border-white/[0.06]
                          transition-all group
                        "
                      >

                        <span className="text-sm font-semibold opacity-70 group-hover:opacity-100">
                          {word}
                        </span>

                        <Icon
                          src="/chevron-down.svg"
                          size="w-3 h-3"
                          className="-rotate-90 opacity-30"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* ACTIVITY */}
                <div
                  className={`
                    col-span-12 md:col-span-4 lg:col-span-3
                    rounded-[24px]
                    backdrop-blur-xl border p-6
                    flex flex-col justify-between
                    ${currentTheme.card}
                  `}
                >

                  <span className="text-[10px] tracking-[0.25em] uppercase opacity-40 font-bold">
                    {t("activity")}
                  </span>

                  <div>

                    <div className="flex items-end gap-2 mb-4">

                      <span className="text-5xl font-bold text-c-brand">
                        124
                      </span>

                      <span className="text-[10px] uppercase opacity-30 pb-2 tracking-wider">
                        {t("learned")}
                      </span>
                    </div>

                    <div className="h-1.5 rounded-full overflow-hidden bg-white/[0.04]">
                      <div className="h-full w-[65%] bg-c-brand rounded-full" />
                    </div>
                  </div>
                </div>

                {/* GRAMMAR */}
                <div
                  className="
                    col-span-12 md:col-span-8 lg:col-span-5
                    rounded-[24px]
                    bg-c-brand/5
                    border border-c-brand/10
                    p-7 flex items-start gap-5
                    backdrop-blur-xl
                  "
                >

                  <div className="p-4 rounded-2xl bg-c-brand/10 text-c-brand">
                    <Icon src="/notes.svg" size="w-6 h-6" />
                  </div>

                  <div>

                    <h4 className="text-lg font-semibold mb-2">
                      {t("grammar")}
                    </h4>

                    <p className="text-sm opacity-50 leading-relaxed">
                      {t("grammarText")}
                    </p>
                  </div>
                </div>

                {/* TAGS */}
                <div
                  className={`
                    col-span-12 lg:col-span-4
                    rounded-[24px]
                    backdrop-blur-xl border p-6
                    ${currentTheme.card}
                  `}
                >

                  <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase opacity-40 mb-5">
                    {t("popular")}
                  </h3>

                  <div className="flex flex-wrap gap-2">

                    {t("tags").map((tag: string) => (
                      <span
                        key={tag}
                        className="
                          px-4 py-2 rounded-xl
                          bg-black/20
                          border border-white/[0.04]
                          text-[11px] font-semibold
                          opacity-70
                        "
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

            ) : (

              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: proEase }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >

                <section className="space-y-4">

                  <div className="flex items-center gap-3 px-2">
                    <div className="size-1.5 rounded-full bg-c-brand" />

                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-c-brand">
                      {t("exact")}
                    </h3>
                  </div>

                  <div className="grid gap-3">

                    {data?.a.exact.map(([word, score]) => (
                      <ResultCard
                        key={word}
                        word={word}
                        score={score}
                        primary
                        currentTheme={currentTheme}
                        language={language}
                      />
                    ))}
                  </div>
                </section>

                <section className="space-y-4">

                  <div className="flex items-center gap-3 px-2">
                    <div className="size-1.5 rounded-full bg-white/20" />

                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-40">
                      {t("similar")}
                    </h3>
                  </div>

                  <div className="grid gap-3">

                    {data?.a.similar.map(([word, score]) => (
                      <ResultCard
                        key={word}
                        word={word}
                        score={score}
                        currentTheme={currentTheme}
                        language={language}
                      />
                    ))}
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function ResultCard({
  word,
  score,
  primary,
  currentTheme,
  language,
}: {
  word: string;
  score: number;
  primary?: boolean;
  currentTheme: any;
  language: Lang;
}) {
  const matchText = {
    no: "Treff",
    en: "Match",
    es: "Coincidencia",
    de: "Treffer",
  };

  return (
    <motion.div
      layout
      className={`
        group relative overflow-hidden rounded-2xl
        border p-5 transition-all duration-300
        backdrop-blur-xl
        hover:-translate-y-0.5
        hover:shadow-[0_20px_80px_rgba(0,0,0,0.25)]
        ${
          primary
            ? "border-c-brand/20 hover:border-c-brand/40"
            : currentTheme.card
        }
      `}
    >

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_45%)]" />

      <div className="relative z-10 flex items-center justify-between">

        <span className="font-semibold">
          {word}
        </span>

        <span className="text-[10px] font-mono opacity-30">
          {(score * 100).toFixed(0)}% {matchText[language]}
        </span>
      </div>
    </motion.div>
  );
}