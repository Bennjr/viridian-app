import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { motion } from "framer-motion";
import "../../global.css";
import { Icon } from "../../../components";

type FileItem = { name: string; path: string; type: string; modified: number; size: number };

export default function LibraryDashboard({ goView }: { goView: () => void }) {
    const [files, setFiles] = useState<FileItem[]>([]);

    useEffect(() => {
        invoke("search_files", { query: "" })
            .then((data: any) => setFiles(Array.isArray(data) ? data.slice(0, 10) : []))
            .catch(console.error);
    }, []);

    return (
        <div className="h-full w-full overflow-y-auto custom-scrollbar bg-c-primary">
            <main className="max-w-6xl mx-auto p-8 lg:p-12 flex flex-col gap-8 font-sans">

                {/* 1. HERO SECTION */}
                <section className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 flex justify-between items-end">
                        <h3 className="text-[10px] font-bold tracking-[0.3em] text-c-text/20 uppercase">Pinned</h3>
                        <button onClick={goView} className="text-[10px] font-bold text-c-brand hover:underline uppercase tracking-widest">
                            Full Library →
                        </button>
                    </div>

                    <motion.div
                        whileHover={{ y: -2 }}
                        className="col-span-12 lg:col-span-7 h-[280px] bg-c-secondary border border-c-divider rounded-3xl relative overflow-hidden group cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                        <img className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-500" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" alt="Preview" />
                        <div className="absolute bottom-0 left-0 p-8 z-20 w-full flex justify-between items-end">
                            <div className="space-y-1">
                                <span className="px-1.5 py-0.5 bg-c-brand text-white text-[9px] font-bold rounded uppercase">System</span>
                                <h2 className="text-xl font-bold text-white tracking-tight leading-none">Architecture_Main.pdf</h2>
                            </div>
                        </div>
                    </motion.div>

                    <div className="col-span-12 lg:col-span-5 grid grid-rows-2 gap-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-c-secondary border border-c-divider rounded-2xl p-5 flex items-center gap-4 group cursor-pointer hover:bg-c-hover transition-colors">
                                <div className="size-12 shrink-0 bg-c-primary rounded-xl flex items-center justify-center border border-c-divider">
                                    <Icon src="/folder.svg" size="w-6 h-6" className="opacity-20" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="text-sm font-bold text-c-text/80 truncate">Research_Data_Vault_{i}</h4>
                                    <p className="text-[9px] text-c-muted_text opacity-40 uppercase tracking-widest">14 Files</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 2. STATS BENTO */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-c-secondary border border-c-divider rounded-2xl p-5 flex flex-col justify-between h-36">
                        <span className="text-[9px] font-bold tracking-widest text-c-text/20 uppercase">Storage</span>
                        <div className="flex items-end gap-1 h-12">
                            <div className="bg-c-brand w-full h-[60%] rounded-t-sm" />
                            <div className="bg-blue-500 w-full h-[40%] rounded-t-sm" />
                            <div className="bg-c-divider w-full h-[20%] rounded-t-sm" />
                        </div>
                    </div>

                    <div onClick={goView} className="bg-c-brand text-white rounded-2xl p-5 flex flex-col justify-between h-36 cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all">
                        <Icon src="/upload.svg" size="w-5 h-5" color="bg-white" />
                        <h4 className="text-base font-bold leading-tight">Import Assets</h4>
                    </div>

                    <div className="lg:col-span-2 bg-c-tertiery/5 border border-c-divider border-dashed rounded-2xl p-5 flex items-center justify-center">
                        <p className="text-[9px] font-bold text-c-text/10 uppercase tracking-[0.3em]">Quick Drop Zone</p>
                    </div>
                </section>

                {/* 3. RECENT ACTIVITY */}
                <section className="flex flex-col gap-3 pb-8">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="text-[10px] font-bold tracking-[0.3em] text-c-text/20 uppercase">Recent Activity</h3>
                    </div>

                    <div className="flex flex-col gap-1">
                        {files.map((file, i) => (
                            <div key={i} className="flex items-center justify-between p-3.5 bg-c-secondary/40 border border-c-divider hover:bg-c-hover rounded-xl transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <Icon src="/file-text.svg" size="w-4 h-4" className="opacity-20 group-hover:text-c-brand group-hover:opacity-100" />
                                    <span className="text-[13px] font-medium text-c-text/80">{file.name}</span>
                                </div>
                                <span className="font-mono text-[10px] text-c-text/20">{(file.size / 1024).toFixed(0)} KB</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}