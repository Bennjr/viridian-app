import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "../../global.css";

// EXPECTED FILES OUTPUT:
//
// "name": file_name_str,
// "desc": "some desc"
//

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
          className="p-2 px-5 border border-c-secondary border-solid rounded-full hover:border-c-text"
        >
          Last opp
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <input type="text" placeholder="Søk i biblioteket..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-1 border rounded" />
        <div className="grid grid-cols-3 gap-5 select-none">
          <label className="text-center bg-c-btn rounded-full cursor-pointer grid grid-cols-[auto_auto] w-full gap-2 hover:bg-c-btn_hover" >
            <img src="/favorite.svg" alt="" className="w-6 h-auto" /> Favoritter
          </label>
          <label className="text-center bg-c-btn rounded-full cursor-pointer grid grid-cols-[auto_auto] w-full gap-2 hover:bg-c-btn_hover" >
            <img src="/clock.svg" alt="" className="w-6 h-auto" /> Tid
          </label>
          <label className="text-center bg-c-btn rounded-full cursor-pointer grid grid-cols-[auto_auto] w-full gap-2 hover:bg-c-btn_hover" >
            <img src="folder.svg" alt="" className="w-6 h-auto" /> Filtype
          </label>
        </div>
      </div>

      <main className="grid grid-cols-5 gap-5">
        {files.map((item: any) => (
          <div className="bg-red-500 grid select-none cursor-pointer h-56 rounded-xl">
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