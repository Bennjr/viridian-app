import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Icon } from "../../../components";

export default function HomePage() {
  const [files, setFiles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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
      <header
        data-tauri-drag-region
        className="h-16 flex items-center justify-between px-8 sticky top-0 z-50 bg-c-main/80 backdrop-blur-md border-b border-c-divider"
      >
        <div className="flex items-center gap-2 pointer-events-none">
          <Icon src="/icons/home.svg" size="w-4 h-4" color="bg-c-brand" />
          <h2 className="text-sm font-medium opacity-70">Hjem</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Icon src="/icons/search.svg" size="w-4 h-4" className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" />
            <input
              type="text"
              placeholder="Hurtigsøk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-c-secondary/50 border border-c-divider rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-c-brand w-48 focus:w-64 transition-all"
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full p-8 space-y-10">

        <section className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Hei igjen! 👋</h1>
          <p className="text-c-text/50">Hva vil du utrette i dag?</p>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Hurtigtaster</h3>
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

        <section className="space-y-4">
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
          <Icon src="/icons/favorite.svg" size="w-4 h-4" className="opacity-0 group-hover:opacity-40 hover:!opacity-100" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Icon src="/icons/notes.svg" size="w-3 h-3" className="opacity-40" />
          <h4 className="font-medium text-sm truncate select-all">{item.name}</h4>
        </div>
        <p className="text-xs opacity-40 line-clamp-2 select-all leading-relaxed">
          {item.desc || "Ingen beskrivelse tilgjengelig for denne filen."}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-c-divider flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest opacity-30 font-bold">Dokument</span>
        <Icon src="/icons/arrow-right.svg" size="w-3 h-3" className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
      </div>
    </div>
  );
}