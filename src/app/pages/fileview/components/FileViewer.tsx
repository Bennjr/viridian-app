import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Icon } from "../../../../components/icon/icon";

export default function FileViewer({ label, path, onClose }: { label: string, path: string, onClose: () => void }) {
    const [content, setContent] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        invoke<string>("get_content", { path }).then(setContent).catch(console.error);
    }, [path]);

    const handleCopy = () => {
        if (!content) return;
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 animate-in fade-in zoom-in-95 duration-200">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

            <div className="relative bg-c-secondary w-full h-full rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-c-brand rounded-lg shadow-lg shadow-c-brand/20">
                            <Icon src="/folder.svg" color="bg-white" size="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white">{label}</h2>
                            <p className="text-[10px] opacity-40 font-mono truncate max-w-[300px]">{path}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopy}
                            className="text-[10px] font-bold uppercase px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            {copied ? "Copied!" : "Copy Content"}
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-red-500/20 rounded-full transition-colors group">
                            <span className="text-white opacity-50 group-hover:opacity-100">✕</span>
                        </button>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 relative p-2 overflow-hidden bg-[#0a0a0a]">
                    <textarea
                        className="w-full h-full bg-transparent p-6 text-white/80 font-mono text-sm leading-relaxed outline-none resize-none 
                                   scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent selection:bg-c-brand/30"
                        spellCheck={false}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                {/* Footer Stats */}
                <div className="px-6 py-2 bg-black/40 border-t border-white/5 flex justify-between items-center text-[10px] font-mono opacity-40">
                    <span>{content.length} characters</span>
                    <span>UTF-8</span>
                </div>
            </div>
        </div>
    );
}