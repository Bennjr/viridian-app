import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../../components";

const INITIAL_NOTES = [
    { id: "1", title: "Innkjøp", content: "Kjøp melk og brød på vei hjem.", date: "I dag" },
    { id: "2", title: "Viridian Planer", content: "Fikse overlay vindu og ordbok integrasjon.", date: "I går" },
    { id: "3", title: "Møtenotat", content: "Husk å diskutere tilgjengelighet for dyslektikere.", date: "12. Mars" },
    { id: "4", title: "Passord", content: "Aldri lagre passord her, men dette er en test.", date: "10. Mars" },
];

export default function Notes() {
    const [notes, setNotes] = useState(INITIAL_NOTES);
    const [viewingNote, setViewingNote] = useState<any>(null);

    const handleSave = (id: string, newContent: string) => {
        setNotes(prev => prev.map(n => n.id === id ? { ...n, content: newContent } : n));
        setViewingNote(null);
    };

    const addNewNote = () => {
        const newNote = {
            id: Date.now().toString(),
            title: "Nytt notat",
            content: "",
            date: "Nå"
        };
        setNotes([newNote, ...notes]);
        setViewingNote(newNote);
    };

    return (
        <div className="h-full flex flex-col max-w-[1200px] mx-auto">
            <AnimatePresence mode="wait">
                {viewingNote ? (
                    <motion.div
                        key="editor"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="flex-1 flex flex-col gap-6"
                    >
                        <header className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setViewingNote(null)}
                                    className="group p-2 bg-white/[0.03] hover:bg-white/[0.08] rounded-full transition-all"
                                >
                                    <Icon src="/chevron-down.svg" size="w-5 h-5" className="rotate-90 opacity-50 group-hover:opacity-100" />
                                </button>
                                <div>
                                    <input
                                        type="text"
                                        value={viewingNote.title}
                                        onChange={(e) => setViewingNote({ ...viewingNote, title: e.target.value })}
                                        className="bg-transparent text-3xl font-black outline-none border-none p-0 m-0 text-c-text"
                                    />
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-20">Redigerer notat</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleSave(viewingNote.id, viewingNote.content)}
                                className="bg-c-brand hover:brightness-110 text-white px-8 py-2 rounded-xl font-bold shadow-lg shadow-c-brand/10 transition-all"
                            >
                                Ferdig
                            </button>
                        </header>

                        <textarea
                            autoFocus
                            value={viewingNote.content}
                            onChange={(e) => setViewingNote({ ...viewingNote, content: e.target.value })}
                            placeholder="Begynn å skrive her..."
                            className="flex-1 bg-white/[0.02] p-10 rounded-[2rem] border border-white/5 text-lg leading-relaxed outline-none resize-none placeholder:opacity-10"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-10"
                    >
                        <div className="flex justify-between items-end px-1">
                            <div>
                                <h1 className="text-4xl font-black tracking-tight text-c-text">Mine Notater</h1>
                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-20 mt-1">Sist endret: {notes[0]?.date}</p>
                            </div>
                            <button
                                onClick={addNewNote}
                                className="flex items-center gap-2 bg-c-brand text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-c-brand/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                <Icon src="/plus.svg" color="bg-white" size="w-4 h-4" />
                                Nytt notat
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {notes.map((note, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={note.id}
                                    onClick={() => setViewingNote(note)}
                                    className="group relative cursor-pointer flex flex-col bg-white/[0.02] border border-white/5 p-6 rounded-2xl transition-all hover:bg-white/[0.04] hover:border-white/10 hover:-translate-y-1"
                                >
                                    <div className="absolute left-0 top-6 bottom-6 w-[2px] bg-c-brand opacity-20 group-hover:opacity-100 group-hover:h-2/3 transition-all duration-300" />

                                    <div className="flex justify-between items-start mb-3">
                                        <h2 className="font-bold text-lg text-c-text/90 group-hover:text-c-brand transition-colors truncate pr-4">
                                            {note.title}
                                        </h2>
                                        <span className="text-[10px] font-bold opacity-20 group-hover:opacity-40 transition-opacity whitespace-nowrap">{note.date}</span>
                                    </div>

                                    <p className="text-sm opacity-40 line-clamp-3 leading-relaxed group-hover:opacity-60 transition-opacity">
                                        {note.content || "Ingen tekst i dette notatet ennå..."}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}