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

    const t = (key: string) =>
        TRANSLATIONS[language as Lang][key] || key;

    const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

    const activeNote = useMemo(
        () => notes.find((n) => n.id === activeNoteId),
        [notes, activeNoteId]
    );

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

    const updateNote = (
        id: string,
        field: keyof Note,
        value: string
    ) => {
        setNotes((prev) =>
            prev.map((n) =>
                n.id === id
                    ? { ...n, [field]: value, updatedAt: "Now" }
                    : n
            )
        );
    };

    const deleteNote = (id: string) => {
        setNotes((prev) => prev.filter((n) => n.id !== id));

        if (activeNoteId === id) {
            setActiveNoteId(null);
        }
    };

    return (
        <div className="min-h-screen bg-c-primary text-c-text overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.png')]" />

            <AnimatePresence mode="wait">

                {activeNote ? (

                    <motion.div
                        key="editor"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="h-screen flex flex-col"
                    >

                        {/* HEADER */}

                        <header className="border-b border-white/5 bg-c-secondary/40 backdrop-blur-xl">
                            <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">

                                <div className="flex items-center gap-4 flex-1">

                                    <button
                                        onClick={() => setActiveNoteId(null)}
                                        className="p-2 rounded-xl border border-c-divider hover:bg-white/5 transition-all"
                                    >
                                        ←
                                    </button>

                                    <input
                                        value={activeNote.title}
                                        onChange={(e) =>
                                            updateNote(
                                                activeNote.id,
                                                "title",
                                                e.target.value
                                            )
                                        }
                                        placeholder={t("noteTitle")}
                                        className="
                                            bg-transparent
                                            text-3xl
                                            font-black
                                            outline-none
                                            w-full
                                            placeholder:text-c-text/20
                                        "
                                    />
                                </div>

                                <div className="flex items-center gap-3">

                                    <button
                                        onClick={() => deleteNote(activeNote.id)}
                                        className="
                                            px-4 py-2 rounded-xl
                                            border border-red-500/10
                                            hover:bg-red-500/10
                                            text-red-400
                                            text-sm font-bold
                                            transition-all
                                        "
                                    >
                                        {t("delete")}
                                    </button>

                                    <button
                                        onClick={() => setActiveNoteId(null)}
                                        className="
                                            bg-c-brand
                                            text-white
                                            px-5 py-2 rounded-xl
                                            font-bold
                                        "
                                    >
                                        {t("done")}
                                    </button>
                                </div>
                            </div>
                        </header>

                        {/* CONTENT */}

                        <div className="flex-1 p-8">
                            <textarea
                                autoFocus
                                value={activeNote.content}
                                onChange={(e) =>
                                    updateNote(
                                        activeNote.id,
                                        "content",
                                        e.target.value
                                    )
                                }
                                placeholder={t("placeholder")}
                                className="
                                    w-full h-full
                                    bg-c-secondary/20
                                    border border-white/5
                                    rounded-[28px]
                                    p-8
                                    outline-none
                                    resize-none
                                    text-lg
                                    leading-relaxed
                                    focus:border-c-brand/30
                                    transition-all
                                "
                            />
                        </div>
                    </motion.div>

                ) : (

                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-8"
                    >

                        {/* HEADER */}

                        <div className="max-w-7xl mx-auto mb-10">

                            <h1 className="text-5xl font-black tracking-tight">
                                {t("title")}
                            </h1>

                            <p className="text-c-text/30 text-[11px] uppercase tracking-[0.25em] mt-3 font-bold">
                                {notes.length}{" "}
                                {notes.length === 1
                                    ? t("note")
                                    : t("notes")}{" "}
                                • {t("organize")}
                            </p>

                            <button
                                onClick={createNote}
                                className="
                                    mt-8
                                    bg-c-brand
                                    text-white
                                    px-6 py-3
                                    rounded-xl
                                    font-bold
                                    hover:brightness-110
                                    transition-all
                                "
                            >
                                + {t("newNote")}
                            </button>
                        </div>

                        {/* GRID */}

                        <div className="max-w-7xl mx-auto">

                            {notes.length === 0 ? (

                                <div className="text-center py-20">
                                    <p className="text-c-text/30">
                                        {t("empty")}
                                    </p>

                                    <p className="text-c-text/15 text-sm mt-2">
                                        {t("create")}
                                    </p>
                                </div>

                            ) : (

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                    {notes.map((note) => (

                                        <motion.div
                                            key={note.id}
                                            whileHover={{ y: -2 }}
                                            transition={{ duration: 0.15 }}
                                            className="
                                                group
                                                relative
                                                bg-c-secondary/20
                                                border border-white/5
                                                hover:border-white/10
                                                rounded-[24px]
                                                p-6
                                                cursor-pointer
                                                transition-all
                                            "
                                            onClick={() => setActiveNoteId(note.id)}
                                        >

                                            {/* DELETE */}

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNote(note.id);
                                                }}
                                                className="
                                                    absolute top-4 right-4
                                                    opacity-0 group-hover:opacity-100
                                                    transition-all
                                                    p-1.5
                                                    rounded-lg
                                                    hover:bg-red-500/10
                                                "
                                            >
                                                ✕
                                            </button>

                                            <div className="mb-4">
                                                <h2 className="font-bold text-lg text-c-text/90 line-clamp-2">
                                                    {note.title || t("untitled")}
                                                </h2>

                                                <span className="text-[10px] uppercase tracking-widest text-c-text/20">
                                                    {note.updatedAt}
                                                </span>
                                            </div>

                                            <p className="text-sm text-c-text/40 line-clamp-4 leading-relaxed">
                                                {note.content || t("noText")}
                                            </p>

                                            <div className="mt-5 pt-4 border-t border-white/5 text-[10px] uppercase tracking-wider text-c-text/20">
                                                {note.content.split(" ").length} {t("words")}
                                            </div>

                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}