import { Outlet } from "react-router-dom";
import { Sidebar, Bottombar, Topbar } from "../../../components";
import "../../global.css";
import { useEffect, useState } from "react";

export default function Layout() {
    const [fontSize, setFontSize] = useState("medium");

    useEffect(() => {
        const savedSize = localStorage.getItem("fontSize") || "medium";
        setFontSize(savedSize);
    }, []);

    // REDEFINED: Much tighter "Pro" font sizing
    const fontConfig: Record<string, string> = {
        small: `
            [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm
            [&_p]:text-[11px] [&_span]:text-[10px] [&_button]:text-[10px]
        `,
        medium: `
            [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base
            [&_p]:text-[13px] [&_span]:text-[12px] [&_button]:text-[12px]
        `,
        large: `
            [&_h1]:text-3xl [&_h2]:text-xl [&_h3]:text-lg
            [&_p]:text-base [&_span]:text-sm [&_button]:text-sm
        `
    };

    return (
        <main className={`
            w-screen h-screen flex flex-col overflow-hidden 
            bg-c-primary text-c-text select-none
            ${fontConfig[fontSize] || fontConfig.medium}
        `}>
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Topbar />

                    {/* FIX: Changed overflow-y-auto to overflow-hidden */}
                    <section className="flex-1 overflow-hidden relative">
                        <Outlet />
                    </section>
                </div>
            </div>

            <Bottombar />
        </main>
    );
}