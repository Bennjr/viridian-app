import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../components";
import "../global.css"

type DictResponse = {
    q: string;
    cnt: number;
    cmatch: number;
    a: { exact: [string, number][]; similar: [string, number][]; };
};

export default function Suggestion({ query = "he" }: { query?: string }) {
    const [data, setData] = useState<DictResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const language = "no"

    useEffect(() => {
        if (!query.trim()) {
            setData(null);
            return;
        }

        const timeout = setTimeout(() => {
            setLoading(true);
            invoke<DictResponse>("suggest_word", { query, lang: language })
                .then((res) => {
                    const exactMatches = res.a.exact.slice(0, 7);
                    setData({ ...res, a: { ...res.a, exact: exactMatches } });
                })
                .catch((err) => console.error("Tauri Error:", err))
                .finally(() => setLoading(false));
        }, 300);

        return () => clearTimeout(timeout);
    }, [query, language]);

    const hasResults = useMemo(() =>
        data && (data.a.exact.length > 0 || data.a.similar.length > 0),
        [data]);

    return (
        <main className="w-full h-full bg-c-primary selection:bg-c-brand/30 overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex items-center justify-center py-10"
                    >
                        <div className="w-5 h-5 border-2 border-white/10 border-t-c-brand rounded-full animate-spin" />
                    </motion.div>
                ) : !query ? (
                    <motion.div className="flex flex-col items-center justify-center py-20 opacity-20">
                        <Icon src="/search.svg" size="w-10 h-10" />
                        <p className="text-sm font-medium mt-4 tracking-widest uppercase">Start typing to search</p>
                    </motion.div>
                ) : hasResults ? (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col w-full p-2 gap-4"
                    >
                        {data?.a.exact.length! > 0 && (
                            <section>
                                <header className="px-3 mb-1">
                                </header>
                                <div className="space-y-1 flex flex-col">
                                    {data?.a.exact.map(([word], i) => (
                                        <SuggestionRow key={`exact-${i}`} word={word} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </motion.div>
                ) : (
                    <motion.div className="flex flex-col items-center justify-center py-20 opacity-20">
                        <p className="text-sm font-medium tracking-widest uppercase">No results found</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

function SuggestionRow({ word }: { word: string; }) {
    return (
        <button
            onClick={() => console.log("Selected:", word)}
            className="text-left py-2 px-3 hover:bg-c-secondary transition-colors"
        >
            {word}
        </button>
    );
}