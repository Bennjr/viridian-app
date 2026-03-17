import "../../global.css";
import { useState, useEffect } from "react";

interface Props {
    setFirstStart: any;
}

export default function Onboarding({ setFirstStart }: Props) {
    const [step, setStep] = useState(0);

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

    const themeClass =
        theme === "dark"
            ? "bg-black text-white"
            : theme === "high-contrast"
            ? "bg-yellow-200 text-black"
            : theme === "green"
            ? "bg-green-700 text-white"
            : "bg-white text-black";

    const fontClass =
        fontSize === "small"
            ? "text-sm"
            : fontSize === "large"
            ? "text-xl"
            : "text-base";

    return (
        <div className={`h-screen flex ${themeClass} ${fontClass} transition-all duration-500`}>

            {/* 🔥 FULLSCREEN START */}
            {step === 0 && (
                <div className="fixed inset-0 bg-gradient-to-br from-green-600 to-green-800 text-white flex items-center justify-center">

                    <div className="max-w-2xl w-full p-10 space-y-8">

                        <div className="text-6xl font-bold tracking-tight">
                            Viridian
                        </div>

                        <div>
                            <h1 className="text-4xl font-bold">
                                Velkommen til Viridian
                            </h1>
                            <p className="text-xl opacity-90 mt-3 leading-relaxed">
                                App for helping dyslexic people
                            </p>
                        </div>

                        <button
                            className="mt-6 bg-white text-black px-8 py-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition"
                            onClick={() => setStep(1)}
                        >
                            Start
                        </button>

                    </div>
                </div>
            )}

            {/* 🔥 OVERLAY PREVIEW */}
            {textMode === "floating" && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-2xl px-6 py-3 rounded-full flex gap-4 transition-all duration-300">
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                </div>
            )}

            {textMode === "fixed" && (
                <div className="fixed top-0 left-0 w-full bg-white shadow-lg py-3 flex justify-center gap-4">
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                </div>
            )}

            <div className="m-auto w-full max-w-3xl p-6">

                {/* STEP 1 */}
                {step === 1 && (
                    <div className="space-y-6">

                        <h2 className="text-2xl font-bold">Tilpass appen</h2>

                        {/* Font */}
                        <div className="bg-blue-100 p-5 rounded-xl text-black shadow-sm">
                            <p className="font-semibold">Tekststørrelse</p>
                            <select
                                className="mt-3 p-2 border rounded w-full"
                                value={fontSize}
                                onChange={(e) => setFontSize(e.target.value)}
                            >
                                <option value="small">Liten</option>
                                <option value="medium">Medium</option>
                                <option value="large">Stor</option>
                            </select>
                        </div>

                        {/* UI */}
                        <div className="bg-yellow-100 p-5 rounded-xl text-black shadow-sm">
                            <p className="font-semibold">Velg plassering av meny</p>

                            <div className="flex gap-4 mt-4">

                                <div
                                    onClick={() => setTextMode("floating")}
                                    className={`cursor-pointer border-2 p-4 w-1/2 rounded-xl transition duration-300 hover:scale-105 active:scale-95 ${
                                        textMode === "floating"
                                            ? "border-blue-500 shadow-md"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <div className="h-24 bg-white border rounded relative">
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-gray-300 rounded-full"></div>
                                    </div>
                                    <p className="text-center mt-2">Flytende</p>
                                </div>

                                <div
                                    onClick={() => setTextMode("fixed")}
                                    className={`cursor-pointer border-2 p-4 w-1/2 rounded-xl transition duration-300 hover:scale-105 active:scale-95 ${
                                        textMode === "fixed"
                                            ? "border-blue-500 shadow-md"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <div className="h-24 bg-white border rounded relative">
                                        <div className="absolute top-0 left-0 w-full h-4 bg-gray-300"></div>
                                    </div>
                                    <p className="text-center mt-2">Topp</p>
                                </div>

                            </div>
                        </div>

                        <button
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:scale-105 active:scale-95 transition"
                            onClick={() => setStep(2)}
                        >
                            Neste
                        </button>

                    </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <div className="space-y-6 text-center">

                        <h2 className="text-2xl font-bold">Velg tema</h2>

                        <div className="flex gap-6 justify-center flex-wrap">

                            {[
                                { name: "light", label: "Lys", color: "bg-white" },
                                { name: "dark", label: "Mørk", color: "bg-black" },
                                { name: "green", label: "Grønn", color: "bg-green-600" },
                                { name: "high-contrast", label: "Kontrast", color: "bg-yellow-200" },
                            ].map((t) => (
                                <div
                                    key={t.name}
                                    onClick={() => setTheme(t.name)}
                                    className={`cursor-pointer p-3 rounded-xl transition duration-300 hover:scale-110 active:scale-95 ${
                                        theme === t.name
                                            ? "border-2 border-blue-500 shadow-md"
                                            : ""
                                    }`}
                                >
                                    <div className={`w-32 h-20 ${t.color} border rounded-lg`}></div>
                                    <p className="mt-2">{t.label}</p>
                                </div>
                            ))}

                        </div>

                        <div className="flex justify-center gap-4">
                            <button onClick={() => setStep(1)}>Tilbake</button>

                            <button
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:scale-105 active:scale-95 transition"
                                onClick={() => setFirstStart(false)}
                            >
                                Start
                            </button>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}