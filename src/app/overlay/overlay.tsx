import "../global.css";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../components";
import { getCurrentWindow } from "@tauri-apps/api/window";

function DragHandle() {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = async () => {
    setIsPressed(true);

    try {
      // Tells the OS to start moving the window
      await getCurrentWindow().startDragging();
    } finally {
      // Once the drag is released or started, we reset the visual state
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

const TOOLBAR_ACTIONS = [
  { id: 'settings', icon: "settings.svg", title: "Instillinger", ation: "settings" },
  { id: 'speak', icon: '/audio.svg', title: 'Les opp tekst', action: 'speak' },
  { id: 'chat', icon: '/star.svg', title: 'AI Assistent', action: 'toggleChat' },
  { id: 'translate', icon: '/translate.svg', title: 'Oversett', action: 'translate' },
  { id: 'hide', icon: '/eye.svg', title: 'Skjul vindu', action: 'toggleEye' },
  { id: 'resize', icon: '/chevron-down.svg', title: 'Vis/Skjul felt', action: 'windowSizeToggle', isChevron: true },
];

export default function Overlay() {
  const [isEyeOpen, setIsEyeOpen] = useState(true);
  const [isWindowOpen, setWindowOpen] = useState(false);
  const [text, setText] = useState("");

  const actions: Record<string, () => void> = {
    speak: () => invoke("tts_speak", { usr: "" }),
    toggleChat: () => { /* AI Logic */ },
    toggleEye: () => {
      setIsEyeOpen(!isEyeOpen);
      invoke(isEyeOpen ? "w_hide" : "w_show");
    },
    translate: async () => {
      if (!isWindowOpen) windowSizeToggle();
      const res = await invoke<string>("translate");
      setText(res);
    },
    windowSizeToggle: () => {
      const nextState = !isWindowOpen;
      invoke("w_resize", { height: nextState ? 450 : 75 });
      setWindowOpen(nextState);
    },
    settings: () => { invoke("trigger_settings") }
  };

  const windowSizeToggle = actions.windowSizeToggle;

  return (
    <section className="draggable h-screen flex flex-col bg-c-primary border border-white/10 shadow-2xl overflow-hidden select-none">

      {/* 1. TOOLBAR AREA */}
      <div className="z-10 flex items-center justify-around h-[75px] pr-2 bg-c-secondary/80 backdrop-blur-lg border-b border-white/5">
        <DragHandle></DragHandle>
        {TOOLBAR_ACTIONS.map((item) => {
          const isResize = item.id === 'resize';
          return (
            <button
              key={item.id}
              onClick={actions[item.action]}
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

              {/* Tooltip-like glow for active state */}
              {isResize && isWindowOpen && (
                <div className="absolute -bottom-1 size-1 bg-c-brand rounded-full shadow-[0_0_8px_var(--c_brand)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* 2. EXPANDABLE CONTENT AREA */}
      <AnimatePresence>
        {isWindowOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex-1 flex flex-col p-3 draggable overflow-hidden"
          >
            <div className="relative flex-1 bg-c-secondary/30 rounded-2xl border border-white/5 p-1">
              <textarea
                value={text}
                spellCheck={false}
                onFocus={() => invoke("w_focus")}
                onBlur={() => invoke("w_unfocus")}
                onChange={(e) => setText(e.target.value)}
                placeholder="Oversettelse eller AI-svar..."
                className="
                  resize-none w-full h-full bg-transparent p-4 
                  text-c-text text-[15px] leading-relaxed outline-none
                  placeholder:opacity-20 scrollbar-none non-draggable
                "
              />

              {/* Subtle utility buttons inside the textarea */}
              {text && (
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button
                    onClick={() => setText("")}
                    className="px-3 py-1 text-[10px] font-bold uppercase tracking-tighter bg-c-primary/50 hover:bg-c-primary rounded-lg opacity-40 hover:opacity-100 transition-all"
                  >
                    Tøm
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}