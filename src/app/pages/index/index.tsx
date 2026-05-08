import { useEffect, useState, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../../components";
import { useLanguage } from "../../../context/LanguageContext";
import { getTranslations } from "../../../utils/translations";

type Lang = "no" | "en" | "es" | "de" | "fr" | "ru" | "lt" | "ar";

const RECENT_BOOKS = [
  { title: "Fokus Samfunnskunnskap", author: "Aschehoug", progress: 65 },
  { title: "Atomic Habits", author: "James Clear", progress: 22 },
  { title: "Deep Work", author: "Cal Newport", progress: 89 },
];

export default function HomePage() {
  const [files, setFiles] = useState<any[]>([]);
  const [searchQuery] = useState("");
  const { language } = useLanguage();
  const indexTranslations = getTranslations(language as Lang, 'index');
  const t = (key: string) => indexTranslations[key] || key;

  useEffect(() => {
    let isCurrent = true;
    invoke("search_files", { query: searchQuery })
      .then((foo: any) => isCurrent && setFiles(foo.slice(0, 8)))
      .catch(console.error);
    return () => { isCurrent = false; };
  }, [searchQuery]);

  return (
    <div className="flex-1 h-full w-full bg-c-main text-c-text overflow-y-auto custom-scrollbar selection:bg-c-brand/30">
      <main className="max-w-6xl mx-auto w-full p-8 lg:p-12 space-y-16">

        {/* 1. Dashboard Header: Welcome + Stats Combined */}
        <header className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
          <div className="lg:col-span-2 space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-c-brand opacity-80">Dashboard Overview</p>
            <h1 className="text-5xl font-black tracking-tighter italic">{t("welcomeBack")}</h1>
          </div>
          <div className="flex gap-3">
            <QuickStatCard title="Total Files" value="256" icon="files" />
            <QuickStatCard title="Storage" value="1.2GB" icon="database" />
          </div>
        </header>

        {/* 2. Quick Actions: Clean Grid with Hover Effects */}
        <section className="space-y-6">
          <header className="flex justify-between items-center border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-c-brand animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-widest opacity-40">{t("quickActions")}</h3>
            </div>
          </header>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <QuickActionCard title={t("uploadFiles")} icon="upload" color="bg-blue-500" />
            <QuickActionCard title={t("newNote")} icon="notes" color="bg-amber-500" />
            <QuickActionCard title={t("translate")} icon="translate" color="bg-emerald-500" />
            <QuickActionCard title="History" icon="clock" color="bg-purple-500" />
            <QuickActionCard title="Settings" icon="settings" color="bg-zinc-500" />
            <QuickActionCard title="Library" icon="book" color="bg-rose-500" />
          </div>
        </section>

        <section className="space-y-6">
          <header className="flex justify-between items-center border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-c-brand animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-widest opacity-40">Fortsett å lese</h3>
            </div>
            <button className="text-[10px] font-bold uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity">Bibliotek →</button>
          </header>

          {/* Horizontal Scroll Container */}
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x -mx-4 px-4">
            {RECENT_BOOKS.map((book, i) => (
              <div key={i} className="snap-start shrink-0">
                <LibraryBook
                  title={book.title}
                  author={book.author}
                  progress={book.progress}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <header className="flex justify-between items-end">
            <h3 className="text-xs font-black uppercase tracking-widest opacity-40">{t("recentFiles")}</h3>
            <button className="text-[10px] font-bold uppercase tracking-tighter opacity-30 hover:opacity-100 transition-opacity">
              {t("seeAll")} →
            </button>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {files.map((item, i) => (
              <FileCard key={i} item={item} index={i} />
            ))}
            {files.length === 0 && <EmptyState t={t} />}
          </div>
        </section>

        {/* 4. Dictionary Widget: Integrated Look */}
        <section className="bg-c-secondary/30 rounded-[2rem] border border-white/5 p-8 lg:p-10">
          <header className="mb-8 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest opacity-40">{t("dictionary")}</h3>
            <div className="size-8 rounded-full bg-white/5 flex items-center justify-center">
              <Icon src="/search.svg" size="w-3 h-3" className="opacity-20" />
            </div>
          </header>
          <Dict t={t} language={language} />
        </section>

      </main>
    </div>
  );
}

/* --- Refined Sub-Components --- */

function QuickStatCard({ title, value }: any) {
  return (
    <div className="flex-1 bg-c-secondary/50 border border-white/5 rounded-2xl p-4 transition-all hover:bg-c-secondary">
      <Icon src={`/icons/${icon}.svg`} size="w-6 h-6" className="opacity-70" />
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-20 mb-1">{title}</p>
        <p className="text-2xl font-black text-white leading-none">{value}</p>
      </div>
    </div>
  )
}

function LibraryBook({ title, author, progress }: any) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group cursor-pointer flex flex-col w-40"
    >
      <div className="relative aspect-[2/3] w-full rounded-r-xl rounded-l-sm overflow-hidden shadow-lg bg-zinc-900 border border-white/5">
        <img
          src="https://les.unibok.no/bookresource/publisher/aschehoug/book/9788203406829/epub/5516/OEBPS/image/Fokus_samfkunnsk/nb/FOKUS_samfunnskunnskap.jpg"
          className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
          alt={title}
        />

        {/* Spine/Edge Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/30 blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        </div>

        {/* Progress Bar overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1.5 bg-gradient-to-t from-black via-black/40 to-transparent">
          <div className="flex justify-between items-center text-[9px] font-black text-white/50 uppercase tracking-tighter">
            <span>{progress}% ferdig</span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-c-brand shadow-[0_0_8px_var(--c-brand)]"
            />
          </div>
        </div>
      </div>

      <div className="pt-3 px-1">
        <h4 className="text-xs font-bold truncate group-hover:text-c-brand transition-colors">{title}</h4>
        <p className="text-[10px] font-medium opacity-30 uppercase tracking-widest">{author}</p>
      </div>
    </motion.div>
  );
}

function QuickActionCard({ title, icon, color }: any) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-c-secondary/30 border border-white/5 hover:border-c-brand/40 transition-all group"
    >
      <div className={`size-12 rounded-xl ${color} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon src={`/icons/${icon}.svg`} size="w-5 h-5" color={color.replace('bg-', 'bg-')} />
      </div>
      <span className="text-[11px] font-bold opacity-60 group-hover:opacity-100">{title}</span>
    </motion.button>
  );
}

function FileCard({ item, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group cursor-pointer bg-c-secondary/40 border border-white/5 rounded-2xl p-4 hover:bg-c-secondary transition-all"
    >
      <div className="aspect-[4/3] mb-4 bg-zinc-900 rounded-xl flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-c-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Icon src="/icons/log.svg" size="w-10 h-10" className="opacity-10" />
      </div>
      <h4 className="font-bold text-sm truncate mb-1">{item.name}</h4>
      <p className="text-[11px] font-medium opacity-30 line-clamp-1">{item.desc || "No description provided"}</p>
    </motion.div>
  );
}

function EmptyState({ t }: any) {
  return (
    <div className="col-span-full py-20 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]">
      <Icon src="/icons/search.svg" size="w-12 h-12" className="opacity-10 mb-4" />
      <p className="text-xs font-bold uppercase tracking-widest opacity-20">{t("noFilesFound")}</p>
    </div>
  )
}

function Dict({ t, language }: { t: (key: string) => string; language: string }) {
  const [dictQuery, setDictQuery] = useState("");
  const [dictData, setDictData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dictQuery.trim()) { setDictData(null); return; }
    const timeout = setTimeout(() => {
      setLoading(true);
      invoke<any>("suggest_word", { query: dictQuery, lang: language })
        .then((res) => {
          res.a.exact = res.a.exact.slice(0, 5);
          res.a.similar = res.a.similar.slice(0, 5);
          setDictData(res);
        })
        .finally(() => setLoading(false));
    }, 400);
    return () => clearTimeout(timeout);
  }, [dictQuery, language]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-6">
        <div className="relative">
          <input
            type="text"
            placeholder={t("searchWords")}
            value={dictQuery}
            onChange={(e) => setDictQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-lg font-medium outline-none focus:border-c-brand/50 transition-all"
          />
          {loading && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              <div className="size-4 border-2 border-c-brand/30 border-t-c-brand rounded-full animate-spin" />
            </div>
          )}
        </div>
        {dictData && (
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-30 ml-2">
            {dictData.cnt} Results found for <span className="text-c-brand">"{dictData.q}"</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <DictSection title="Exact Matches" data={dictData?.a.exact} isExact />
        <DictSection title="Similar Words" data={dictData?.a.similar} />
      </div>
    </div>
  )
}

function DictSection({ title, data, isExact }: any) {
  return (
    <div className="space-y-3">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-20 ml-1">{title}</h4>
      <div className="space-y-1">
        {data?.length ? data.map(([word, score]: any) => (
          <div key={word} className="flex justify-between items-center bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl px-4 py-3 transition-all cursor-default group">
            <span className={`text-sm font-bold ${isExact ? 'text-white' : 'text-zinc-500'} group-hover:text-c-brand transition-colors`}>{word}</span>
            <span className="text-[9px] font-mono opacity-20">{score}</span>
          </div>
        )) : (
          <div className="h-24 border border-dashed border-white/5 rounded-xl flex items-center justify-center opacity-10 text-[10px] uppercase font-bold tracking-widest">Empty</div>
        )}
      </div>
    </div>
  )
}