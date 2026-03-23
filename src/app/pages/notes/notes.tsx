import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../../components";

// Mock data - In a real app, this would come from Rust or a database
const INITIAL_NOTES = [
    { id: "1", title: "Innkjøp", content: "Kjøp melk og brød på vei hjem." },
    { id: "2", title: "Viridian Planer", content: "Fikse overlay vindu og ordbok integrasjon." },
    { id: "3", title: "Møtenotat", content: "Husk å diskutere tilgjengelighet for dyslektikere." },
    { id: "4", title: "Passord", content: "Aldri lagre passord her, men dette er en test." },
];

export default function Notes() {
    const [notes, setNotes] = useState(INITIAL_NOTES);
    const [viewingNote, setViewingNote] = useState<any>(null); // State controls which "view" we are in

    // 1. Logic for saving edits
    const handleSave = (id: string, newContent: string) => {
        setNotes(prev => prev.map(n => n.id === id ? { ...n, content: newContent } : n));
        setViewingNote(null); // Return to list after saving
    };

    // 2. Logic for adding a new note
    const addNewNote = () => {
        const newNote = { id: Date.now().toString(), title: "Uten navn", content: "" };
        setNotes([newNote, ...notes]);
        setViewingNote(newNote);
    };

    return (
        <div className="h-full flex flex-col">
            <AnimatePresence mode="wait">
                {viewingNote ? (
                    /* --- EDITOR VIEW --- */
                    <motion.div
                        key="editor"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex-1 flex flex-col"
                    >
                        <header className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setViewingNote(null)}
                                    className="p-2 hover:bg-c-secondary rounded-full rotate-90 opacity-50"
                                >
                                    <Icon src="/chevron-down.svg" size="w-6 h-6" />
                                </button>
                                <h1 className="text-3xl font-black">{viewingNote.title}</h1>
                            </div>
                            <button
                                onClick={() => setViewingNote(null)} // Or your save logic
                                className="bg-c-brand text-white px-6 py-2 rounded-xl font-bold"
                            >
                                Ferdig
                            </button>
                        </header>

                        <textarea
                            autoFocus
                            value={viewingNote.content}
                            onChange={(e) => setViewingNote({ ...viewingNote, content: e.target.value })}
                            placeholder="Skriv notat her..."
                            className="flex-1 bg-c-secondary/20 p-8 rounded-3xl border border-white/5 text-xl leading-relaxed outline-none resize-none"
                        />
                    </motion.div>
                ) : (
                    /* --- LIST VIEW --- */
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <h1 className="text-4xl font-black tracking-tight text-c-text">Notater</h1>
                            <button
                                onClick={addNewNote}
                                className="flex items-center gap-2 bg-c-brand text-white px-5 py-2 rounded-xl font-bold shadow-lg shadow-c-brand/20 hover:scale-105 transition-all"
                            >
                                <Icon src="/plus.svg" color="bg-white" size="w-4 h-4" />
                                Nytt notat
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {notes.map((note) => (
                                <div
                                    key={note.id}
                                    onClick={() => setViewingNote(note)}
                                    className="group bg-c-secondary/40 border border-white/5 p-6 rounded-2xl cursor-pointer hover:border-c-brand/30 transition-all shadow-sm flex flex-col gap-2"
                                >
                                    <h2 className="font-bold text-lg group-hover:text-c-brand transition-colors">
                                        {note.title}
                                    </h2>
                                    <p className="text-sm opacity-40 line-clamp-2 leading-relaxed">
                                        {note.content || "Ingen tekst..."}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}