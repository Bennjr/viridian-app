import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Icon } from "../index"

interface SettingItemProps {
    label: string;
    children: React.ReactNode;
}

// Inside settingitems.tsx
export function DoubleSelect({ label, children }: SettingItemProps) {
    return (
        <div className="flex items-center justify-between group">
            <div className="text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                {label}
            </div>
            <div className="flex border border-white/10 rounded-xl overflow-hidden divide-x divide-white/10 shadow-lg">
                {children}
            </div>
        </div>
    );
}

export function Slider({ label }: { label: string, range?: number }) {
    const [val, setVal] = useState("50");
    return (
        <div className="flex items-center justify-between group py-2">
            <div className="text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                {label}
            </div>
            <div className="flex items-center gap-4 w-1/2">
                <span className="text-[10px] font-mono opacity-40 w-8">{val}%</span>
                <input
                    type="range"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    className="flex-1 accent-c-brand cursor-pointer h-1.5 bg-white/10 rounded-full appearance-none"
                />
            </div>
        </div>
    );
}

interface ToggleProps {
    label: string;
    enabled: boolean;
    onChange: (state: boolean) => void;
}

export function Toggle({ label, enabled, onChange }: ToggleProps) {
    return (
        <label className="flex items-center justify-between group cursor-pointer select-none py-2">
            <span className="text-sm font-medium text-c-text opacity-80 group-hover:opacity-100 transition-opacity">
                {label}
            </span>

            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={enabled}
                    onChange={(e) => onChange(e.target.checked)}
                />

                <div className="w-11 h-6 bg-c-tertiery rounded-full peer peer-checked:bg-c-brand transition-colors duration-200 border border-white/5 shadow-inner" />

                <div className="absolute left-[4px] top-[4px] bg-white w-4 h-4 rounded-full transition-transform duration-200 peer-checked:translate-x-5 shadow-md" />
            </div>
        </label>
    );
}

const THEMES = [
    { id: 'default', label: 'System' },
    { id: 'light', label: 'Lys' },
    { id: 'dark', label: 'Mørk' },
    { id: 'contrast', label: 'Kontrast' },
];

export function ThemeSelector() {
    const { theme, setTheme } = useTheme();

    return (
        <ul className="grid grid-cols-4 gap-3 select-none p-6 border border-c-divider rounded-lg">
            {THEMES.map((t) => {
                const isActive = theme === t.id;

                return (
                    <li key={t.id}>
                        <button
                            onClick={() => setTheme(t.id)}
                            className="group w-full flex flex-col gap-2 transition-all"
                        >
                            <div
                                data-theme={t.id !== 'default' ? t.id : undefined}
                                className={`
                                    relative aspect-[16/10] w-full rounded-lg border-2 overflow-hidden bg-c-primary transition-all
                                    ${isActive ? 'border-c-brand ring-2 ring-c-brand/20' : 'border-c-dividers hover:border-c-text/30'}
                                `}
                                style={t.id === 'default' ? {
                                    background: 'linear-gradient(to top right, #2a2b2a 50%, #f5f5f5 50%)'
                                } : {}}
                            >
                                <div className={`
                                    absolute left-0 top-0 bottom-0 w-1/3 border-r transition-colors
                                    ${t.id === 'default'
                                        ? 'bg-black/10 border-black/10 backdrop-blur-[1px]'
                                        : 'bg-c-secondary_bg border-c-dividers'}
                                `}>
                                    <div className="mt-2 ml-1 h-1 w-2/3 rounded-full bg-c-brand/40" />
                                    <div className="mt-1 ml-1 h-1 w-1/2 rounded-full bg-c-text/20" />
                                </div>

                                <div className="absolute left-[33%] right-0 top-0 bottom-0 p-2 flex flex-col gap-1">
                                    <div className={`h-1.5 w-full rounded-full ${t.id === 'default' ? 'bg-black/20' : 'bg-c-text/10'}`} />
                                    <div className={`h-1.5 w-2/3 rounded-full ${t.id === 'default' ? 'bg-black/20' : 'bg-c-text/10'}`} />
                                    <div className="mt-auto h-2 w-full rounded bg-c-brand" />
                                </div>

                                {isActive && (
                                    <div className="absolute inset-0 bg-c-brand/10 flex items-center justify-center backdrop-blur-[0.5px]">
                                        <div className="bg-c-brand text-white rounded-full p-0.5 shadow-lg">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isActive ? 'text-c-brand' : 'opacity-40'}`}>
                                {t.label}
                            </span>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}

export function FontSize() {
    const [fontSize, setFontSize] = useState(() => {
        return localStorage.getItem("fontSize") || "medium";
    });

    useEffect(() => {
        localStorage.setItem("fontSize", fontSize);
    }, [fontSize]);

    return (
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
    )
}

export function ToolbarDragDrop() {
    const TOOLBAR_ACTIONS = [
        { id: 'settings', icon: "/settings.svg", title: "Instillinger", action: "settings" },
        { id: 'speak', icon: '/audio.svg', title: 'Les opp tekst', action: 'speak' },
        { id: 'chat', icon: '/star.svg', title: 'AI Assistent', action: 'toggleChat' },
        { id: 'translate', icon: '/translate.svg', title: 'Oversett', action: 'translate' },
        { id: 'hide', icon: '/eye.svg', title: 'Skjul vindu', action: 'toggleEye' },
        { id: 'resize', icon: '/chevron-down.svg', title: 'Vis/Skjul felt', action: 'windowSizeToggle', isChevron: true },
    ];

    return (
        <div className="z-10 flex items-center gap-2     h-[75px] pr-2 bg-c-secondary/80 backdrop-blur-lg">
            {TOOLBAR_ACTIONS.map((item) => {
                return (
                    <button
                        key={item.id}
                        title={item.title}
                        className={`group relative bg-c-secondary flex items-center justify-center size-12 rounded-2xl non-draggable
                            transition-all duration-200 active:scale-90`}
                    >
                        <Icon
                            src={item.icon}
                        />
                    </button>
                );
            })}
        </div>
    )
}