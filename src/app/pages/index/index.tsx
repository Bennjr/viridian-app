import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "../../global.css";

// EXPECTED FILES OUTPUT: 
//
// "name": file_name_str,
// "desc": "some desc"
//

export default function App() {
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isCurrent = true;

    invoke("search_files", { query: searchQuery })
      .then((foo: any) => {
        if (isCurrent) {
          if (foo.length > 5) {
            foo = foo.slice(0, 5)
          }
          setFiles(foo);
        }
      })
      .catch(console.error);

    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <div>
      <nav className="flex justify-between items-center mb-6">
        <h2 className="font-bold">Hjem</h2>
      </nav>

      <main className="grid auto-cols gap-10">
        <div className="bg-c-secondary h-[450px] text-center rounded-xl">
          <h1 className="font-bold">VELKOMMEN</h1>
        </div>
        <div className="p-4 bg-c-secondary rounded-lg">
          <header>
            <h2 className="font-bold p-2">Alle filer</h2>
            <div className="px-2 ">
              <input type="text" placeholder="Søk i biblioteket..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-xl px-4 py-3 text-c-text placeholder:text-c-text/30 focus:border-c-brand focus:ring-1 focus:ring-c-brand outline-none transition-all" />
            </div>
          </header>
          <div className="grid grid-cols-5 gap-5 py-4 px-2">
            {files.map((item: any) => (
              <div className="bg-c-tertiery grid select-none cursor-pointer h-56 rounded-xl">
                <div id="preview">PREVIEW</div>
                <div className="">
                  <h2 className="select-all">{item.name}</h2>
                  <p className="select-all">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}