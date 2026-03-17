import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "../../global.css";
import { Icon } from "../../../components";

// EXPECTED FILES OUTPUT:
//
// "name": file_name_str,
// "desc": "some desc"
//

const filetypeOpen = () => {
  return (
    <div>

    </div>
  )
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
              flex items-center justify-center gap-2 px-4 py-2 rounded-full 
              transition-all duration-200 whitespace-nowrap
              ${isActive
                ? "bg-c-brand text-white shadow-md"
                : "bg-c-btn text-c-text hover:bg-c-btn_hover"}
            `}
          >
            <Icon
              src={f.icon}
              color={isActive ? "bg-white" : "bg-c-text"}
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
        <h2 className="text-2xl font-bold">Bibliotek</h2>
        <button
          className="p-2 px-5 border border-c-secondary border-solid text-c-muted_text rounded-full hover:border-c-brand"
        >
          Last opp
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <input type="text" placeholder="Søk i biblioteket..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-xl px-4 py-3 text-c-text placeholder:text-c-text/30 focus:border-c-brand focus:ring-1 focus:ring-c-brand outline-none transition-all" />
        <fieldset className="select-none">
          <FilterBar />
        </fieldset>
      </div>

      <main className="grid grid-cols-5 gap-5">
        {files.map((item: any) => (
          <div className="bg-c-secondary_bg rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-t border-white/5 p-6 hover:scale-[0.97] active:scale-[0.98] hover:shadow-[0_0_20px_rgba(58,117,97,0.2)] duration-150 ">
            <div id="preview">PREVIEW</div>
            <div className="">
              <h1 className="select-all">{item.name}</h1>
              <p className="select-all">{item.desc}</p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}