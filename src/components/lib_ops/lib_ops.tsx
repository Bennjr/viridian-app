import { useState, useMemo } from "react";
import { Icon } from "../icon/icon";

interface File {
    name: string;
    content: string;
    type: string;
}

interface SingleFileViewProps {
    files: File[];
    setContent: (c: string) => void;
    onClose: () => void;
}

export function SingleFileView({ files, setContent }: SingleFileViewProps) {
    const groupedFiles = useMemo(() => {
        return files.reduce((acc, file) => {
            const type = file.type || "unknown";
            if (!acc[type]) acc[type] = [];
            acc[type].push(file);
            return acc;
        }, {} as Record<string, File[]>);
    }, [files]);

    const [expandedCategories, setExpandedCategories] = useState<string[]>(
        Object.keys(groupedFiles)
    );

    const toggleCategory = (type: string) => {
        setExpandedCategories((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            {Object.entries(groupedFiles).map(([type, typeFiles]) => {
                const isOpen = expandedCategories.includes(type);

                return (
                    <section key={type} className="flex flex-col gap-1">
                        <button
                            onClick={() => toggleCategory(type)}
                            className="flex items-center justify-between w-full bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/5 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-c-brand/20 p-2 rounded-lg">
                                    <Icon src="/file.svg" size="w-4 h-4" className="text-c-brand" />
                                </div>
                                <span className="font-bold text-sm uppercase tracking-wider opacity-80">
                                    {type} <span className="ml-1 opacity-40">({typeFiles.length})</span>
                                </span>
                            </div>
                            <Icon
                                src="/chevron-down.svg"
                                size="w-4 h-4"
                                className={`transition-transform duration-300 ${isOpen ? '' : '-rotate-90 opacity-40'}`}
                            />
                        </button>

                        {isOpen && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1 ml-2">
                                {typeFiles.map((file, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setContent(file.content)}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-c-brand/50 hover:bg-c-brand/5 cursor-pointer transition-all group"
                                    >
                                        <Icon src="/file-text.svg" size="w-4 h-4" className="opacity-40 group-hover:text-c-brand group-hover:opacity-100" />
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-sm font-medium truncate">{file.name}</span>
                                            <span className="text-[10px] opacity-40 truncate">
                                                {file.content.substring(0, 40)}...
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                );
            })}

            {files.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                    <Icon src="/search.svg" size="w-12 h-12" />
                    <p className="mt-4">Ingen filer funnet</p>
                </div>
            )}
        </div>
    );
}