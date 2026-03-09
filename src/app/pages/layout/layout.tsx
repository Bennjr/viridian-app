import { Outlet } from "react-router-dom";
import { Sidebar } from "../../../components";

import "../../global.css";

export default function Layout() {
    return (
        <main className="w-screen h-screen flex overflow-hidden">
            
            <Sidebar />

            <section className="flex-1 bg-c-bg overflow-y-auto h-full">
                <div className="p-8">
                    <Outlet /> 
                </div>
            </section>
        </main>
    );
}