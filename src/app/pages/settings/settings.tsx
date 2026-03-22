import { NavLink } from "react-router-dom";
import "../../global.css"
import { useState } from "react";

import { Icon } from "../../../components";

import { DoubleSelect, Slider, Toggle, ThemeSelector, FontSize } from "../../../components"

// EXAMPLE COMPONENT USAGE
//
//  <SettingItem label="Foo">
//      <button className="bg-c-brand px-6 py-1">bar</button>
//      <button className="bg-neutral-700 px-6 py-1">bob</button>
//  </SettingItem >
//

export default function Settings() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        /* 1. Force the container to be exactly the screen height and stop it from scrolling */
        <div className="bg-c-primary text-c-text h-screen flex flex-col overflow-hidden">

            {/* 2. HEADER: Remains at the top */}
            <header className="px-8 pt-12 pb-8 max-w-5xl w-full mx-auto flex-shrink-0">
                <div className="flex items-end gap-4 mb-6">
                    <NavLink to="/" className="p-2 hover:bg-c-secondary rounded-full transition-colors">
                        <Icon src="/chevron-down.svg" className="rotate-90" />
                    </NavLink>
                    <div>
                        <h2 className="text-4xl font-black tracking-tight">Innstillinger</h2>
                        <p className="opacity-50 text-sm">Tilpass Viridian for din leseopplevelse</p>
                    </div>
                </div>

                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Søk i innstillinger..."
                        className="w-full pl-12 pr-4 py-3 bg-c-secondary border border-white/5 rounded-2xl outline-none"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20">
                        <Icon src="/search.svg" size="w-5 h-5" />
                    </div>
                </div>
            </header>

            {/* 3. MAIN AREA: Takes up the remaining space */}
            <main className="flex-1 max-w-5xl w-full mx-auto grid grid-cols-[200px_1fr] gap-12 overflow-hidden px-8 pb-8">

                {/* 4. NAV: Stays put because the parent main is overflow-hidden */}
                <nav className="flex flex-col gap-2 h-fit pt-2">
                    <button className="text-left px-4 py-2 rounded-lg bg-c-brand/10 text-c-brand font-bold text-sm">Generelt</button>
                    <button className="text-left px-4 py-2 rounded-lg hover:bg-white/5 text-sm opacity-50">Utseende</button>
                    <button className="text-left px-4 py-2 rounded-lg hover:bg-white/5 text-sm opacity-50">Tilgjengelighet</button>
                    <button className="text-left px-4 py-2 rounded-lg hover:bg-white/5 text-sm opacity-50">Om Appen</button>
                </nav>

                {/* 5. CONTENT: The ONLY part that scrolls */}
                <div className="space-y-10 overflow-y-auto pr-6 h-full custom-scrollbar">

                    {/* SECTION: GENERELT */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-30 ml-1">Generelt</h3>
                        <div className="bg-c-secondary/30 border border-white/5 rounded-3xl p-6 space-y-6">
                            <Toggle label="Start automatisk ved pålogging" enabled={true} onChange={() => { }} />
                            <div className="h-[1px] bg-white/5 w-full" />
                            <DoubleSelect label="System-varslinger">
                                <button className="bg-c-brand px-12 py-1.5 text-xs font-bold text-white">På</button>
                                <button className="bg-c-secondary px-12 py-1.5 text-xs font-bold opacity-40">Av</button>
                            </DoubleSelect>
                        </div>
                    </section>

                    {/* SECTION: UTSEENDE */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-30 ml-1">Utseende</h3>
                        <div className="bg-c-secondary/30 border border-white/5 rounded-3xl p-6 space-y-8">
                            <div>
                                <p className="text-sm font-bold mb-4">Tekststørrelse</p>
                                <FontSize />
                            </div>
                            <div className="h-[1px] bg-white/5 w-full" />
                            <Slider label="Meny Gjennomsiktighet" range={100} />
                            <div>
                                <p className="text-sm font-bold mb-4">Fargetema</p>
                                <ThemeSelector />
                            </div>
                        </div>
                    </section>

                    {/* Extra padding so the bottom isn't cut off */}
                    <div className="h-20" />
                </div>
            </main>
        </div>
    );
}