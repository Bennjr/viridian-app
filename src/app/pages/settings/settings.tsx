import { NavLink } from "react-router-dom";
import "../../global.css"
import { useState } from "react";

// EXAMPLE COMPONENT USAGE
//
//  <SettingItem label="Foo">
//      <button className="bg-c-brand px-6 py-1">bar</button>
//      <button className="bg-neutral-700 px-6 py-1">bob</button>
//  </SettingItem >
//

interface SettingItemProps {
    label: string;
    children: React.ReactNode;
}

const DoubleSelect = ({ label, children }: SettingItemProps) => (
    <div className="grid grid-cols-[1fr_auto] justify-between items-center py-2 mt-2 border-b border-white/5">
        <div className="">{label}</div>
        <div className="grid grid-cols-2">
            {children}
        </div>
    </div>
);

interface SliderProps {
    label: string;
    range: number;
}

const Slider = ({ label, range }: SliderProps) => {
    const [sliderState, setSliderState] = useState("")

    return (
        <div className="grid grid-cols-[1fr_auto] justify-between items-center py-2 mt-2 border-b border-white/5">
            <div className="">{label}</div>
            <div className="grid grid-cols-[1fr_auto] gap-2">
                <div className="">{sliderState}</div>
                <input type="range" step="5" onChange={(e) => setSliderState(e.target.value)} />
            </div>
        </div>
    )
}

interface MultichoiceProps {
    label: string;
    choices: object;
}

const Multichoice = ({ }: MultichoiceProps) => {
    return (
        <div></div>
    )
}

export default function Settings() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="bg-c-primary text-c-text min-h-screen min-w-screen">
            <NavLink to="/" className="p-2 fixed"> <img src="/chevron-down.svg" alt="back" className="h-auto w-8 rotate-90" /> </NavLink >
            <div className="px-32 py-10">
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
                    <DoubleSelect label="App Tema">
                        <button className="bg-c-brand px-6 py-1 hover:opacity-80 transition">Mørk</button>
                        <button className="bg-neutral-700 px-6 py-1 hover:opacity-80 transition">Lys</button>
                    </DoubleSelect>

                    <DoubleSelect label="Oppstart">
                        <button className="bg-c-brand px-6 py-1">Auto-start</button>
                        <button className="bg-neutral-700 px-6 py-1">Manuell</button>
                    </DoubleSelect>

                    <DoubleSelect label="Varslinger">
                        <button className="bg-c-brand px-6 py-1">På</button>
                        <button className="bg-neutral-700 px-6 py-1">Av</button>
                    </DoubleSelect>
                </section>
                <section className="flex flex-col gap-2 pt-5">
                    <h1 className="text-xl font-bold">Farger og tema</h1>
                    <Slider label={"some label"} range={100} />
                    <div className="bg-c-secondary p-2">
                        <h1 className="text-xl font-bold">Velg tema</h1>
                        <li className="grid grid-cols-[1fr_1fr_1fr] pt-2 pb-2 gap-2 select-none">
                            <ul className="bg-c-tertiery">
                                Mørk
                            </ul>
                            <ul className="bg-c-tertiery">
                                Lys
                            </ul>
                            <ul className="bg-c-tertiery">
                                Kontrast
                            </ul>
                        </li>
                    </div>
                </section>
            </div>
        </div>
    );
}