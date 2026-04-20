import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "../../global.css";
import { Icon } from "../../../components";
import { SingleFileView } from "../../../components/lib_ops/lib_ops";

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
              <button onClick={() => setContent("")}>Tøm</button>
            </div>
            : <div></div>}
        </div>
      </div>
    </div>
  );
}

const FILTERS = [
  { id: 'fav', label: 'Favoritter', icon: '/favorite.svg' },
  { id: 'time', label: 'Tid', icon: '/clock.svg' },
  { id: 'type', label: 'Filtype', icon: '/folder.svg' },
];

export default function Library() {
  const [files, setFiles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState('fav');
  const [selectedFile, setSelectedFile] = useState<any>(null);

  useEffect(() => {
    let isCurrent = true;
    invoke("search_files", { query: searchQuery })
      .then((data: any) => {
        if (isCurrent && Array.isArray(data)) {
          const limited = data.length > 50 ? data.slice(0, 50) : data;
          setFiles(limited);
          console.log(limited)
        }
      })
      .catch(console.error);

    return () => { isCurrent = false; };
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-6 text-c-text">
      <header className="sticky top-0 z-50 w-full border-b border-c-divider bg-c-secondary/80 backdrop-blur-md p-4">
        <div className=" px-4 py-4 space-y-4">

          {/* Top Row: Title & Action */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Bibliotek</h1>
            </div>
            <button className="bg-c-brand hover:bg-c-brand/90 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-c-brand/20">
              Last opp
            </button>
          </div>

          {/* Bottom Row: Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative flex-1 group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon src="/search.svg" size="w-4 h-4" className="opacity-40 group-focus-within:opacity-100 group-focus-within:text-c-brand transition-opacity" />
              </div>
              <input
                type="text"
                placeholder="Søk i biblioteket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-c-brand/50 focus:border-c-brand/50 transition-all placeholder:text-white/20"
              />
            </div>

            {/* Filter Segmented Control */}
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
                    {f.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>


      <section className="w-full bg-c-secondary p-1 rounded-md">
        <div className="flex flex-row">
          <p>Content</p>
        </div>
        <Icon src="/chevron-down.svg" size="w-4 h-4" className="opacity-20" />
      </section>

      <main className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 pb-20 p-8">
        {files.map((item: any) => (
          <div
            key={item.path}
            onClick={() => setSelectedFile(item)}
            className="group cursor-pointer flex flex-col bg-white/[0.02] border border-white/5 rounded-lg overflow-hidden transition-all hover:border-c-brand/40 hover:bg-white/[0.04]"
          >
            <div className="bg-black/20 aspect-video flex flex-col items-center justify-center relative">
              <Icon src="/folder.svg" size="w-10 h-10" className="opacity-[0.03] group-hover:opacity-10 transition-opacity" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-[0.03] mt-2 group-hover:opacity-10 transition-opacity">
                Preview
              </span>
            </div>

            <div className="p-4 bg-white/[0.01]">
              <h2 className="font-semibold text-sm truncate opacity-80 group-hover:opacity-100 transition-opacity">
                {item.name}
              </h2>
              <p className="text-[10px] font-bold opacity-20 uppercase tracking-widest mt-1">
                Dokument
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