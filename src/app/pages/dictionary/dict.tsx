import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../../context/LanguageContext";
import { Icon } from "../../../components";

type DictResponse = {
  q: string;
  cnt: number;
  cmatch: number;
  a: { exact: [string, number][]; similar: [string, number][]; };
};

const proEase = [0.4, 0, 0.2, 1];

export default function Dict() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<DictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    if (!query.trim()) {
      setData(null);
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    const timeout = setTimeout(() => {
      setLoading(true);
      invoke<DictResponse>("suggest_word", { query, lang: language })
        .then(setData)
        .finally(() => setLoading(false));
    }, 400);
    return () => clearTimeout(timeout);
  }, [query, language]);

  return (
    <div className="flex flex-col h-full bg-c-primary overflow-hidden font-sans">
      {/* COMPACT SEARCH HEADER */}
      <header className="py-10 px-8 flex flex-col items-center shrink-0 border-b border-c-divider/30">
        <div className="w-full max-w-3xl relative group">
          <Icon src="/search.svg" size="w-5 h-5" className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity" />
          <input
            type="text"
            placeholder="Søk etter ord eller uttrykk..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-c-secondary border border-c-divider rounded-2xl py-4 pl-12 pr-12 text-sm font-medium outline-none focus:border-c-brand/50 focus:bg-c-tertiery transition-all shadow-2xl shadow-black/10"
          />
          {loading && (
            <div className="absolute right-5 top-1/2 -translate-y-1/2 size-4 border-2 border-c-brand border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            {!hasSearched ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.3, ease: proEase }}
                className="grid grid-cols-12 gap-6"
              >
                {/* PRIMARY: WORD OF THE DAY */}
                <div className="col-span-12 lg:col-span-8 bg-c-secondary border border-c-divider rounded-[32px] p-10 flex flex-col justify-between min-h-[340px] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                    <Icon src="/dict.svg" size="w-40 h-40" />
                  </div>
                  <div className="relative z-10">
                    <span className="text-[10px] font-bold tracking-[0.3em] text-c-brand uppercase mb-6 block">Dagens Ord</span>
                    <h2 className="text-5xl font-bold text-c-text mb-3">Vemodig</h2>
                    <p className="text-c-muted_text italic text-base mb-6 opacity-60">/veːmuːdɪ/ • adjektiv</p>
                    <p className="text-c-text/70 text-lg leading-relaxed max-w-xl">
                      En mild form for tristhet eller lengsel, ofte knyttet til minner om noe som er forbi eller som man savner.
                    </p>
                  </div>
                  <button className="relative z-10 w-fit px-6 py-2 bg-c-brand text-white rounded-xl text-xs font-bold tracking-tight hover:brightness-110 transition-all">
                    Se dypere betydning
                  </button>
                </div>

                {/* SECONDARY: RECENT SEARCHES */}
                <div className="col-span-12 lg:col-span-4 bg-c-secondary border border-c-divider rounded-[32px] p-8">
                  <h3 className="text-[10px] font-bold tracking-[0.2em] text-c-text/30 uppercase mb-6">Nylige Søk</h3>
                  <div className="space-y-2">
                    {['Implementering', 'Kognitiv', 'Syntese', 'Parameter'].map(word => (
                      <button key={word} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-c-primary border border-transparent hover:border-c-divider transition-all group">
                        <span className="text-sm font-semibold text-c-text/60 group-hover:text-c-text">{word}</span>
                        <Icon src="/chevron-down.svg" size="w-3 h-3" className="-rotate-90 opacity-20" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* TERTIARY: STATS BENTO */}
                <div className="col-span-12 md:col-span-4 lg:col-span-3 bg-c-tertiery/20 border border-c-divider rounded-3xl p-6 flex flex-col gap-4">
                  <span className="text-[9px] font-bold tracking-widest text-c-text/30 uppercase">Din Aktivitet</span>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-c-brand">124</span>
                    <span className="text-[10px] font-bold text-c-text/40 pb-1.5 uppercase">Ord lært</span>
                  </div>
                  <div className="w-full bg-c-divider h-1 rounded-full overflow-hidden">
                    <div className="bg-c-brand h-full w-[65%]" />
                  </div>
                </div>

                {/* TERTIARY: GRAMMAR TIP */}
                <div className="col-span-12 md:col-span-8 lg:col-span-6 bg-c-brand/5 border border-c-brand/20 rounded-3xl p-6 flex items-start gap-6">
                  <div className="p-3 bg-c-brand/10 rounded-2xl text-c-brand">
                    <Icon src="/notes.svg" size="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-c-text mb-1">Grammatikk-tips</h4>
                    <p className="text-xs text-c-text/50 leading-relaxed">
                      Husk forskjellen på "da" og "når". <span className="text-c-brand font-bold">Da</span> brukes om en hendelse i fortiden, mens <span className="text-c-brand font-bold">når</span> brukes om gjentakende hendelser eller i fremtiden.
                    </p>
                  </div>
                </div>

                {/* TERTIARY: QUICK TRENDS */}
                <div className="col-span-12 lg:col-span-3 bg-c-secondary border border-c-divider rounded-3xl p-6">
                  <h3 className="text-[9px] font-bold tracking-widest text-c-text/30 uppercase mb-4">Populært nå</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Kunstig Intelligens', 'Bærekraft', 'Inovasjon'].map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-c-primary border border-c-divider rounded-lg text-[10px] font-bold text-c-text/50">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              /* RESULTS GRID */
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
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-c-brand">Eksakte Treff</h3>
                  </div>
                  <div className="grid gap-3">
                    {data?.a.exact.map(([word, score]) => (
                      <ResultCard key={word} word={word} score={score} primary />
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <div className="size-1.5 rounded-full bg-c-text/20" />
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-c-text/40">Lignende Ord</h3>
                  </div>
                  <div className="grid gap-3">
                    {data?.a.similar.map(([word, score]) => (
                      <ResultCard key={word} word={word} score={score} />
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

function ResultCard({ word, score, primary }: { word: string; score: number; primary?: boolean }) {
  return (
    <motion.div
      layout
      className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${primary
        ? 'bg-c-secondary border-c-brand/20 hover:border-c-brand shadow-sm'
        : 'bg-c-tertiery/20 border-c-divider hover:bg-c-hover'
        }`}
    >
      <span className={`font-semibold ${primary ? 'text-c-text' : 'text-c-muted_text'}`}>{word}</span>
      <span className="text-[10px] font-mono opacity-30">{(score * 100).toFixed(0)}% Match</span>
    </motion.div>
  );
}

function EmptyResults({ text }: { text: string }) {
  return (
    <div className="p-8 border border-dashed border-c-divider rounded-2xl text-center opacity-40">
      <p className="text-xs font-medium">{text}</p>
    </div>
  );
}