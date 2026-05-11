import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../components";

export function AddOverlay({ isOpen, onClose, type, t }: any) {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            const newFiles = Array.from(e.dataTransfer.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                    {/* FIX 1: max-h-[85vh] and flex-col ensures the modal never grows off-screen */}
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
                                    <p className="text-xs text-c-text_muted mt-1">Dra og slipp for å legge i køen.</p>
                                </div>
                                <button onClick={onClose} className="p-2 opacity-40 hover:opacity-100 transition-opacity"><Icon src="/close.svg" size="w-4 h-4" /></button>
                            </header>

                            {/* Dropzone - Shrink-0 keeps it from collapsing */}
                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`
                  relative shrink-0 h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer mb-6
                  ${isDragging ? 'border-c-brand bg-c-brand/10' : 'border-c-dividers bg-white/[0.02] hover:bg-white/[0.04]'}
                `}
                            >
                                <Icon src={type === "book" ? "/book.svg" : "/upload.svg"} size="w-5 h-5" className="opacity-20" />
                                <p className="text-[13px] font-bold text-c-text opacity-60">Trykk eller dra filer hit</p>
                                <input type="file" ref={fileInputRef} multiple className="hidden" onChange={handleFileChange} />
                            </div>

                            {/* FIX 2: Self-isolating container for the files */}
                            {/* flex-1 allows it to grow, overflow-y-auto gives it its own scrollbar */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-[100px] border-t border-white/5 pt-4">
                                <AnimatePresence initial={false}>
                                    {files.length > 0 ? (
                                        <div className="flex flex-col gap-2">
                                            {files.map((file, index) => (
                                                <motion.div
                                                    key={file.name + index}
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="flex items-center justify-between p-3 bg-c-secondary/50 rounded-xl border border-white/5 group"
                                                >
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <Icon src="/file.svg" size="w-4 h-4" className="opacity-20" />
                                                        <div className="truncate">
                                                            <p className="text-[12px] font-bold text-c-text truncate">{file.name}</p>
                                                            <p className="text-[10px] font-medium text-c-text_muted">{(file.size / 1024).toFixed(0)} KB</p>
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

                            {/* Footer Actions - Shrink-0 keeps it pinned to bottom */}
                            <div className="mt-6 pt-6 border-t border-white/5 flex justify-end gap-3 shrink-0">
                                <button onClick={onClose} className="px-6 py-2 text-[11px] font-black tracking-widest text-c-text_muted hover:text-c-text transition-colors">
                                    Avbryt
                                </button>
                                <button
                                    disabled={files.length === 0}
                                    className="bg-c-opposite text-c-text_opposite px-8 py-2.5 rounded-xl text-[11px] font-black tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-20 disabled:pointer-events-none shadow-xl shadow-black/20"
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