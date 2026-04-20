import { Outlet } from "react-router-dom";
import { Sidebar, Bottombar } from "../../../components";
import "../../global.css";
import { useEffect, useState } from "react";

export default function Layout() {
    const [fontSize, setFontSize] = useState("medium");

    useEffect(() => {
        const savedSize = localStorage.getItem("fontSize") || "medium";
        setFontSize(savedSize);
    }, []);

    const fontConfig: Record<string, string> = {
        small: `
            [&_h1]:text-xl 
            [&_h2]:text-lg 
            [&_p]:text-sm 
            [&_span]:text-xs 
            [&_button]:text-xs
        `,
        medium: `
            [&_h1]:text-3xl 
            [&_h2]:text-xl 
            [&_p]:text-base 
            [&_span]:text-sm 
            [&_button]:text-sm
        `,
        large: `
            [&_h1]:text-5xl 
            [&_h2]:text-3xl 
            [&_p]:text-xl 
            [&_span]:text-lg 
            [&_button]:text-base
            [&_p]:leading-relaxed
        `
    };

    return (
        <main className={`
            w-screen h-screen flex flex-col overflow-hidden 
            bg-c-primary text-c-text transition-all duration-0
            ${fontConfig[fontSize] || fontConfig.medium}
        `}>
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <section className="hero flex-1 overflow-y-auto h-full">
                    {/* The p-8 here ensures the scaled text isn't touching the edges */}
                    <div className="select-none">
                        <Outlet />
                    </div>
                </section>
            </div>
            <Bottombar />
        </main>
    );
}