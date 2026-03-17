import { Outlet } from "react-router-dom";
import { Sidebar, Bottombar } from "../../../components";
import "../../global.css";

export default function Layout() {
    return (
        <main className="w-screen h-screen flex flex-col overflow-hidden text-c-text">

            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <section className="hero flex-1 overflow-y-auto h-full">
                    <div className="p-8">
                        <Outlet />
                    </div>
                </section>
            </div>
            <Bottombar />
        </main>
    );
}