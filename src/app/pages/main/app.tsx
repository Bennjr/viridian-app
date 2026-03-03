import "./app.css";

import Header from "./components/header";
import Sidebar from "./components/sidebar";

export default function App() {
  return (
    <main className="bg-black w-screen h-screen grid grid-cols-[auto_1fr]">
      <Sidebar />
      <section>
        <Header />
      </section>
    </main>
  );
}
