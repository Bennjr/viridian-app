import { NavLink } from "react-router-dom";
import "../../global.css"
import { useState } from "react";

import { useTheme } from "../../../context/ThemeContext";
import { DoubleSelect, Slider, Toggle, ThemeSelector } from "../../../components"

// EXAMPLE COMPONENT USAGE
//
//  <SettingItem label="Foo">
//      <button className="bg-c-brand px-6 py-1">bar</button>
//      <button className="bg-neutral-700 px-6 py-1">bob</button>
//  </SettingItem >
//

export default function Settings() {
    const [searchQuery, setSearchQuery] = useState("");

    const handleToggle = (checked: boolean) => {
        console.log("checked")
    };

    return (
        <div className="bg-c-primary text-c-text min-h-screen min-w-screen">
            <NavLink to="/" className="p-2 fixed"> <img src="/chevron-down.svg" alt="back" className="h-auto w-8 rotate-90" /> </NavLink >
            <div className="px-32 py-10 max-w-[1200px]">
                <nav className="grid grid-rows-[auto_auto] gap-6">
                    <div>
                        <div className="grid grid-cols-[auto_auto] gap-2">
                            <h2 className="text-3xl font-bold">Innstillinger</h2>
                        </div>
                        <p>Her kan du justere på alle instillinger i appen</p>
                    </div>
                    <div>
                        <input type="text" placeholder="Søk instillinger" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-1 border rounded" />
                    </div>
                </nav>

                <section className="flex flex-col gap-2">
                    <h1 className="text-xl font-bold">Generell</h1>
                    <Toggle label="Automatisk start" enabled={true} onChange={handleToggle} />

                    <DoubleSelect label="Varslinger">
                        <button className="bg-c-brand px-12 py-1">På</button>
                        <button className="bg-c-secondary px-12 py-1">Av</button>
                    </DoubleSelect>
                </section>
                <section className="flex flex-col gap-5 pt-5">
                    <h1 className="text-xl font-bold">Farger og tema</h1>
                    <Slider label={"some label"} range={100} />
                    <div>
                        <h1>Velg tema</h1>
                        <ThemeSelector></ThemeSelector>
                    </div>
                </section>
            </div>
        </div >
    );
}