import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "../../global.css";
import { Icon } from "../../../components";
import { SingleFileView } from "../../../components/lib_ops/lib_ops";
import { useLanguage } from "../../../context/LanguageContext";
import { getTranslations } from "../../../utils/translations";

type Lang = "no" | "en" | "es" | "de";

// "name": "something"
// "path": "something"
// "desc": "something"
// "type": "filetype"

const FileViewer = ({ label, path, onClose }: any) => {
    const [content, setContent] = useState("");

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const textContent = await invoke<string>("get_content", { path: path });
                setContent(textContent);
            } catch (error) {
                console.error("Failed to fetch content:", error);
            }
        };
        if (path) fetchContent();
    }, [path]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-10 transition-all duration-200">
            <div className="bg-c-primary border-white/10 overflow-hidden flex flex-col h-screen w-screen">
                <div className="bg-c-secondary p-5 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Icon src="/folder.svg" color="bg-c-brand" size="w-5 h-5" />
                        <h2 className="text-xl font-bold tracking-tight">{label}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="size-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors opacity-50 hover:opacity-100"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 bg-c-primary p-4">
                    <textarea
                        className="w-full h-full bg-c-tertiery p-6 rounded-xl text-c-text leading-relaxed outline-none resize-none scrollbar-none border border-white/5"
                        onChange={(e) => setContent(e.target.value)}
                        value={content}
                        spellCheck={false}
                    />
                    {content ?
                        <div className="absolute bottom-3 right-3 absolute p-2 text-white transition-all ">
                            <button onClick={() => setContent("")}>{("clear")}</button>
                        </div>
                        : <div></div>}
                </div>
            </div>
        </div>
    );
}

const FILTERS = [
    { id: 'fav', key: 'favorites', icon: '/favorite.svg' },
    { id: 'time', key: 'time', icon: '/clock.svg' },
    { id: 'type', key: 'fileType', icon: '/folder.svg' },
];

export default function LibraryFullGrid({ goDashboard }: { goDashboard: () => void }) {
    const [files, setFiles] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState('time');
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    const { language } = useLanguage();
    const libraryTranslations = getTranslations(language as Lang, 'library');
    const t = (key: string) => libraryTranslations[key] || key;

    useEffect(() => {
        const savedFavorites = localStorage.getItem('library-favorites');
        if (savedFavorites) {
            setFavorites(new Set(JSON.parse(savedFavorites)));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('library-favorites', JSON.stringify([...favorites]));
    }, [favorites]);

    const toggleFavorite = (filePath: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(filePath)) {
                newFavorites.delete(filePath);
            } else {
                newFavorites.add(filePath);
            }
            return newFavorites;
        });
    };

    useEffect(() => {
        let isCurrent = true;
        invoke("search_files", { query: searchQuery })
            .then((data: any) => {
                if (isCurrent && Array.isArray(data)) {
                    let processedFiles = data.slice(0, 50);

                    if (activeFilter === 'time') {
                        processedFiles.sort((a, b) => {
                            return b.name.length - a.name.length;
                        });
                    }

                    setFiles(processedFiles);
                }
            })
            .catch(console.error);

        return () => { isCurrent = false; };
    }, [searchQuery, activeFilter]);

    return (
        <div className="flex flex-col gap-6 text-c-text animate-in fade-in slide-in-from-right-10">
            <header className="top-0 z-50 w-full border-b border-c-divider bg-c-tertiery rounded-lg backdrop-blur-md p-4">
                <div className="px-4 py-4 space-y-4">

                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-white">{t("library")}</h1>
                        </div>
                        <button className="bg-c-brand hover:bg-c-brand/90 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-c-brand/20">
                            {t("upload")}
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1 group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Icon src="/search.svg" size="w-4 h-4" className="opacity-40 group-focus-within:opacity-100 group-focus-within:text-c-brand transition-opacity" />
                            </div>
                            <input
                                type="text"
                                placeholder={t("searchLibrary")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-c-brand/50 focus:border-c-brand/50 transition-all placeholder:text-white/20"
                            />
                        </div>

                        <nav className="flex bg-black/20 border border-white/5 p-1 rounded-xl w-fit">
                            {FILTERS.map((f) => {
                                const isActive = activeFilter === f.id;
                                return (
                                    <button
                                        key={f.id}
                                        onClick={() => setActiveFilter(f.id)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${isActive
                                            ? 'bg-c-brand text-white shadow-sm'
                                            : 'text-white/40 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {t(f.key)}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </header>

            <main className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 pb-20 p-8">
                {files
                    .filter(item => {
                        if (activeFilter === 'fav') {
                            return favorites.has(item.path);
                        }
                        return true; // Show all for 'time' and 'type' filters
                    })
                    .map((item: any) => (
                        <div
                            key={item.path}
                            onClick={() => setSelectedFile(item)}
                            className="group cursor-pointer flex flex-col bg-white/[0.02] border border-white/5 rounded-lg overflow-hidden transition-all hover:border-c-brand/40 hover:bg-white/[0.04] relative"
                        >
                            {/* Favorite star */}
                            <button
                                onClick={(e) => toggleFavorite(item.path, e)}
                                className="absolute top-2 right-2 z-10 p-1 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
                            >
                                <Icon
                                    src="/favorite.svg"
                                    size="w-4 h-4"
                                    color={favorites.has(item.path) ? "bg-yellow-400" : "bg-white/40"}
                                    className={favorites.has(item.path) ? "drop-shadow-sm" : ""}
                                />
                            </button>

                            <div className="bg-black/20 aspect-video flex flex-col items-center justify-center relative">
                                <Icon src="/folder.svg" size="w-10 h-10" className="opacity-[0.03] group-hover:opacity-10 transition-opacity" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-[0.03] mt-2 group-hover:opacity-10 transition-opacity">
                                    {t("preview")}
                                </span>
                            </div>

                            <div className="p-4 bg-white/[0.01]">
                                <h2 className="font-semibold text-sm truncate opacity-80 group-hover:opacity-100 transition-opacity">
                                    {item.name}
                                </h2>
                                <p className="text-[10px] font-bold opacity-20 uppercase tracking-widest mt-1">
                                    {t("document")}
                                </p>
                            </div>
                        </div>
                    ))}
            </main>

            {selectedFile && (
                <FileViewer
                    label={selectedFile.name}
                    path={selectedFile.path}
                    onClose={() => setSelectedFile(null)}
                />
            )}
            <SingleFileView files={files} setContent={(content) => FileViewer(content)} onClose={() => setSelectedFile(null)} />
        </div>
    );
}