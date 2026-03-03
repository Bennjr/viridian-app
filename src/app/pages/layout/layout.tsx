import { Outlet } from "react-router-dom";
import { Sidebar } from "../../../components";
import Header from "../../../components/nav/nav";

export default function Library() {
    return (
        <main className="bg-black w-screen h-screen grid grid-cols-[auto_1fr]">
            <Sidebar />
            <section>
                <Header />
                <Outlet /> 
            </section>
        </main>
    );
  }