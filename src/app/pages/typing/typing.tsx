/**
 * Writing.tsx — Norsk språklæringsapp (Ordtrening)
 *
 * Arkitektur (én fil, tydelig delt i seksjoner):
 *   § 1  Typer & konstanter
 *   § 2  Lokal ordbok + normalisering (norsk)
 *   § 3  Levenshtein distance + autokorrektur
 *   § 4  API-lag (stavekontroll, oversettelse, fonetikk, TTS)
 *   § 5  React-komponenter (LangRow, WordCard, LoadingCard, LangPicker)
 *   § 6  Hoved-komponent (Writing)
 *
 * Avhengigheter: kun react + tailwindcss + global.css (CSS-variabler)
 */

import { useState, useEffect, useRef, useCallback } from "react";
import "../../global.css";

/* ═══════════════════════════════════════════════════════════
   § 1  TYPER & KONSTANTER
═══════════════════════════════════════════════════════════ */

type LangCode = "no" | "en" | "es";

interface Translation {
  lang: LangCode;
  word: string;
  phonetic: string;
}

interface WordEntry {
  id: number;
  inputRaw: string;       // Hva brukeren faktisk tastet
  corrected: string;      // Riktig ord på kildespråket (etter autokorrektur)
  sourceLang: LangCode;   // Hvilket språk brukeren skrev på
  wasAutoFixed: boolean;
  translations: Translation[];
  addedAt: number;
}

interface AutocorrectResult {
  word: string;
  confidence: "high" | "medium" | "low";
  source: "exact" | "normalized" | "levenshtein" | "api" | "unchanged";
}

/** Metadataene for hvert språk som vises i UI */
const ALL_LANGUAGES: { code: LangCode; label: string; flag: string; placeholder: string }[] = [
  { code: "no", label: "Norsk",   flag: "🇳🇴", placeholder: "Skriv et norsk ord..."    },
  { code: "en", label: "English", flag: "🇬🇧", placeholder: "Type an English word..."  },
  { code: "es", label: "Español", flag: "🇪🇸", placeholder: "Escribe una palabra..."   },
];

/** MyMemory bruker IETF-tags — "nb" for norsk bokmål, ikke "no" */
const MYMEMORY_LANG: Record<LangCode, string> = { no: "nb", en: "en", es: "es" };

/** TTS-locale per språk */
const TTS_LANG: Record<LangCode, string> = { no: "nb-NO", en: "en-US", es: "es-ES" };

/** Ordbok-API URL per kildespråk */
const SPELLCHECK_API: Record<LangCode, (word: string) => string> = {
  no: (w) => `https://ord.uib.no/api/suggest?q=${encodeURIComponent(w)}&dict=bm,nn&n=5`,
  en: (w) => `https://api.datamuse.com/words?sp=${encodeURIComponent(w)}&v=en&max=1`,
  es: (w) => `https://api.datamuse.com/words?sp=${encodeURIComponent(w)}&v=es&max=1`,
};

/* ═══════════════════════════════════════════════════════════
   § 2  LOKAL ORDBOK + NORMALISERING (norsk)
═══════════════════════════════════════════════════════════ */

const LOCAL_DICTIONARY_NO = new Set([
  "hei","ha","det","er","jeg","du","han","hun","vi","de",
  "og","i","på","til","av","for","med","en","et","ei",
  "ikke","som","men","om","kan","vil","skal","har","var",
  "hus","bil","hund","katt","mann","kvinne","barn","dag",
  "natt","tid","år","land","by","skole","arbeid","mat",
  "vann","bok","ord","navn","sted","vei","dør","vindu",
  "stol","bord","seng","rom","hjem","familie","venn",
  "verden","folk","liv","problem","spørsmål","svar",
  "gå","komme","si","gjøre","se","vite","ta","få",
  "gi","bli","spørre","jobbe","lese","skrive","høre",
  "tenke","forstå","bruke","finne","trenge","like",
  "elske","hate","hjelpe","prøve","klare","ønske",
  "snakke","fortelle","vise","lage","spise","drikke",
  "god","dårlig","stor","liten","ny","gammel","ung",
  "lang","kort","høy","lav","fin","stygg","glad","trist",
  "rask","sakte","sterk","svak","varm","kald","riktig",
  "feil","viktig","interessant","morsom","kjedelig",
  "fokus","kanskje","selvfølgelig","definitivt","spesielt",
  "egentlig","faktisk","plutselig","allerede","fortsatt",
  "forskjell","mulighet","situasjon","forklaring",
  "beskrivelse","opplevelse","betydning","utvikling",
]);

const NORMALIZATION_RULES_NO: [RegExp, string][] = [
  [/kv/g,            "hv"],
  [/sj(?!e)/g,       "skj"],
  [/z/g,             "s"],
  [/x/g,             "ks"],
  [/c(?=[ei])/g,     "s"],
  [/c(?=[aouå])/g,   "k"],
  [/ph/g,            "f"],
  [/tj(?!e)/g,       "kj"],
  [/tion$/g,         "sjon"],
  [/ght/g,           "kt"],
  [/ll(?=[^aeiouæøå])/g, "l"],
  [/ss(?=[^aeiouæøå])/g, "s"],
];

const WORD_CORRECTIONS_NO: Record<string, string> = {
  "heg":"jeg","kansje":"kanskje","kanksje":"kanskje","kanskej":"kanskje",
  "fokuz":"fokus","fokuss":"fokus","selvfølelig":"selvfølgelig",
  "defenitivt":"definitivt","spesiellt":"spesielt","egentling":"egentlig",
  "plutsling":"plutselig","alerede":"allerede","mangen":"mange",
  "myge":"mye","noken":"noen","nokon":"noen","sien":"siden",
  "huse":"hus","bille":"bil","dago":"dag","store":"stor",
};

/* ═══════════════════════════════════════════════════════════
   § 3  LEVENSHTEIN + AUTOKORREKTUR
═══════════════════════════════════════════════════════════ */

/** Klassisk iterativ Levenshtein (O(m) plass, rolling array) */
function levenshtein(a: string, b: string): number {
  const la = a.length, lb = b.length;
  if (la === 0) return lb;
  if (lb === 0) return la;
  let prev = Array.from({ length: lb + 1 }, (_, i) => i);
  for (let i = 1; i <= la; i++) {
    const curr = [i];
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    prev = curr;
  }
  return prev[lb];
}

function normalizeWordNo(word: string): string {
  let w = word.toLowerCase().trim();
  for (const [pat, rep] of NORMALIZATION_RULES_NO) w = w.replace(pat, rep);
  return w;
}

function findBestLocalCandidate(
  word: string,
  dict: Set<string>
): { word: string; distance: number } | null {
  const lower = word.toLowerCase();
  let best: { word: string; distance: number } | null = null;
  for (const dictWord of dict) {
    if (Math.abs(dictWord.length - lower.length) > 3) continue;
    const dist = levenshtein(lower, dictWord);
    if (dist === 0) return { word: dictWord, distance: 0 };
    const maxAllowed = dictWord.length >= 5 ? 2 : 1;
    if (dist <= maxAllowed && (!best || dist < best.distance))
      best = { word: dictWord, distance: dist };
  }
  return best;
}

/**
 * Lokal autokorrektur — kun brukt for norsk.
 * Engelsk og spansk sendes rett til API.
 */
function autocorrectLocalNo(raw: string): AutocorrectResult {
  const lower = raw.toLowerCase().trim();
  if (WORD_CORRECTIONS_NO[lower])
    return { word: WORD_CORRECTIONS_NO[lower], confidence: "high", source: "exact" };
  if (LOCAL_DICTIONARY_NO.has(lower))
    return { word: lower, confidence: "high", source: "exact" };
  const normalized = normalizeWordNo(lower);
  if (normalized !== lower && LOCAL_DICTIONARY_NO.has(normalized))
    return { word: normalized, confidence: "high", source: "normalized" };
  const cRaw  = findBestLocalCandidate(lower, LOCAL_DICTIONARY_NO);
  const cNorm = normalized !== lower ? findBestLocalCandidate(normalized, LOCAL_DICTIONARY_NO) : null;
  const best  = !cNorm ? cRaw : !cRaw ? cNorm : cRaw.distance <= cNorm.distance ? cRaw : cNorm;
  if (best) return { word: best.word, confidence: best.distance === 1 ? "high" : "medium", source: "levenshtein" };
  return { word: lower, confidence: "low", source: "unchanged" };
}

/* ═══════════════════════════════════════════════════════════
   § 4  API-LAG
═══════════════════════════════════════════════════════════ */

/** Verifiser / korriger norsk ord via UiB Ordbok-API */
async function verifyWithOrdbokAPI(word: string): Promise<string> {
  try {
    const res = await fetch(SPELLCHECK_API.no(word), { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return word;
    const data = await res.json();
    const exact   = data?.a?.exact?.[0]?.[0];
    if (exact) return exact.toLowerCase();
    const similar = data?.a?.similar?.[0]?.[0];
    if (similar && levenshtein(word, similar.toLowerCase()) <= 2) return similar.toLowerCase();
  } catch { /* nettverksfeil */ }
  return word;
}

/** Verifiser / korriger engelsk eller spansk via Datamuse */
async function verifyWithDatamuse(word: string, lang: "en" | "es"): Promise<string> {
  try {
    const res = await fetch(SPELLCHECK_API[lang](word), { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return word;
    const data = await res.json();
    const candidate: string = data[0]?.word ?? "";
    if (candidate && levenshtein(word.toLowerCase(), candidate) <= 2) return candidate;
  } catch { /* nettverksfeil */ }
  return word;
}

/**
 * Komplett stavekontroll-pipeline per kildespråk.
 *   norsk   → lokal autokorrektur + UiB API
 *   engelsk → Datamuse
 *   spansk  → Datamuse (spansk)
 */
async function correctWord(raw: string, lang: LangCode): Promise<string> {
  const lower = raw.toLowerCase().trim();
  if (lang === "no") {
    const local = autocorrectLocalNo(lower);
    if (local.confidence === "high") return local.word;
    const fromApi = await verifyWithOrdbokAPI(local.word);
    return fromApi !== lower ? fromApi : local.word;
  }
  if (lang === "en") return await verifyWithDatamuse(lower, "en");
  if (lang === "es") return await verifyWithDatamuse(lower, "es");
  return lower;
}

/** Oversett ett ord via MyMemory (gratis, ingen API-nøkkel) */
async function translateWord(word: string, from: LangCode, to: LangCode): Promise<string> {
  if (from === to || !word) return word;
  const fromCode = MYMEMORY_LANG[from];
  const toCode   = MYMEMORY_LANG[to];
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=${fromCode}|${toCode}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return word;
    const data = await res.json();
    const ok = Number(data?.responseStatus) === 200;
    const translated: string = data?.responseData?.translatedText ?? "";
    if (ok && translated && translated.toLowerCase() !== word.toLowerCase())
      return translated.toLowerCase().trim();
  } catch { /* timeout */ }
  return word;
}

/** IPA-fonetikk for engelske ord via Free Dictionary API */
async function getEnglishPhonetic(word: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      { signal: AbortSignal.timeout(4000) }
    );
    if (!res.ok) return syllabify(word, "en");
    const data = await res.json();
    const ipa = data[0]?.phonetic ?? data[0]?.phonetics?.find((p: { text?: string }) => p.text)?.text;
    return ipa ?? syllabify(word, "en");
  } catch {
    return syllabify(word, "en");
  }
}

/** Menneskelig lesbar stavelsesdeling — hjelper uttalen uten å kreve IPA */
function syllabify(word: string, lang: LangCode): string {
  const w = word.toLowerCase();
  if (lang === "no") {
    return w
      .replace(/([aeiouæøå])([^aeiouæøå]{2,})([aeiouæøå])/g, "$1$2-$3")
      .replace(/([aeiouæøå]{2})([^aeiouæøå])/g, "$1-$2")
      .replace(/([^aeiouæøå])([aeiouæøå]{2})/g, "$1-$2")
      .replace(/--+/g, "-").replace(/^-|-$/g, "") || w;
  }
  if (lang === "es") {
    return w
      .replace(/([aeiouáéíóú])([^aeiouáéíóú]{1,2})([aeiouáéíóú])/g, "$1$2-$3")
      .replace(/--+/g, "-").replace(/^-|-$/g, "") || w;
  }
  // Engelsk — fallback (IPA hentes via API)
  return w
    .replace(/([aeiou])([^aeiou]{2})([aeiou])/g, "$1-$2$3")
    .replace(/([aeiou]{2})([^aeiou])/g, "$1-$2")
    .replace(/--+/g, "-").replace(/^-|-$/g, "") || w;
}

async function getReadablePhonetic(word: string, lang: LangCode): Promise<string> {
  if (!word) return "";
  if (lang === "en") return await getEnglishPhonetic(word);
  return syllabify(word, lang);
}

/** TTS via browser SpeechSynthesis */
function speakWord(word: string, lang: LangCode): void {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(word);
  utt.lang  = TTS_LANG[lang] ?? "nb-NO";
  utt.rate  = 0.85;
  utt.pitch = 1;
  window.speechSynthesis.speak(utt);
}

/**
 * Bygger komplett WordEntry fra råinput + valgt kildespråk.
 *
 * 1. Korriger ordet på kildespråket
 * 2. Oversett til de to andre språkene parallelt
 * 3. Hent fonetikk for alle tre parallelt
 */
async function buildWordEntry(rawInput: string, sourceLang: LangCode): Promise<Omit<WordEntry, "id">> {
  const trimmed  = rawInput.trim();
  const corrected = await correctWord(trimmed, sourceLang);
  const wasAutoFixed = corrected !== trimmed.toLowerCase();

  // Alle tre språk — kildespråket bruker corrected direkte
  const OTHER_LANGS = (["no", "en", "es"] as LangCode[]).filter((l) => l !== sourceLang);

  const translationPromises: Promise<Translation>[] = [
    // Kildespråket selv
    (async (): Promise<Translation> => {
      const phonetic = await getReadablePhonetic(corrected, sourceLang);
      return { lang: sourceLang, word: corrected, phonetic };
    })(),
    // De to andre
    ...OTHER_LANGS.map(async (targetLang): Promise<Translation> => {
      const word    = await translateWord(corrected, sourceLang, targetLang);
      const phonetic = await getReadablePhonetic(word, targetLang);
      return { lang: targetLang, word, phonetic };
    }),
  ];

  const translations = await Promise.all(translationPromises);

  // Sorter alltid: no → en → es for konsistent rekkefølge på bakside
  const order: LangCode[] = ["no", "en", "es"];
  translations.sort((a, b) => order.indexOf(a.lang) - order.indexOf(b.lang));

  return { inputRaw: trimmed, corrected, sourceLang, wasAutoFixed, translations, addedAt: Date.now() };
}

/* ═══════════════════════════════════════════════════════════
   § 5  REACT-KOMPONENTER
═══════════════════════════════════════════════════════════ */

/* ─── LangPicker ────────────────────────────────────────── */

interface LangPickerProps {
  value: LangCode;
  onChange: (lang: LangCode) => void;
}

function LangPicker({ value, onChange }: LangPickerProps) {
  return (
    <div className="flex bg-white/5 p-2 rounded-2xl border border-white/10 self-start gap-2 shadow-lg backdrop-blur-sm">
      {ALL_LANGUAGES.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => onChange(code)}
          className={`
            px-5 py-3 rounded-xl font-semibold text-sm uppercase tracking-wide
            transition-all duration-200 hover:scale-105 active:scale-95
            ${value === code
              ? "bg-c-brand text-white shadow-md shadow-c-brand/40"
              : "text-c-text/70 hover:text-c-text hover:bg-white/10"
            }
          `}
        >
          {flag} {label}
        </button>
      ))}
    </div>
  );
}

/* ─── LangRow ───────────────────────────────────────────── */

interface LangRowProps {
  translation: Translation;
  isSource: boolean; // Er dette kildespråket? → fremhev
}

function LangRow({ translation, isSource }: LangRowProps) {
  const [speaking, setSpeaking] = useState(false);
  const meta = ALL_LANGUAGES.find((l) => l.code === translation.lang)!;

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSpeaking(true);
    speakWord(translation.word, translation.lang);
    setTimeout(() => setSpeaking(false), 1200);
  };

  return (
    <div className={`
      flex items-center gap-4 rounded-2xl px-5 py-3.5 group/row
      transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
      ${isSource
        ? "bg-c-brand/15 border border-c-brand/30 shadow-sm"
        : "bg-white/5 hover:bg-white/10"
      }
    `}>
      <span className="text-xl leading-none select-none">{meta.flag}</span>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-base leading-tight truncate capitalize ${isSource ? "text-c-brand" : "text-c-text"}`}>
          {translation.word}
        </p>
        <p className="text-c-text/50 text-sm font-mono tracking-wide truncate">
          {translation.phonetic}
        </p>
      </div>
      <button
        onClick={handleSpeak}
        title={`Hør ${meta.label} uttale`}
        className={`
          shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm
          transition-all duration-200 active:scale-90 hover:scale-110
          ${speaking
            ? "bg-c-brand text-white shadow-md"
            : "bg-c-brand/20 text-c-brand hover:bg-c-brand hover:text-white opacity-70 group-hover/row:opacity-100"
          }
        `}
      >
        {speaking ? "🔊" : "▶"}
      </button>
    </div>
  );
}

/* ─── WordCard ──────────────────────────────────────────── */

interface WordCardProps {
  entry: WordEntry;
  onDelete: (id: number) => void;
  displayLang: LangCode;
}

function WordCard({ entry, onDelete, displayLang }: WordCardProps) {
  const [flipped, setFlipped] = useState(false);
  const sourceMeta = ALL_LANGUAGES.find((l) => l.code === entry.sourceLang)!;

  const displayedTranslation = entry.translations.find((t) => t.lang === displayLang) || entry.translations[0];

  return (
    <div
      className="[perspective:1200px] group relative"
      style={{ animation: "wordCardIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}
    >
      {/* Slett */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
        aria-label="Slett kort"
        className="
          absolute -top-3 -right-3 z-30 w-8 h-8 rounded-full
          bg-red-500 hover:bg-red-400 text-white
          flex items-center justify-center text-sm font-bold
          opacity-0 group-hover:opacity-100
          transition-all duration-200 shadow-lg shadow-red-500/40 hover:scale-110
        "
      >✕</button>

      {/* Auto-fikset badge */}
      {entry.wasAutoFixed && (
        <div className="
          absolute -top-3 -left-3 z-30 bg-amber-500 text-white
          text-xs font-bold uppercase tracking-wide px-3 py-1
          rounded-full shadow-lg opacity-0 group-hover:opacity-100
          transition-all duration-200
        ">
          Rettet
        </div>
      )}

      {/* Flip-wrapper */}
      <div
        onClick={() => setFlipped((f) => !f)}
        className="relative w-full cursor-pointer transition-all duration-700 [transform-style:preserve-3d]"
        style={{
          transform:  flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          minHeight:  "260px",
          height:     flipped ? "auto" : "260px",
        }}
      >
        {/* ── FORSIDE ── */}
        <div className="
          absolute inset-0 flex flex-col items-center justify-center
          bg-gradient-to-br from-c-secondary to-c-secondary/95 border border-white/10
          rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300
          [backface-visibility:hidden] p-6 text-center select-none
        ">
          {/* Kildespråk-badge */}
          <span className="text-3xl mb-3">{sourceMeta.flag}</span>
          <span className="text-sm font-bold tracking-widest text-c-text/30 uppercase mb-4">
            Du skrev
          </span>
          <p className="font-bold text-c-text/40 line-through italic text-3xl break-all leading-tight">
            {entry.inputRaw}
          </p>
          {entry.wasAutoFixed && (
            <p className="mt-4 text-sm text-amber-500/70 font-medium bg-amber-500/10 px-3 py-1 rounded-lg">
              ≈ rettet automatisk
            </p>
          )}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
            <div className="text-xs text-c-text/20 font-medium bg-white/5 px-3 py-1 rounded-full">
              Klikk for å se svar →
            </div>
          </div>
        </div>

        {/* ── BAKSIDE ── */}
        <div
          className="
            absolute inset-0 flex flex-col
            bg-gradient-to-br from-c-secondary to-c-secondary/95 border-2 border-c-brand
            rounded-3xl shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]
            p-6 gap-4
          "
          style={{ minHeight: "260px", height: "auto" }}
        >
          <div className="text-center pb-3 border-b border-c-brand/20">
            <span className="text-sm font-bold tracking-widest text-c-brand/60 uppercase">
              Riktig ord
            </span>
            <div className="flex items-center justify-center gap-3 mt-2">
              <p className="font-bold text-c-text text-3xl tracking-tight">
                {entry.corrected}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); speakWord(entry.corrected, entry.sourceLang); }}
                className="w-9 h-9 bg-c-brand/20 hover:bg-c-brand text-c-brand hover:text-white rounded-xl flex items-center justify-center text-sm transition-all active:scale-90 hover:scale-105 shadow-sm"
              >🔊
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <LangRow
              translation={displayedTranslation}
              isSource={displayedTranslation.lang === entry.sourceLang}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── LoadingCard ───────────────────────────────────────── */

function LoadingCard() {
  return (
    <div className="h-[260px] rounded-3xl border border-white/10 bg-gradient-to-br from-c-secondary to-c-secondary/90 flex flex-col items-center justify-center gap-4 shadow-xl">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full bg-c-brand shadow-sm"
            style={{ animation: `dotBounce 1s ease-in-out ${i * 0.15}s infinite` }}
          />
        ))}
      </div>
      <p className="text-base font-bold tracking-widest text-c-text/30 uppercase">
        Behandler ord...
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   § 6  HOVED-KOMPONENT
═══════════════════════════════════════════════════════════ */

const STORAGE_KEY = "ordtrening_v5";

export default function Writing() {
  const [input, setInput]         = useState("");
  const [wordLog, setWordLog]     = useState<WordEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg]   = useState<string | null>(null);
  const [fontSize, setFontSize]   = useState("medium");

  const filteredWordLog = wordLog; // Ingen filtrering via søk, hold full objektliste

  // Kildespråk — starter alltid på norsk
  const [sourceLang, setSourceLang] = useState<LangCode>("no");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleLangChange = (lang: LangCode) => {
    setSourceLang(lang);
    setWordLog((prev) =>
      prev.map((entry) => {
        const target = entry.translations.find((t) => t.lang === lang);
        if (!target) return entry;
        return {
          ...entry,
          sourceLang: lang,
          inputRaw: target.word,
          corrected: target.word,
          wasAutoFixed: false,
        };
      })
    );
    setInput("");
    setErrorMsg(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Last inn lagrede data
  useEffect(() => {
    setFontSize(localStorage.getItem("fontSize") ?? "medium");
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setWordLog(JSON.parse(saved));
    } catch { /* korrupt data — ignorer */ }
  }, []);

  // Lagre ved endring
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wordLog));
  }, [wordLog]);

  // (All logikk for språkbytte er allerede håndtert ovenfor)

  const handleAdd = useCallback(async () => {
    const raw = input.trim();
    if (!raw || isLoading) return;
    setIsLoading(true);
    setErrorMsg(null);
    setInput("");
    try {
      const entry = await buildWordEntry(raw, sourceLang);
      setWordLog((prev) => [{ id: Date.now(), ...entry }, ...prev]);
      speakWord(entry.corrected, sourceLang);
    } catch (err) {
      console.error("buildWordEntry feilet:", err);
      setErrorMsg("Noe gikk galt. Prøv igjen.");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [input, isLoading, sourceLang]);

  const handleDelete = useCallback((id: number) => {
    setWordLog((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const currentLangMeta = ALL_LANGUAGES.find((l) => l.code === sourceLang)!;

  const fontConfig: Record<string, string> = {
    small:  "[&_h1]:text-2xl [&_h2]:text-xl [&_p]:text-sm",
    medium: "[&_h1]:text-4xl [&_h2]:text-3xl [&_p]:text-base",
    large:  "[&_h1]:text-5xl [&_h2]:text-4xl [&_p]:text-xl",
  };

  return (
    <div className="h-full flex flex-col">
      <style>{`
        @keyframes wordCardIn {
          from { opacity: 0; transform: scale(0.88) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes dotBounce {
          0%, 100% { transform: translateY(0);    opacity: 0.4; }
          50%       { transform: translateY(-8px); opacity: 1;   }
        }
      `}</style>

      <div className="space-y-10 animate-in fade-in duration-700">

        {/* ── HEADER ── */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
          <div className="flex-1">
            <h1 className="font-black tracking-tight text-c-text leading-tight text-5xl mb-2">
              Ordtrening
            </h1>
            <p className="text-c-text/60 font-medium text-lg max-w-md">
              Skriv et ord — vi retter, oversetter og lærer deg det med umiddelbar tilbakemelding.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {wordLog.length > 0 && (
              <div className="text-sm text-c-text/40 font-medium">
                {wordLog.length} ord lagret
              </div>
            )}
            {wordLog.length > 0 && (
              <button
                onClick={() => { if (window.confirm("Er du sikker på at du vil slette alle ord?")) setWordLog([]); }}
                className="px-4 py-2 text-sm font-semibold text-red-500 hover:text-red-400 hover:bg-red-50/10 rounded-lg transition-all duration-200 border border-red-500/20 hover:border-red-400/30"
              >
                Tøm alt
              </button>
            )}
          </div>
        </header>

        {/* ── SPRÅKVELGER + INPUT ── */}
        <div className="
          max-w-3xl mx-auto w-full
          bg-gradient-to-br from-c-secondary to-c-secondary/90
          border border-white/10 shadow-2xl
          rounded-3xl p-8
          focus-within:border-c-brand/30 focus-within:shadow-c-brand/10
          transition-all duration-300
          flex flex-col gap-6
        ">
          {/* Velger øverst i boksen */}
          <div className="flex justify-center">
            <LangPicker value={sourceLang} onChange={handleLangChange} />
          </div>

          {/* Label */}
          <div className="text-center">
            <p className="text-sm font-semibold tracking-wide text-c-text/50 uppercase mb-1">
              Skriv på {currentLangMeta.label}
            </p>
            <span className="text-2xl">{currentLangMeta.flag}</span>
          </div>

          <input
            ref={inputRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); setErrorMsg(null); }}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            disabled={isLoading}
            placeholder="Skriv et norsk ord..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="
              w-full bg-white/5 border-2 border-white/10 rounded-2xl
              px-6 py-4 text-c-text font-semibold text-center text-xl
              outline-none focus:border-c-brand focus:bg-white/10 focus:shadow-xl focus:shadow-c-brand/10
              placeholder-c-text/30 transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          />

          {errorMsg && (
            <div className="text-center">
              <p className="text-sm font-medium text-red-400 bg-red-400/10 py-3 px-4 rounded-xl border border-red-400/20">
                {errorMsg}
              </p>
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={isLoading || !input.trim()}
            className="
              w-full bg-gradient-to-r from-c-brand to-c-brand/90 text-white
              py-4 rounded-2xl font-bold text-lg tracking-wide
              hover:brightness-110 hover:shadow-2xl hover:shadow-c-brand/30
              active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 flex items-center justify-center gap-3
              shadow-xl shadow-c-brand/20
            "
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Behandler ord...
              </>
            ) : (
              <>
                <span className="text-lg">➕</span>
                Legg til ord
              </>
            )}
          </button>
        </div>

        {/* ── STATISTIKK ── */}
        {wordLog.length > 0 && (
          <div className="flex items-center gap-6 max-w-3xl mx-auto w-full">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="bg-c-secondary/50 px-6 py-3 rounded-full border border-white/5 shadow-sm">
              <span className="text-sm font-semibold text-c-text/60">
                {filteredWordLog.length} av {wordLog.length} ord vist
              </span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/10 to-transparent" />
          </div>
        )}

        {/* ── KORT-GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
          {isLoading && <LoadingCard />}
          {filteredWordLog.map((entry) => (
            <WordCard key={entry.id} entry={entry} onDelete={handleDelete} displayLang={sourceLang} />
          ))}
        </div>

      </div>
    </div>
  );
}