import { use, useEffect } from "react";
import "../../global.css";

const temp_data = [ //replace with loading of actual data once that is implemented
  {
    id: 1,
    file: "path/to/file1",
    title: "Project 1",
    description: "Description for project 1",
  },
  {
    id: 1,
    file: "path/to/file1",
    title: "Project 1",
    description: "Description for project 1",
  },
  {
    id: 1,
    file: "path/to/file1",
    title: "Project 1",
    description: "Description for project 1",
  },
  {
    id: 1,
    file: "path/to/file1",
    title: "Project 1",
    description: "Description for project 1",
  },
  {
    id: 1,
    file: "path/to/file1",
    title: "Project 1",
    description: "Description for project 1",
  },
  {
    id: 1,
    file: "path/to/file1",
    title: "Project 1",
    description: "Description for project 1",
  },
  {
    id: 1,
    file: "path/to/file1",
    title: "Project 1",
    description: "Description for project 1",
  },
  {
    id: 1,
    file: "path/to/file1",
    title: "Project 1",
    description: "Description for project 1",
  },
  {
    id: 1,
    file: "path/to/file1",
    title: "Project 1",
    description: "Description for project 1",
  },
  {
    id: 1,
    file: "path/to/file1",
    title: "Project 1",
    description: "Description for project 1",
  },

  {
    id: 1,
    file: "path/to/file1",
    title: "Project 1",
    description: "Description for project 1",
  },
  {
    id: 1,
    file: "path/to/file1",
    title: "Project 1",
    description: "Description for project 1",
  },
  {
    id: 1,
    file: "path/to/file1",
    title: "Project 1",
    description: "Description for project 1",
  },
  {
    id: 1,
    file: "path/to/file1",
    title: "Project 1",
    description: "Description for project 1",
  },

  {
    id: 1,
    file: "path/to/file1",
    title: "Project 1",
    description: "Description for project 1",
  },
  {
    id: 1,
    file: "path/to/file1",
    title: "Project 1",
    description: "Description for project 1",
  },
  {
    id: 1,
    file: "path/to/file1",
    title: "Project 1",
    description: "Description for project 1",
  },
  {
    id: 1,
    file: "path/to/file1",
    title: "Project 1",
    description: "Description for project 1",
  },
]

export default function Library() {
  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Biblotek</h2>
        <button className="bg-blue-500 px-4 py-2 rounded">Ny</button>
      </div>
      <div className="grid grid-cols-5 gap-10">
        {temp_data.map((item, index) => (
          <div key={index} className="bg-c-brand w-full h-[200px] rounded-lg p-4">
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
