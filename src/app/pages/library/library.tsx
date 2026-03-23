import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "../../global.css";
import { Icon } from "../../../components";

// EXPECTED FILES OUTPUT:
//
// "name": file_name_str,
// "desc": "some desc"
// "path": "some_path"
//

const filetypeOpen = () => {
  return (
    <div>

    </div>
  )
}

const FileViewer = ({ label, path, onClose }: any) => {
  const [content, setContent] = useState("")
  console.log(path)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const textContent = await invoke<string>("get_content", { path: path });
        setContent(textContent);
      } catch (error) {
        console.error("Failed to fetch content:", error);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-10">
      <div className="bg-c-bg w-full rounded-md max-w-2xl border border-white/10 overflow-hidden">

        <div className="bg-c-secondary p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold">{label}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="bg-c-tertiery p-8 max-h-[70vh] overflow-y-auto">
          <textarea className="text-c-text whitespace-pre-wrap w-full h-full bg-tertiery resize-none" onChange={(e) => setContent(e.target.value)} value={content}></textarea>
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

const FilterBar = () => {
  const [activeFilter, setActiveFilter] = useState('fav');

  return (
    <nav className="inline-grid grid-cols-3 gap-2 select-none w-fit">
      {FILTERS.map((f) => {
        const isActive = activeFilter === f.id;

        return (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`
              flex items-center justify-center gap-2 px-4 py-2 rounded-xl 
              transition-all duration-200 whitespace-nowrap
              ${isActive
                ? "bg-c-brand text-white shadow-md"
                : "bg-c-btn text-c-text hover:bg-c-btn_hover"}
            `}
          >
            <Icon
              src={f.icon}
              color={isActive ? "bg-c-icon" : "bg-c-text"}
              size="w-5 h-5"
            />
            <span className="text-sm font-medium">{f.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function Library() {
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  useEffect(() => {
    let isCurrent = true;

    invoke("search_files", { query: searchQuery })
      .then((foo: any) => {
        if (isCurrent) {
          if (foo.lenght > 50) {
            foo.slice(0, 50)
          }
          setFiles(foo);
        }
      })
      .catch(console.error);

    return () => {
      isCurrent = false;
    };
  }, [searchQuery]);

  const filterBy = (filter: string) => {
    let target = filter
    const final: any = target += filter;
    setFilter(final);
    console.log(filter, final);
  };

  return (
    <div className="grid">
      <div className="flex justify-between items-center pb-4">
        <h2 className="font-bold">Bibliotek</h2>
        <button
          className="p-2 px-5 border border-c-secondary border-solid text-c-muted_text rounded-full hover:border-c-brand"
        >
          Last opp
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 items-center">
        <input type="text" placeholder="Søk i biblioteket..."
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-xl px-4 py-3 text-c-text placeholder:text-c-text/30 focus:border-c-brand focus:ring-1 focus:ring-c-brand outline-none transition-all" />
        <fieldset className="select-none">
          <FilterBar />
        </fieldset>
      </div>

      <main className="grid grid-cols-5 gap-5">
        {files.map((item: any) => (
          <div className="bg-c-secondary_bg select-none border-t border-white/5 hover:scale-[0.97] active:scale-[0.98] hover:shadow-[0_0_20px_rgba(58,117,97,0.2)] duration-150 " onClick={() => setSelectedFile(item)}>
            <div className="bg-c-tertiery h-40">preview</div>
            <div className="bg-c-secondary p-2">
              <h2 className="">{item.name}</h2>
            </div>
          </div>
        ))}
        {selectedFile && (
          <FileViewer
            label={selectedFile.name}
            content={selectedFile.desc}
            path={selectedFile.path}
            onClose={() => setSelectedFile(null)}
          />
        )}
      </main>
    </div>
  );
}