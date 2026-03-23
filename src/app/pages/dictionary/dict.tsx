import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

type DictResponse = {
  q: string;
  cnt: number;
  cmatch: number;
  a: {
    exact: [string, number][];
    similar: [string, number][];
  };
};

export default function Dict() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<DictResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setData(null);
      return;
    }

    const timeout = setTimeout(() => {
      setLoading(true);

      invoke<DictResponse>("ordbok_api", { q: query })
        .then((res) => {
          setData(res);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 250); // liten debounce

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">Ordbok</h2>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Søk etter ord..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-xl px-4 py-3 text-c-text placeholder:text-c-text/30 focus:border-c-brand focus:ring-1 focus:ring-c-brand outline-none transition-all"
      />

      {/* Content */}
      <div className="grid gap-6">
        {loading && (
          <div className="text-c-muted_text text-sm">
            Søker...
          </div>
        )}

        {!loading && data && (
          <>
            {/* Info */}
            <div className="text-sm text-c-muted_text">
              Fant {data.cnt} resultater for{" "}
              <span className="text-c-text font-medium">
                "{data.q}"
              </span>
            </div>

            {/* Exact matches */}
            {data.a.exact.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-c-text/70">
                  Eksakte treff
                </h3>

                <div className="grid gap-2">
                  {data.a.exact.map(([word, score], i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-c-secondary border border-white/5 rounded-xl px-4 py-3 hover:bg-c-btn_hover transition"
                    >
                      <span className="font-medium">{word}</span>
                      <span className="text-xs text-c-muted_text">
                        score: {score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Similar matches */}
            {data.a.similar.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-c-text/70">
                  Lignende ord
                </h3>

                <div className="grid gap-2">
                  {data.a.similar.map(([word, score], i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-c-secondary_bg border border-white/5 rounded-xl px-4 py-3 hover:bg-c-btn_hover transition"
                    >
                      <span>{word}</span>
                      <span className="text-xs text-c-muted_text">
                        score: {score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!loading && query && !data && (
          <div className="text-c-muted_text text-sm">
            Ingen resultater
          </div>
        )}
      </div>
    </div>
  );
}