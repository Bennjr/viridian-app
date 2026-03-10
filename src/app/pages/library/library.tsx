import { useState } from "react";
import "../../global.css";

const temp_data = [
  {
    id: 1,
    file: "path/to/file1",
    title: "Project 1",
    description: "Description for project 1",
  },
];

export default function Library() {
  const [projects, setProjects] = useState(temp_data);
  const [editingId, setEditingId] = useState(null);
  const [editingDescId, setEditingDescId] = useState(null);

  function addProject() {
    const newProject = {
      id: Date.now(),
      title: "Nytt prosjekt",
      description: "Klikk for å legge til beskrivelse",
    };
    setProjects([...projects, newProject]);
  }

  function renameProject(id, newTitle) {
    setProjects(
      projects.map((p) =>
        p.id === id ? { ...p, title: newTitle } : p
      )
    );
  }

  function changeDescription(id, newDesc) {
    setProjects(
      projects.map((p) =>
        p.id === id ? { ...p, description: newDesc } : p
      )
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Bibliotek</h2>
        <button
          onClick={addProject}
          className="bg-blue-500 px-4 py-2 rounded text-white"
        >
          Ny
        </button>
      </div>

      <div className="grid grid-cols-5 gap-10">
        {projects.map((item) => (
          <div
            key={item.id}
            className="bg-c-brand w-full h-[200px] rounded-lg p-4"
          >
            {/* TITTEL */}
            {editingId === item.id ? (
              <input
                autoFocus
                defaultValue={item.title}
                onBlur={(e) => {
                  renameProject(item.id, e.target.value);
                  setEditingId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    renameProject(item.id, e.target.value);
                    setEditingId(null);
                  }
                }}
                className="text-xl font-bold border-b border-black outline-none w-full"
              />
            ) : (
              <h3
                className="text-xl font-bold cursor-pointer"
                onClick={() => setEditingId(item.id)}
              >
                {item.title}
              </h3>
            )}

            {/* BESKRIVELSE */}
            {editingDescId === item.id ? (
              <textarea
                autoFocus
                defaultValue={item.description}
                onBlur={(e) => {
                  changeDescription(item.id, e.target.value);
                  setEditingDescId(null);
                }}
                className="mt-2 w-full text-sm border rounded p-1 outline-none resize-none"
                rows={3}
              />
            ) : (
              <p
                className="mt-2 text-sm cursor-pointer opacity-80 hover:opacity-100"
                onClick={() => setEditingDescId(item.id)}
              >
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center mt-20 opacity-60">
          <p>Du har ingen prosjekter ennå</p>
          <button
            onClick={addProject}
            className="mt-4 bg-blue-500 px-4 py-2 rounded text-white"
          >
            Lag ditt første prosjekt
          </button>
        </div>
      )}
    </div>
  );
}