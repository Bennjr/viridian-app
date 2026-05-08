import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../../components";

type FileItem = {
    name: string;
    path: string;
    type: string;
    modified: number;
    size: number;
    desc: string;
};

// This is the standard "Productivity" curve: Fast start, smooth stop.
const proEase: [number, number, number, number] = [0.4, 0, 0.2, 1];

export default function LibraryFullGrid({ goDashboard }: { goDashboard: () => void }) {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [searchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await invoke<FileItem[]>("search_files", { query: searchQuery });
                setFiles(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
            }
        };
        fetch();
    }, [searchQuery]);

    return (
        <div className="flex h-full w-full bg-c-primary overflow-hidden">
            <motion.main
                layout
                transition={{ duration: 0.25, ease: proEase }}
                className="flex-1 flex flex-col min-w-0 h-full border-r border-c-divider"
            >
                {/* HEADER */}
                <header className="h-16 flex items-center justify-between px-6 shrink-0 border-b border-c-divider">
                    <button onClick={goDashboard} className="p-1.5 hover:bg-c-hover rounded transition-colors non-draggable">
                        <Icon src="/chevron-down.svg" className="rotate-90 opacity-40" size="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2 rounded border border-c-divider transition-colors ${showFilters ? 'bg-c-hover' : 'bg-c-btn hover:bg-c-btn_hover'}`}
                    >
                        <Icon src="/chevron-down.svg" className={`opacity-40 ${showFilters ? "rotate-90" : "-rotate-90"}`} size="w-5 h-5" />
                    </button>
                </header>

                {/* BENTO GRID */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <motion.div
                        layout
                        transition={{ duration: 0.3, ease: proEase }}
                        className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4"
                    >
                        {files.map((file) => (
                            <FileBentoCard key={file.path} file={file} />
                        ))}
                    </motion.div>
                </div>
            </motion.main>

            <AnimatePresence mode="popLayout">
                {showFilters && (
                    <motion.aside
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="w-72 h-full bg-c-secondary overflow-hidden shrink-0 border-l border-c-divider"
                    >
                        <div className="p-6 flex flex-col h-full gap-8">
                            <section>
                                <h3 className="text-[10px] font-bold tracking-[0.2em] text-c-muted_text opacity-50 uppercase mb-4">Quick Filters</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {['PDF', 'DOCX', 'TXT', 'IMG'].map(ext => (
                                        <button key={ext} className="px-3 py-2 rounded bg-c-btn border border-c-divider text-[10px] font-bold text-c-text hover:bg-c-btn_hover transition-colors">
                                            {ext}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-[10px] font-bold tracking-[0.2em] text-c-muted_text opacity-50 uppercase mb-4">Sort By</h3>
                                <div className="flex flex-col gap-1">
                                    {['Recent', 'Name (A-Z)', 'File Size'].map(sort => (
                                        <button key={sort} className="w-full text-left px-3 py-2 rounded hover:bg-c-hover text-[11px] font-semibold text-c-muted_text hover:text-c-text transition-all">
                                            {sort}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section className="mt-auto pt-6 border-t border-c-divider">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-c-muted_text">
                                    <span>Total Files</span>
                                    <span className="text-c-text">{files.length}</span>
                                </div>
                            </section>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </div>
    );
}

function FileBentoCard({ file }: { file: FileItem }) {
    const isFolder = file.type === 'directory' || file.type === 'folder';

    return (
        <motion.div
            layout
            // No initial scale "pop", just a clean fade
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="group bg-c-tertiery border border-c-divider p-5 rounded-xl hover:bg-c-hover transition-colors cursor-pointer relative flex flex-col justify-between h-40"
        >
            <div className="flex justify-between items-start">
                <div className={`p-2.5 rounded-lg transition-colors ${isFolder ? 'bg-c-brand/10 text-c-brand' : 'bg-c-primary text-c-text/20 group-hover:text-c-text/60'}`}>
                    <Icon src={isFolder ? "/folder.svg" : "/file-text.svg"} size="w-5 h-5" />
                </div>

                <button className="opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity">
                    <Icon src="/favorite.svg" size="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="min-w-0">
                <h3 className="text-[12px] font-bold text-c-text mb-0.5 truncate tracking-tight uppercase">
                    {file.name}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-c-muted_text opacity-40 uppercase tracking-wider">
                        {file.desc || file.type}
                    </span>
                    {!isFolder && file.size > 0 && (
                        <span className="text-[9px] text-c-muted_text opacity-20">
                            • {(file.size / 1024).toFixed(0)} KB
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}