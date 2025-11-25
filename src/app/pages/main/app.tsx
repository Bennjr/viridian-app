import "./app.css";

import Header from "./components/header";

export default function App() {
  return (
    <main className="bg-black w-screen h-screen">
      <Header />
      <p className="text-red-500">Hello!</p>
    </main>
  );
}
