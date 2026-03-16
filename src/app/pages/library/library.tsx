import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "../../global.css";

export default function Library() {
  const [files, setFiles] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState([]);

  let file_array = []

  useEffect(() => {
    let isCurrent = true;

    invoke("search_files", { query: searchQuery })
      .then((foo: any) => {
        if (isCurrent) {
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
    <div className="p-6 grid">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-c-text">Bibliotek</h2>
        <button
          className="p-2 px-5 border border-c-text border-solid rounded-full text-white"
        >
          Last opp
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <input type="text" placeholder="Søk i biblioteket..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-1 border rounded" />
        <div className="grid grid-cols-3 gap-5">
          <label className="text-center bg-c-light_btn rounded" >
            ⭐ Favoritter
          </label>
          <label className="text-center bg-c-light_btn rounded" >
            ⌛ Tid
          </label>
          <label className="text-center bg-c-light_btn rounded" >
            📂 Filtype
          </label>
        </div>
      </div>

      <main className="grid grid-cols-5 gap-5">
        {files.map((item: any) => (
          <div className="bg-red-500 select-none cursor-pointer">
            <h1>{item.name}</h1>
            <p>{item.desc}</p>
          </div>
        ))}
      </main>
    </div>
  );
}