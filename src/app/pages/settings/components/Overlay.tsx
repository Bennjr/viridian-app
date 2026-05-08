import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../../../components";
import { getCurrentWindow } from "@tauri-apps/api/window";

type Message = {
    role: 'user' | 'ai';
    content: string;
};

function DragHandle() {
    const [isPressed, setIsPressed] = useState(false);

    const handleMouseDown = async () => {
        setIsPressed(true);

        try {
            await getCurrentWindow().startDragging();
        } finally {
            setIsPressed(false);
        }
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            className={`
        non-draggable transition-all duration-200
        bg-c-brand w-3 rounded-r-full hover:brightness-110
        ${isPressed ? 'h-[65%] cursor-grabbing' : 'h-[75%] cursor-grab'}
      `}
        />
    );
}

interface ActionBarProps {
    mode: string;
    settings: any;
    setSettings: (s: any) => void;
}

function ActionBar({ mode, settings, setSettings }: ActionBarProps) {
    if (!mode) return null;

    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className=" bg-c-secondary border-white/5 flex overflow-hidden"
        >
            {mode === "translate" && (
                <div className="flex items-center w-full">
                    <button className="flex w-fit non-draggable items-center gap-2 px-3 py-1 bg-c-tertiery rounded-l-full border border-white/5 text-[10px] font-bold uppercase tracking-wider hover:bg-c-hover transition-all">
                        <span>Auto</span>
                        <Icon src="/chevron-down.svg" size="w-2 h-2" className="opacity-50" />
                    </button>

                    <Icon src="/arrow-right.svg" size="w-6 h-6" className="opacity-20" />

                    {/* To Language */}
                    <button className="flex w-fit non-draggable items-center gap-2 px-3 py-1 bg-c-tertiery text-c-brand rounded-r-full text-[10px] font-bold uppercase tracking-wider hover:bg-c-hover transition-all">
                        <span>Norsk (BM)</span>
                        <Icon src="/chevron-down.svg" size="w-2 h-2" className="opacity-20" />
                    </button>

                    <div className="ml-auto flex ">
                        <button title="Kopier resultat" className="p-1.5 hover:bg-white/5 rounded-md opacity-40 hover:opacity-100 transition-all">
                            <Icon src="/copy.svg" size="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}

            {mode === "chat" && (
                <div className="flex items-center gap-2 w-full p-2">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-30 mr-2">AI</span>

                    {['Forklar', 'Oppsummer', 'Rett feil'].map((task) => (
                        <button
                            key={task}
                            onClick={() => setSettings({ ...settings, aiTask: task })}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all border
                ${settings.aiTask === task
                                    ? 'bg-c-brand text-white border-c-brand shadow-lg shadow-c-brand/10'
                                    : 'bg-transparent border-white/10 opacity-50 hover:opacity-100'}
              `}
                        >
                            {task}
                        </button>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
const TOOLBAR_ACTIONS = [
    { id: 'settings', icon: "/settings.svg", title: "Instillinger", action: "settings" },
    { id: 'speak', icon: '/audio.svg', title: 'Les opp tekst', action: 'speak' },
    { id: 'chat', icon: '/star.svg', title: 'AI Assistent', action: 'toggleChat' },
    { id: 'translate', icon: '/translate.svg', title: 'Oversett', action: 'translate' },
    { id: 'hide', icon: '/eye.svg', title: 'Skjul vindu', action: 'toggleEye' },
    { id: 'resize', icon: '/chevron-down.svg', title: 'Vis/Skjul felt', action: 'windowSizeToggle', isChevron: true },
];

export default function Overlay({ previewLabel }: { previewLabel?: string }) {
    const [isWindowOpen,] = useState(false);

    const [activeMode,] = useState<string | null>(null);
    const [settings, setSettings] = useState({ aiTask: 'Forklar' });

    return (
        // Changed h-screen to h-full for the preview to work
        <section className="draggable h-full flex flex-col bg-c-primary border border-white/10 shadow-2xl overflow-hidden select-none rounded-2xl">
            {/* Toolbar area */}
            <div className="z-10 flex items-center justify-around h-[75px] pr-2 bg-c-secondary/80 backdrop-blur-lg border-b border-white/5">
                <DragHandle />
                {TOOLBAR_ACTIONS.map((item) => {
                    const isResize = item.id === 'resize';
                    return (
                        <button
                            key={item.id}
                            title={item.title}
                            className={`
                group relative flex items-center justify-center size-12 rounded-2xl non-draggable
                transition-all duration-200 active:scale-90
                ${isResize && isWindowOpen ? "bg-c-brand/20" : "hover:bg-white/5"}
              `}
                        >
                            <Icon
                                src={item.icon}
                                color={isResize && isWindowOpen ? "bg-c-brand" : "bg-c-icon"}
                                className={`
                  ${item.isChevron && !isWindowOpen ? "rotate-180" : ""}
                  transition-transform duration-300 group-hover:scale-110
                `}
                            />

                            {isResize && isWindowOpen && (
                                <div className="absolute -bottom-1 size-1 bg-c-brand rounded-full shadow-[0_0_8px_var(--c_brand)]" />
                            )}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence>
                {isWindowOpen && (
                    <motion.div className="flex-1 flex flex-col p-2 overflow-hidden">
                        {/* Action Bar */}
                        <ActionBar mode={activeMode || ""} settings={settings} setSettings={setSettings} />

                        <div className="relative flex-1 bg-c-secondary/30 rounded-2xl border border-white/5 p-1">
                            {/* Visual indicator of the selected item inside the overlay */}
                            {previewLabel && (
                                <div className="absolute top-2 right-4 z-20 px-2 py-0.5 rounded bg-c-brand/20 border border-c-brand/30 text-[9px] font-bold text-c-brand uppercase tracking-widest animate-pulse">
                                    Target: {previewLabel}
                                </div>
                            )}

                            <textarea
                                // ... existing textarea props
                                placeholder={previewLabel ? `Ready to work on ${previewLabel}...` : "Start typing..."}
                            />
                            {/* ... rest of your textarea logic */}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}