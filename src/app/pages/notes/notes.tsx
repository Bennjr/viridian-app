import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../../context/LanguageContext";

type Lang = "no" | "en" | "es" | "de" | "fr" | "ru" | "lt" | "ar";

interface Note {
    id: string;
    title: string;
    content: string;
    updatedAt: string;
}

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
    no: {
        title: "Mine Notater",
        note: "Notat",
        notes: "Notater",
        organize: "Organiser tankene dine",
        newNote: "Nytt notat",
        untitled: "Uten tittel",
        noText: "Ingen tekst enda...",
        empty: "Ingen notater enda",
        create: "Lag et notat for å starte",
        placeholder: "Begynn å skrive...",
        noteTitle: "Notattittel",
        done: "Ferdig",
        words: "ord",
        delete: "Slett",
    },

    en: {
        title: "My Notes",
        note: "Note",
        notes: "Notes",
        organize: "Organize your thoughts",
        newNote: "New Note",
        untitled: "Untitled",
        noText: "No text yet...",
        empty: "No notes yet",
        create: "Create a note to get started",
        placeholder: "Start typing...",
        noteTitle: "Note title",
        done: "Done",
        words: "words",
        delete: "Delete",
    },

    es: {
        title: "Mis Notas",
        note: "Nota",
        notes: "Notas",
        organize: "Organiza tus pensamientos",
        newNote: "Nueva Nota",
        untitled: "Sin título",
        noText: "Sin texto todavía...",
        empty: "No hay notas",
        create: "Crea una nota para comenzar",
        placeholder: "Empieza a escribir...",
        noteTitle: "Título",
        done: "Listo",
        words: "palabras",
        delete: "Eliminar",
    },

    de: {
        title: "Meine Notizen",
        note: "Notiz",
        notes: "Notizen",
        organize: "Organisiere deine Gedanken",
        newNote: "Neue Notiz",
        untitled: "Ohne Titel",
        noText: "Noch kein Text...",
        empty: "Keine Notizen",
        create: "Erstelle eine Notiz",
        placeholder: "Schreibe etwas...",
        noteTitle: "Titel",
        done: "Fertig",
        words: "Wörter",
        delete: "Löschen",
    },

    fr: {
        title: "Mes notes",
        note: "Note",
        notes: "Notes",
        organize: "Organisez vos pensées",
        newNote: "Nouvelle note",
        untitled: "Sans titre",
        noText: "Pas encore de texte...",
        empty: "Pas de notes",
        create: "Créez une note pour commencer",
        placeholder: "Commencez à écrire...",
        noteTitle: "Titre de la note",
        done: "Terminé",
        words: "mots",
        delete: "Supprimer",
    },

    ru: {
        title: "Мои заметки",
        note: "Заметка",
        notes: "Заметки",
        organize: "Организуйте свои мысли",
        newNote: "Новая заметка",
        untitled: "Без названия",
        noText: "Пока нет текста...",
        empty: "Нет заметок",
        create: "Создайте заметку, чтобы начать",
        placeholder: "Начните писать...",
        noteTitle: "Название заметки",
        done: "Готово",
        words: "слов",
        delete: "Удалить",
    },

    lt: {
        title: "Mano užrašai",
        note: "Užrašas",
        notes: "Užrašai",
        organize: "Organizuokite savo mintis",
        newNote: "Naujas užrašas",
        untitled: "Be pavadinimo",
        noText: "Dar nėra teksto...",
        empty: "Nėra užrašų",
        create: "Sukurkite užrašą, kad pradėtumėte",
        placeholder: "Pradėkite rašyti...",
        noteTitle: "Užrašo pavadinimas",
        done: "Atlikta",
        words: "žodžių",
        delete: "Ištrinti",
    },

    ar: {
        title: "ملاحظاتي",
        note: "ملاحظة",
        notes: "ملاحظات",
        organize: "نظم أفكارك",
        newNote: "ملاحظة جديدة",
        untitled: "بدون عنوان",
        noText: "لا يوجد نص بعد...",
        empty: "لا توجد ملاحظات",
        create: "أنشئ ملاحظة للبدء",
        placeholder: "ابدأ الكتابة...",
        noteTitle: "عنوان الملاحظة",
        done: "تم",
        words: "كلمات",
        delete: "حذف",
    }
};

const proEase: any[] = []

const INITIAL_NOTES: Note[] = [
    {
        id: "1",
        title: "Shopping List",
        content: "Buy milk and bread.",
        updatedAt: "Today"
    }
];

export default function NotesApp() {
    const { language } = useLanguage();
    const t = (key: string) => TRANSLATIONS[language as Lang][key] || key;

    const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(INITIAL_NOTES[0].id);

    const activeNote = useMemo(
        () => notes.find((n) => n.id === activeNoteId),
        [notes, activeNoteId]
    );

    const updateNote = (id: string, field: keyof Note, value: string) => {
        setNotes((prev) =>
            prev.map((n) => (n.id === id ? { ...n, [field]: value, updatedAt: "Now" } : n))
        );
    };

    const createNote = () => {
        const newNote: Note = {
            id: Date.now().toString(),
            title: "",
            content: "",
            updatedAt: "Now"
        };
        setNotes([newNote, ...notes]);
        setActiveNoteId(newNote.id);
    };

    const deleteNote = (noteToDelete: Note) => {
        setNotes((prevNotes) => {
            const updatedNotes = prevNotes.filter((n) => n.id !== noteToDelete.id);
            if (activeNoteId === noteToDelete.id) {
                setActiveNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null);
            }
            return updatedNotes;
        });
    };

    return (
        <div className="h-screen w-full bg-c-primary text-c-text overflow-hidden">
            <div className="flex flex-row gap-8 p-8 lg:p-12 h-full">
                <section className="flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar pb-20 pr-2">
                    <div className="flex flex-row gap-4">
                        <textarea
                            className="h-24 flex-1 shrink-0 bg-c-secondary resize-none border border-c-divider text-left p-8 hover:bg-c-hover transition-colors"
                            placeholder="Søk i notater"
                        >
                        </textarea>
                        <button
                            onClick={createNote}
                            className="h-24 flex-2 shrink-0 bg-c-secondary border border-c-divider text-left p-8 hover:bg-c-hover transition-colors"
                        >
                            + {t("newNote")}
                        </button>
                    </div>
                    <AnimatePresence initial={false}>
                        {notes.map((note) => (
                            <motion.div
                                key={note.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2, ease: proEase }}
                            >
                                <NoteRow
                                    note={note}
                                    title={note.title || t("untitled")}
                                    updatedAt={note.updatedAt}
                                    isActive={activeNoteId === note.id}
                                    onClick={() => setActiveNoteId(note.id)}
                                    deleteNote={deleteNote}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </section>

                <section className="flex-1 h-full">
                    {activeNote ? (
                        <div className="relative h-full">
                            <div className="absolute top-4 right-4 z-10">
                                <NoteToolbar />
                            </div>
                            <textarea
                                value={activeNote.content}
                                onChange={(e) => updateNote(activeNote.id, "content", e.target.value)}
                                placeholder={t("placeholder")}
                                className="w-full h-full resize-none bg-c-secondary border border-c-divider p-8 pr-16 outline-none"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-c-secondary/20 border border-c-divider border-dashed flex items-center justify-center opacity-20">
                            {t("empty")}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

function NoteRow({ note, title, updatedAt, isActive, onClick, deleteNote }: { note: Note; title: string; updatedAt: string; isActive: boolean; onClick: () => void; deleteNote: (note: Note) => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex flex-row justify-between h-24 shrink-0 text-left p-8 transition-colors border ${isActive ? 'bg-c-hover border-c-brand' : 'bg-c-secondary border-c-divider'} hover:bg-c-hover`}
        >
            <div>
                <h3 className="text-sm font-semibold truncate">{title}</h3>
                <p className="text-xs text-c-text/50">{updatedAt}</p>
            </div>
            <div>
                <button
                    className="w-10 h-10 flex items-center justify-center rounded-xl border bg-c-secondary border-white/10 opacity-50 hover:opacity-100 transition-all"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note);
                    }}
                >
                    🗑️
                </button>
            </div>
        </button>
    )
}

function NoteToolbar() {
    const actions = [
        { id: "delete", icon: "🗑️", title: "Delete", action: () => { } },
        { id: "draw", icon: "✏️", title: "Draw", action: () => { } },
        { id: "export", icon: "📤", title: "Export", action: () => { } },
        { id: "copy", icon: "📋", title: "Copy", action: () => { } },
    ]
    return (
        <div className="flex flex-col gap-2">
            {actions.map((item) => (
                <button
                    key={item.id}
                    onClick={item.action}
                    title={item.title}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border bg-c-secondary border-white/10 opacity-50 hover:opacity-100 transition-all"
                >
                    {item.icon}
                </button>
            ))}
        </div>
    )
}