import { useState } from "react";

// En individuell kort-komponent for hvert ord
const WordCard = ({ wrong, correct, phonetic }: { wrong: string, correct: string, phonetic: string }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="group h-48 w-full cursor-pointer [perspective:1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative h-full w-full rounded-xl transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        
        {/* FORSIDE: Det feilskrevne ordet */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-white/5 bg-c-secondary shadow-lg [backface-visibility:hidden]">
          <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-c-muted_text">Tidligere skrevet</p>
          <h3 className="text-2xl font-medium text-white/30 line-through decoration-c-brand/50">
            {wrong}
          </h3>
        </div>

        {/* BAKSIDE: Fasit og uttale */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-c-brand/20 bg-c-tertiery shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-c-brand font-bold">Riktig skrivemåte</p>
          <h3 className="mb-3 text-4xl font-bold text-white tracking-tight">
            {correct}
          </h3>
          <div className="mt-2 border-t border-white/10 pt-2">
            <p className="text-sm italic text-c-text/60">
              Uttale: <span className="text-c-brand/80">{phonetic}</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default function Writing() {
  // Dette ville i fremtiden kommet fra Rust-backend
  const [wordLog] = useState([
    { id: 1, wrong: "hverandre", correct: "hverandre", phonetic: "vær-andre" },
    { id: 2, wrong: "interisang", correct: "interessant", phonetic: "in-te-re-sant" },
    { id: 3, wrong: "spesiellt", correct: "spesielt", phonetic: "spe-si-elt" },
    { id: 4, wrong: "fous", correct: "fokus", phonetic: "få-kus" },
  ]);

  return (
    <div className="flex flex-col gap-8 p-2">
      {/* Header-seksjon */}
      <header className="flex items-end justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Ordtrening</h2>
          <p className="mt-2 text-c-muted_text">
            Trykk på kortene for å øve på ord du har strevd med tidligere.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-c-muted_text uppercase tracking-widest">Fullførte ord</span>
          <p className="text-xl font-mono text-c-brand">12 / 40</p>
        </div>
      </header>

      {/* Grid med Flashcards */}
      <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wordLog.map((item) => (
          <WordCard 
            key={item.id} 
            wrong={item.wrong} 
            correct={item.correct} 
            phonetic={item.phonetic} 
          />
        ))}

        {/* Tom tilstand / "Legg til manuelt" (Valgfritt) */}
        <button className="flex h-48 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/5 bg-transparent hover:border-c-brand/20 hover:bg-white/5 transition-all">
          <span className="text-c-muted_text text-sm">Legg til et ord manuelt</span>
        </button>
      </main>

      {/* Footer / Info */}
      <footer className="mt-10 rounded-lg bg-c-secondary/50 p-6 border border-white/5">
        <h4 className="text-sm font-bold text-white mb-2">Hvorfor flashcards?</h4>
        <p className="text-sm text-c-muted_text leading-relaxed">
          Ved å se det feilskrevne ordet først, og deretter avdekke den riktige skrivemåten sammen med 
          en fonetisk guide, hjelper du hjernen med å bygge nye visuelle stier. Dette er en effektiv 
          metode for å mestre ord som ikke følger vanlige regler.
        </p>
      </footer>
    </div>
  );
}