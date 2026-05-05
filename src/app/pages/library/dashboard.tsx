import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "../../global.css";
import { Icon } from "../../../components";
import { SingleFileView } from "../../../components/lib_ops/lib_ops";
import { useLanguage } from "../../../context/LanguageContext";

type Lang = "no" | "en" | "es" | "de";

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  no: {
    library: "Bibliotek",
    addFile: "Legg til fil",
    quickSearch: "Hurtigsøk",
    recentFiles: "Nyelige filer",
    lastEdited: "Sist redigert",
    fileType: "Filtype",
    seeAll: "Se alle",
    seeAllFiles: "Se alle filer",
    pdf: "PDF",
  },
  en: {
    library: "Library",
    addFile: "Add File",
    quickSearch: "Quick Search",
    recentFiles: "Recent Files",
    lastEdited: "Last Edited",
    fileType: "File Type",
    seeAll: "See All",
    seeAllFiles: "See All Files",
    pdf: "PDF",
  },
  es: {
    library: "Biblioteca",
    addFile: "Agregar Archivo",
    quickSearch: "Búsqueda Rápida",
    recentFiles: "Archivos Recientes",
    lastEdited: "Última Edición",
    fileType: "Tipo de Archivo",
    seeAll: "Ver Todo",
    seeAllFiles: "Ver Todos los Archivos",
    pdf: "PDF",
  },
  de: {
    library: "Bibliothek",
    addFile: "Datei Hinzufügen",
    quickSearch: "Schnellsuche",
    recentFiles: "Aktuelle Dateien",
    lastEdited: "Zuletzt Bearbeitet",
    fileType: "Dateityp",
    seeAll: "Alle Anzeigen",
    seeAllFiles: "Alle Dateien Anzeigen",
    pdf: "PDF",
  },
};

export default function LibraryDashboard({ goView }: { goView: () => void }) {
    const [files, setFiles] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState('time');
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    const { language } = useLanguage();
    const t = (key: string) => TRANSLATIONS[language as Lang][key] || key;

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
        <main className="flex flex-col gap-8 p-8 max-w-6xl mx-auto animate-in fade-in zoom-in-95">
            <section>
                <div className="flex flex-row justify-between">
                    <h2>{t("library")}</h2>
                    <div className="flex flex-row gap-4">
                        <button>{t("addFile")}</button>
                        <div className="flex relative">
                            <Icon src="/search.svg" size="w-4 h-4" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"></Icon>
                            <input
                                type="text"
                                placeholder={t("quickSearch")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-c-secondary border border-c-divider rounded-xl px-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-c-brand/50 focus:border-c-brand/50 transition-all placeholder:text-white/20"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <div className="flex flex-row justify-end">
                    <button className="hover:text-c-brand transition-all duration-200" onClick={goView}>{t("seeAll")}</button>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex w-full bg-c-brand h-[300px] rounded-xl">
                        <h2>{t("library")}</h2>
                    </div>
                    <div className="flex flex-row gap-4">
                        <div className="flex w-full bg-c-brand h-[200px] rounded-xl">
                            <h2>{t("library")}</h2>
                        </div>
                        <div className="flex w-full bg-c-brand h-[200px] rounded-xl">
                            <h2>{t("library")}</h2>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-center">
                    <button onClick={goView} className="border-c-divider border p-4 px-8 hover:border-c-btn_hover transition-all duration-200 active:scale-[0.96]">{t("seeAllFiles")}</button>
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <div className="flex flex-row justify-between">
                    <h3>{t("recentFiles")}</h3>
                    <div className="flex flex-row gap-8 text-c-muted_text">
                        <h3>{t("lastEdited")}</h3>
                        <h3>{t("fileType")}</h3>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row justify-between p-4 rounded-xl bg-c-secondary hover:bg-c-hover">
                        <h3>Little test data</h3>
                        <div className="flex flex-row gap-8">
                            <h3>8/8/8</h3>
                            <h3>{t("pdf")}</h3>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between p-4 rounded-xl bg-c-secondary hover:bg-c-hover">
                        <h3>Little test data</h3>
                        <div className="flex flex-row gap-8">
                            <h3>8/8/8</h3>
                            <h3>{t("pdf")}</h3>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between p-4 rounded-xl bg-c-secondary hover:bg-c-hover">
                        <h3>Little test data</h3>
                        <div className="flex flex-row gap-8">
                            <h3>8/8/8</h3>
                            <h3>{t("pdf")}</h3>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between p-4 rounded-xl bg-c-secondary hover:bg-c-hover">
                        <h3>Little test data</h3>
                        <div className="flex flex-row gap-8">
                            <h3>8/8/8</h3>
                            <h3>{t("pdf")}</h3>
                        </div>
                    </div>
                </div>
                {files ?
                    <div>

                    </div>
                    : <div></div>
                }
            </section>

        </main>
    )
}