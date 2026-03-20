const notes = [
    { title: "note1", content: "content" },
    { title: "note2", content: "content" },
    { title: "note3", content: "content" },
    { title: "note4", content: "content" },
]

const Note = () => {
    return (
        <div className="grid gap-2 select-none">
            {notes.map((f) => {
                return (
                    <div onClick={() => viewNote(f.title, f.content)} className="bg-c-secondary w-full p-2 hover:bg-c-hover">
                        <h1>{f.title}</h1>
                        <p>{f.content}</p>
                    </div>
                );
            })}
        </div>
    );
}

const viewNote = (title: string, content: string) => {
    return (
        <div className="w-screen h-screen bg-black">
            <header>{title}</header>
            <div><textarea name="note" id="note" value={content}></textarea></div>
        </div>
    )
}

export default function Notes() {
    return (
        <div>
            <h1 className="text-xl font-bold pb-5">Notater</h1>
            <fieldset>
                <Note />
            </fieldset>
        </div>
    )
}