import { useEffect, useState, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Icon } from "../../../components";
import { useLanguage } from "../../../context/LanguageContext";
import { getTranslations } from "../../../utils/translations";
import { NavLink } from "react-router-dom";

type FileItem = { name: string; path: string; type: string; content?: string };

export default function LibraryFullGrid() {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    const { language } = useLanguage();
    const t = (key: string) => getTranslations(language as any, 'library')[key] || key;

    useEffect(() => {
        const fetch = async () => {
            const data = await invoke<FileItem[]>("search_files", { query: searchQuery });
            setFiles(Array.isArray(data) ? data : []);
        };
        const timer = setTimeout(fetch, 200);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    return (
        <div className="flex h-full w-full bg-c-primary overflow-hidden">

            <main className="flex-1 flex flex-col min-w-0 border-r border-white/5">
                <header className="h-16 flex items-center justify-between px-6 bg-c-primary/50 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4 flex-1">
                        <NavLink to="/library" className="p-2 hover:bg-c-secondary rounded-full transition-colors">
                            <Icon src="/chevron-down.svg" className="rotate-90" />
                        </NavLink>
                        <div className="relative w-full max-w-md group">
                            <Icon src="/search.svg" size="w-4 h-4" className="absolute left-0 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity" />
                            <input
                                type="text"
                                placeholder={t("searchLibrary").toUpperCase()}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-c-secondary p-3 rounded-xl border-none pl-8 text-[11px] font-black tracking-[0.1em] outline-none placeholder:text-white/10"
                            />
                        </div>
                    </div>

                    <button className="flex items-center gap-2 bg-c-brand text-white px-4 py-1.5 rounded-lg text-[10px] font-black tracking-tighter hover:brightness-110 active:scale-95 transition-all">
                        <span>UPLOAD</span>
                        <Icon src="/upload.svg" size="w-3 h-3" color="bg-white" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
                        {files.map((file) => (
                            <FileBentoCard
                                key={file.path}
                                file={file}
                                isActive={selectedFile?.path === file.path}
                                isFav={favorites.has(file.path)}
                                onClick={() => setSelectedFile(file)}
                                onToggleFav={() => {
                                    const next = new Set(favorites);
                                    next.has(file.path) ? next.delete(file.path) : next.add(file.path);
                                    setFavorites(next);
                                }}
                            />
                        ))}
                    </div>
                </div>
            </main>

            {/* 2. RIGHT SIDEBAR: The Inspector */}
            <aside className="w-72 bg-c-secondary flex flex-col border-l border-white/5 shadow-2xl">
                {selectedFile ? (
                    <InspectorView
                        file={selectedFile}
                        onClose={() => setSelectedFile(null)}
                    />
                ) : (
                    <GlobalStatsView files={files} />
                )}
            </aside>
        </div>
    );
}

/**
 * FILE CARD: High density, tactile feel
 */
function FileBentoCard({ file, isActive, isFav, onClick, onToggleFav }: any) {
    return (
        <div
            onClick={onClick}
            className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${isActive
                ? 'bg-c-brand/10 border-c-brand/50 ring-1 ring-c-brand/50'
                : 'bg-c-tertiery border-white/5 hover:border-white/10 hover:bg-c-tertiery/80'
                }`}
        >
            <div className="flex justify-between items-start mb-6">
                <div className={`p-2 rounded-xl ${isActive ? 'bg-c-brand text-white' : 'bg-c-primary text-white/20 group-hover:text-white/60'} transition-colors`}>
                    <Icon src="/file-text.svg" size="w-5 h-5" />
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
                    className={`p-1.5 rounded-lg transition-colors ${isFav ? 'bg-yellow-500/10' : 'hover:bg-white/5'}`}
                >
                    <Icon src="/favorite.svg" size="w-3.5 h-3.5" color={isFav ? "bg-yellow-500" : "bg-white/10"} />
                </button>
            </div>

            <h3 className="text-[11px] font-bold truncate leading-none mb-1 text-white/90">{file.name}</h3>
            <span className="text-[9px] font-black opacity-20 uppercase tracking-widest">{file.type || 'RAW'}</span>

            {isActive && (
                <div className="absolute top-2 right-2 flex gap-1">
                    <div className="size-1 rounded-full bg-c-brand animate-pulse" />
                </div>
            )}
        </div>
    );
}

function InspectorView({ file, isFav, onToggleFav, onClose }: any) {
    const formatDate = (ts: number) => new Date(ts * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const formatSize = (bytes: number) => bytes > 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(2)} MB` : `${(bytes / 1024).toFixed(1)} KB`;

    const handleOpenPath = async (filePath: string) => {
        try {
            await invoke("show_in_folder", { path: filePath });
        } catch (err) {
            console.error("Could not open path:", err);
        }
    };

    return (
        <div className="flex flex-col h-full animate-in slide-in-from-right duration-300 fixed">
            <div className="p-4 flex justify-between items-center border-b border-white/5 bg-white/[0.01]">
                <span className="text-[9px] font-black tracking-[0.2em] text-white/20 uppercase">File Metadata</span>
                <button onClick={onClose} className="size-6 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors opacity-40">✕</button>
            </div>

            <div className="p-6">
                <div className="aspect-[4/3] bg-c-primary rounded-2xl mb-6 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
                    <Icon src="/file-text.svg" size="w-10 h-10" className="opacity-10 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-c-secondary via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 flex gap-2">
                        <div className="px-2 py-0.5 rounded bg-c-brand text-[8px] font-black text-white uppercase">{file.type}</div>
                    </div>
                </div>

                <div className="flex justify-between items-start gap-4 mb-8">
                    <div className="min-w-0">
                        <h2 className="text-sm font-black text-white truncate leading-tight mb-1">{file.name}</h2>
                        <p className="text-[9px] font-mono opacity-20 break-all leading-relaxed lowercase">{file.path}</p>
                    </div>
                    <button onClick={onToggleFav} className="shrink-0">
                        <Icon src="/favorite.svg" size="w-4 h-4" color={isFav ? "bg-yellow-500" : "bg-white/10"} />
                    </button>
                </div>

                <div className="space-y-1">
                    <DetailRow label="Extension" value={file.type.toUpperCase()} color="text-c-brand" />
                    <DetailRow label="File Size" value={formatSize(file.size)} />
                    <DetailRow label="Last Modified" value={formatDate(file.modified)} />
                </div>

                <div className="mt-10 grid grid-cols-2 gap-2">
                    <button onClick={() => handleOpenPath(file.path)} className="flex-1 bg-c-tertiery hover:bg-white/5 border border-white/5 py-2.5 rounded-lg text-[9px] font-black tracking-widest transition-all uppercase">
                        Open Path
                    </button>
                    <button className="flex-1 bg-white text-black hover:bg-c-brand hover:text-white py-2.5 rounded-lg text-[9px] font-black tracking-widest transition-all uppercase">
                        Read File
                    </button>
                </div>
            </div>
        </div>
    );
}

function DetailRow({ label, value, color = "text-white/40" }: any) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-white/[0.02]">
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-tighter">{label}</span>
            <span className={`text-[10px] font-bold ${color}`}>{value}</span>
        </div>
    );
}

function GlobalStatsView({ files }: { files: any[] }) {
    return (
        <div className="p-6 flex flex-col gap-8">
            <div>
                <label className="text-[10px] font-black tracking-[0.2em] text-white/20 uppercase block mb-4">Quick Filters</label>
                <div className="flex flex-wrap gap-2">
                    {['PDF', 'DOCX', 'TXT', 'IMG'].map(ext => (
                        <button key={ext} className="px-3 py-1 rounded-md bg-c-tertiery border border-white/5 text-[9px] font-bold hover:border-c-brand/50 transition-colors">
                            {ext}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function InspectorRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center border-b border-white/[0.03] pb-2">
            <span className="text-[10px] font-bold opacity-30 uppercase">{label}</span>
            <span className="text-[10px] font-mono font-bold text-c-brand">{value}</span>
        </div>
    );
}