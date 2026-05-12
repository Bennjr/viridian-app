import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../components";
import { invoke } from "@tauri-apps/api/core";
import { open } from '@tauri-apps/plugin-dialog';

interface FileItem {
    name: string;
    path: string;
    size: number;
}

export function AddOverlay({ isOpen, onClose, type, t }: any) {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handlePickFiles = async () => {
        const selected = await open({
            multiple: true,
            directory: false,
            filters: type === "book"
                ? [{ name: 'Books', extensions: ['epub', 'pdf'] }]
                : undefined
        });

        if (Array.isArray(selected)) {
            const newFiles = selected.map(path => ({
                path: path,
                name: path.split(/[\\/]/).pop() || "Unknown",
                size: 0
            }));
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files) {
            const droppedFiles = Array.from(e.dataTransfer.files);

            const newFiles = droppedFiles.map((file: any) => ({
                name: file.name,
                path: file.path,
                size: file.size
            }));

            const validFiles = newFiles.filter(f => f.path);
            setFiles((prev) => [...prev, ...validFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const saveFiles = async () => {
        const paths = files.map((f) => f.path);

        console.log(paths);

        try {
            await invoke("save_files", {
                paths,
                into: type === "book" ? "library" : "files"
            });
            onClose();
            setFiles([]);
        } catch (err) {
            console.error("Failed to save files:", err);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-xl bg-c-primary border border-white/10 rounded-[32px] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
                    >
                        <div className="p-8 flex flex-col h-full overflow-hidden">
                            <header className="flex justify-between items-start mb-6 shrink-0">
                                <div>
                                    <h2 className="text-xl font-bold text-c-text tracking-tight">
                                        {type === "book" ? "Legg til bøker" : "Last opp filer"}
                                    </h2>
                                    <p className="text-xs text-c-text_muted mt-1">Dra og slipp eller trykk for å velge filer.</p>
                                </div>
                                <button onClick={onClose} className="p-2 opacity-40 hover:opacity-100 transition-opacity"><Icon src="/close.svg" size="w-4 h-4" /></button>
                            </header>

                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={handlePickFiles}
                                className={`
                                    relative shrink-0 h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer mb-6
                                    ${isDragging ? 'border-c-brand bg-c-brand/10' : 'border-c-dividers bg-white/[0.02] hover:bg-white/[0.04]'}
                                `}
                            >
                                <Icon src={type === "book" ? "/book.svg" : "/upload.svg"} size="w-5 h-5" className="opacity-20" />
                                <p className="text-[13px] font-bold text-c-text opacity-60">Trykk eller dra filer hit</p>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-[100px] border-t border-white/5 pt-4">
                                <AnimatePresence initial={false}>
                                    {files.length > 0 ? (
                                        <div className="flex flex-col gap-2">
                                            {files.map((file, index) => (
                                                <motion.div
                                                    key={file.path + index}
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="flex items-center justify-between p-3 bg-c-secondary/50 rounded-xl border border-white/5 group"
                                                >
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <Icon src="/file.svg" size="w-4 h-4" className="opacity-20" />
                                                        <div className="truncate">
                                                            <p className="text-[12px] font-bold text-c-text truncate">{file.name}</p>
                                                            <p className="text-[10px] font-medium text-c-text_muted truncate opacity-50">{file.path}</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => removeFile(index)} className="p-2 hover:bg-red-500/10 rounded-lg group/btn">
                                                        <Icon src="/trash.svg" size="w-3.5 h-3.5" className="opacity-20 group-hover/btn:opacity-100" />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-32 flex flex-col items-center justify-center opacity-10 text-center">
                                            <Icon src="/upload.svg" size="w-8 h-8" className="mb-2" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Køen er tom</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/5 flex justify-end gap-3 shrink-0">
                                <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-c-text_muted hover:text-c-text transition-colors">
                                    Avbryt
                                </button>
                                <button
                                    disabled={files.length === 0}
                                    className="bg-c-opposite text-c-text_opposite px-8 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-20 disabled:pointer-events-none shadow-xl shadow-black/20"
                                    onClick={saveFiles}
                                >
                                    Bekreft ({files.length})
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}