import "../../global.css";
import { useState, useEffect } from "react";

import { ThemeSelector } from "../../../components"

const ProgressBar = ({ step, total }: { step: number; total: number }) => {
    return (
        <div className="flex flex-col gap-2 w-full max-w-xs mx-auto mb-8">
            <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-50 font-bold">
                <span>Fremgang</span>
                <span>Steg {step} av {total}</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-c-brand transition-all duration-500 ease-out"
                    style={{ width: `${(step / total) * 100}%` }}
                />
            </div>
        </div>
    );
};

interface Props {
    setFirstStart: any;
}

export default function Onboarding({ setFirstStart }: Props) {
    const [step, setStep] = useState(0);
    const totalSteps = 3;

    const [fontSize, setFontSize] = useState("medium");
    const [theme, setTheme] = useState("light");
    const [textMode, setTextMode] = useState("floating");

    useEffect(() => {
        setFontSize(localStorage.getItem("fontSize") || "medium");
        setTheme(localStorage.getItem("theme") || "light");
        setTextMode(localStorage.getItem("textMode") || "floating");
    }, []);

    useEffect(() => {
        localStorage.setItem("fontSize", fontSize);
        localStorage.setItem("theme", theme);
        localStorage.setItem("textMode", textMode);
    }, [fontSize, theme, textMode]);

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    return (
        <div className="h-screen w-screen bg-c-primary text-c-text overflow-hidden flex flex-col">

            {/* INTRO SCREEN (Step 0) */}
            {step === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-in fade-in zoom-in duration-700">
                    <div className="mb-6 size-24 bg-c-brand rounded-3xl shadow-2xl shadow-c-brand/20 flex items-center justify-center text-4xl font-black text-white">V</div>
                    <h1 className="text-5xl font-black tracking-tight mb-4">Velkommen til Viridian</h1>
                    <p className="text-xl opacity-60 max-w-md leading-relaxed mb-10">
                        Et verktøy designet for å gjøre lesing og skriving enklere for deg med dysleksi.
                    </p>
                    <button
                        className="bg-c-brand text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-c-brand/20 hover:scale-105 active:scale-95 transition-all"
                        onClick={nextStep}
                    >
                        Kom i gang
                    </button>
                </div>
            )}

            {step > 0 && (
                <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-8">

                    <ProgressBar step={step} total={totalSteps} />

                    <div className="flex-1 flex flex-col justify-center">

                        {/* STEP 1: FONT SIZE */}
                        {step === 1 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold mb-2">Velg tekststørrelse</h2>
                                    <p className="opacity-50">Velg den størrelsen som er mest behagelig å lese.</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: 'small', label: 'Liten', size: 'text-sm' },
                                        { id: 'medium', label: 'Medium', size: 'text-base' },
                                        { id: 'large', label: 'Stor', size: 'text-xl' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setFontSize(opt.id)}
                                            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4
                                                            ${fontSize === opt.id ? 'border-c-brand bg-c-brand/5' : 'border-white/5 bg-c-secondary hover:border-white/10'}
                                                        `}
                                        >
                                            <span className={`${opt.size} font-bold text-c-text`}>Aa</span>
                                            <span className="text-xs font-medium opacity-50">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STEP 2: UI MODE */}
                        {step === 2 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold mb-2">Menyplassering</h2>
                                    <p className="opacity-50">Hvordan vil du ha tilgang til verktøyene dine?</p>
                                </div>

                                <div className="flex gap-4">
                                    {[
                                        { id: 'floating', label: 'Flytende', desc: 'Alltid nær teksten' },
                                        { id: 'fixed', label: 'Topp', desc: 'Fast i toppen av skjermen' }
                                    ].map((mode) => (
                                        <button
                                            key={mode.id}
                                            onClick={() => setTextMode(mode.id)}
                                            className={`flex-1 p-6 rounded-2xl border-2 transition-all text-left
                                                            ${textMode === mode.id ? 'border-c-brand bg-c-brand/5' : 'border-white/5 bg-c-secondary hover:border-white/10'}
                                                        `}
                                        >
                                            <div className="h-24 bg-c-primary rounded-lg mb-4 relative overflow-hidden border border-white/5">
                                                {mode.id === 'floating' ? (
                                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-3 bg-c-brand rounded-full shadow-lg" />
                                                ) : (
                                                    <div className="absolute top-0 left-0 w-full h-3 bg-c-brand" />
                                                )}
                                            </div>
                                            <p className="font-bold">{mode.label}</p>
                                            <p className="text-xs opacity-50">{mode.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STEP 3: THEME */}
                        {step === 3 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold mb-2">Velg fargetema</h2>
                                    <p className="opacity-50">Dark mode er ofte best for dysleksi.</p>
                                </div>
                                <ThemeSelector />
                            </div>
                        )}
                    </div>

                    {/* NAVIGATION BAR */}
                    <div className="mt-auto py-10 flex items-center justify-between">
                        <button
                            onClick={prevStep}
                            className="px-6 py-2 font-bold opacity-40 hover:opacity-100 transition-opacity"
                        >
                            Tilbake
                        </button>

                        <button
                            className="bg-c-brand text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-c-brand/20 hover:scale-105 active:scale-95 transition-all"
                            onClick={step === totalSteps ? () => setFirstStart(false) : nextStep}
                        >
                            {step === totalSteps ? 'Start Viridian' : 'Neste'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}