import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Icon } from "../../../components";
import { useLanguage } from "../../../context/LanguageContext";
import { getTranslations } from "../../../utils/translations";

type Lang = "no" | "en" | "es" | "de";

type DictResponse = {
  q: string;
  cnt: number;
  cmatch: number;
  a: {
    exact: [string, number][];
    similar: [string, number][];
  };
};

export default function HomePage() {
  const [files, setFiles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { language } = useLanguage();
  const indexTranslations = getTranslations(language as Lang, 'index');
  const t = (key: string) => indexTranslations[key] || key;

  useEffect(() => {
    let isCurrent = true;
    const delayDebounceFn = setTimeout(() => {
      invoke("search_files", { query: searchQuery })
        .then((foo: any) => {
          if (isCurrent) {
            setFiles(foo.slice(0, 8));
          }
        })
        .catch(console.error);
    }, 150);

    return () => {
      isCurrent = false;
      clearTimeout(delayDebounceFn);
    };
  }, [searchQuery]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-c-main text-c-text">

      <main className="flex flex-col max-w-6xl mx-auto w-full p-8 gap-8">

        <section className="flex">
          <h1 className="text-3xl font-bold tracking-tight">Hei igjen </h1>
        </section>

        <section className="flex">
          <div className="w-full h-[300px] bg-c-brand border border-c-divider rounded-xl p-6 flex items-center justify-center hover:bg-c-light_brand transition-colors cursor-pointer">
            <h1>Stor velkommen til deg</h1>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-row gap-2">
              <Icon src="/stopwatch.svg" size="w-4 h-4" />
              <h3 className="font-semibold">Hurtigtaster</h3>
            </div>
            <button className="text-xs text-c-brand hover:underline font-medium">Rediger</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionCard
              title="Last opp filer"
              desc="Dra og slipp filer her"
              icon="upload"
              color="text-blue-400"
            />
            <QuickActionCard
              title="Nytt notat"
              desc="Start et blankt ark"
              icon="notes"
              color="text-amber-400"
            />
            <QuickActionCard
              title="Oversett"
              desc="Endre språk på dokument"
              icon="translate"
              color="text-emerald-400"
            />
            <QuickActionCard
              title="Oversett"
              desc="Endre språk på dokument"
              icon="translate"
              color="text-emerald-400"
            />
            <QuickActionCard
              title="Oversett"
              desc="Endre språk på dokument"
              icon="translate"
              color="text-emerald-400"
            />
            <QuickActionCard
              title="Oversett"
              desc="Endre språk på dokument"
              icon="translate"
              color="text-emerald-400"
            />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2>Aktuelt</h2>
          <div>
            <div className="w-full h-[300px] bg-c-brand border border-c-divider rounded-xl p-4 flex items-center justify-center hover:bg-c-light_brand transition-colors cursor-pointer">
              <p>hallo</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon src="/clock.svg" size="w-4 h-4" className="opacity-50" />
              <h3 className="font-semibold">Nylige filer</h3>
            </div>
            <button className="text-xs text-c-brand hover:underline font-medium">Se alle</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {files.map((item, i) => (
              <FileCard key={i} item={item} />
            ))}

            {files.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-c-divider rounded-2xl opacity-40">
                <Icon src="/icons/search.svg" size="w-10 h-10" className="mb-2" />
                <p>Ingen filer funnet</p>
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Icon src="/clock.svg" size="w-4 h-4" className="opacity-50" />
                <h3 className="font-semibold">Ordbok</h3>
              </div>
              <button className="text-xs text-c-brand hover:underline font-medium">Søk i ordbok</button>
            </div>
            <Dict />
          </div>
        </section>
      </main>
    </div>
  );
}

function QuickActionCard({ title, desc, icon, color }: any) {
  return (
    <button className="flex items-center gap-4 p-4 rounded-2xl bg-c-secondary border border-c-divider hover:border-c-brand/50 hover:bg-c-tertiary transition-all text-left group">
      <div className={`w-12 h-12 rounded-xl bg-c-main flex items-center justify-center shadow-inner`}>
        <Icon src={`/icons/${icon}.svg`} size="w-6 h-6" className="opacity-80 group-hover:scale-110 transition-transform" />
      </div>
      <div>
        <h4 className="font-bold text-sm">{title}</h4>
        <p className="text-xs opacity-50">{desc}</p>
      </div>
    </button>
  );
}

function FileCard({ item }: { item: any }) {
  return (
    <div className="bg-c-secondary border border-c-divider rounded-xl p-4 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all cursor-pointer group">
      <div className="aspect-video mb-4 bg-c-tertiery rounded-lg flex items-center justify-center relative overflow-hidden">
        <Icon src="/icons/log.svg" size="w-8 h-8" className="opacity-10 group-hover:opacity-20 transition-opacity" />
        <div className="absolute top-2 right-2">
          <Icon src="/favorite.svg" size="w-4 h-4" className="opacity-0 group-hover:opacity-40 hover:!opacity-100" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-4">
          <Icon src="/icons/notes.svg" size="w-3 h-3" className="opacity-40" />
          <h4 className="font-medium text-sm truncate select-all">{item.name}</h4>
        </div>
        <p className="text-xs opacity-40 line-clamp-2 select-all leading-relaxed">
          {item.desc || "Ingen beskrivelse tilgjengelig for denne filen."}
        </p>
      </div>
    </div>
  );
}

function Dict() {
  const [dictQuery, setDictQuery] = useState("");
  const [dictData, setDictData] = useState<DictResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dictQuery.trim()) {
      setDictData(null);
      return;
    }

    const timeout = setTimeout(() => {
      setLoading(true);
      invoke<DictResponse>("suggest_word", { query: dictQuery, dict: "bm" })
        .then((res) => setDictData(res))
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 500);

    return () => clearTimeout(timeout);
  }, [dictQuery]);
  return (
    <div>
      <div className="relative group">
        <input
          type="text"
          placeholder="Søk etter ord..."
          value={dictQuery}
          onChange={(e) => setDictQuery(e.target.value)}
          className="w-full bg-c-secondary border border-white/5 rounded-2xl px-5 py-4 text-c-text placeholder:text-c-text/20 focus:border-c-brand/50 outline-none transition-all shadow-sm"
        />
        {loading && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 animate-pulse text-c-brand text-xs font-bold uppercase tracking-widest">
            Søker...
          </div>
        )}
      </div>

      {
        !loading && dictData && (
          <div className="text-sm text-c-muted_text px-1">
            Fant {dictData.cnt} resultater for <span className="text-c-brand font-bold">"{dictData.q}"</span>
          </div>
        )
      }

      <div className="grid grid-cols-2 gap-8 items-start">

        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-30 px-1">
            Eksakte treff
          </h3>

          <div className="flex flex-col gap-2">
            {dictData?.a.exact.length ? (
              dictData.a.exact.map(([word, score], i) => (
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
                Ingen eksakte treff
              </div>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-30 px-1">
            Lignende ord
          </h3>

          <div className="flex flex-col gap-2">
            {dictData?.a.similar.length ? (
              dictData.a.similar.map(([word, score], i) => (
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

      {
        !loading && dictQuery && !dictData && (
          <div className="py-20 text-center opacity-30 italic">
            Skriv noe for å starte søket...
          </div>
        )
      }
    </div>
  )
}