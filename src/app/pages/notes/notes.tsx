import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../../components";

interface Note {
    id: string;
    title: string;
    content: string;
    updatedAt: string;
}

const INITIAL_NOTES: Note[] = [
    { id: "1", title: "Shopping List", content: "Buy milk and bread on the way home.", updatedAt: "Today" },
    { id: "2", title: "Viridian Plans", content: "Fix overlay window and dictionary integration.", updatedAt: "Yesterday" },
    { id: "3", title: "Meeting Notes", content: "Remember to discuss accessibility for dyslexics.", updatedAt: "Mar 12" },
];

export default function Notes() {
    const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

    // Get the currently selected note object
    const activeNote = useMemo(
        () => notes.find((n) => n.id === activeNoteId),
        [notes, activeNoteId]
    );

    // CRUD Operations
    const createNote = () => {
        const newNote: Note = {
            id: Date.now().toString(),
            title: "",
            content: "",
            updatedAt: "Just now",
        };
        setNotes([newNote, ...notes]);
        setActiveNoteId(newNote.id);
    };

    const updateNote = (id: string, field: keyof Note, value: string) => {
        setNotes((prev) =>
            prev.map((n) => (n.id === id ? { ...n, [field]: value, updatedAt: "Just now" } : n))
        );
    };

    const deleteNote = (id: string) => {
        setNotes((prev) => prev.filter((n) => n.id !== id));
        setActiveNoteId(null);
    };

    return (
        <div className="h-full max-w-6xl mx-auto p-6 lg:p-10 font-sans text-zinc-100">
            <AnimatePresence mode="wait">
                {activeNote ? (
                    <motion.div
                        key="editor"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col h-full gap-6"
                    >
                        {/* Editor Header */}
                        <header className="flex justify-between items-center">
                            <div className="flex items-center gap-4 flex-1">
                                <button
                                    onClick={() => setActiveNoteId(null)}
                                    className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
                                >
                                    <Icon src="/chevron-left.svg" size="w-5 h-5" className="opacity-50 group-hover:opacity-100" />
                                </button>
                                <input
                                    type="text"
                                    value={activeNote.title}
                                    placeholder="Note Title"
                                    onChange={(e) => updateNote(activeNote.id, "title", e.target.value)}
                                    className="bg-transparent text-3xl font-bold outline-none border-none p-0 m-0 w-full placeholder:opacity-20 text-white"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => deleteNote(activeNote.id)}
                                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
                                >
                                    <Icon src="/trash.svg" size="w-5 h-5" className="opacity-20 group-hover:opacity-100 group-hover:invert-0 transition-opacity" />
                                </button>
                                <button
                                    onClick={() => setActiveNoteId(null)}
                                    className="bg-zinc-100 text-zinc-950 px-6 py-2 rounded-lg font-semibold hover:bg-white transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        </header>

                        {/* Main Textarea */}
                        <textarea
                            autoFocus
                            value={activeNote.content}
                            onChange={(e) => updateNote(activeNote.id, "content", e.target.value)}
                            placeholder="Start typing..."
                            className="flex-1 bg-white/[0.03] p-8 lg:p-12 rounded-3xl border border-white/10 text-lg leading-relaxed outline-none resize-none placeholder:opacity-10 focus:border-white/20 transition-colors"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-10"
                    >
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight">My Notes</h1>
                                <p className="text-sm font-medium opacity-30 mt-1 uppercase tracking-widest">
                                    {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
                                </p>
                            </div>
                            <button
                                onClick={createNote}
                                className="flex items-center gap-2 bg-c-brand text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-c-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                <Icon src="/plus.svg" size="w-4 h-4" />
                                <span>New Note</span>
                            </button>
                        </div>

                        {/* Notes Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {notes.map((note) => (
                                <div
                                    key={note.id}
                                    onClick={() => setActiveNoteId(note.id)}
                                    className="group relative cursor-pointer flex flex-col bg-white/[0.02] border border-white/5 p-6 rounded-2xl transition-all hover:bg-white/[0.05] hover:border-white/20"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="font-bold text-lg text-white/90 group-hover:text-c-brand transition-colors truncate">
                                            {note.title || "Untitled Note"}
                                        </h2>
                                        <span className="text-[10px] font-bold opacity-30 uppercase tracking-tighter whitespace-nowrap ml-2">
                                            {note.updatedAt}
                                        </span>
                                    </div>

                                    <p className="text-sm opacity-40 line-clamp-3 leading-relaxed group-hover:opacity-70 transition-opacity">
                                        {note.content || "No text yet..."}
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