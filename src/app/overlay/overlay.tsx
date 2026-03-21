import "../global.css";
import { invoke } from "@tauri-apps/api/core";
import { useState, useRef } from "react";

import { Icon } from "../../components"

const TOOLBAR_ACTIONS = [
  {
    id: 'speak',
    icon: '/audio.svg',
    alt: 'Audio',
    title: 'Play selected text',
    action: 'speak'
  },
  {
    id: 'chat',
    icon: '/star.svg',
    alt: 'AI',
    title: 'AI',
    action: 'toggleChat'
  },
  {
    id: 'translate',
    icon: '/translate.svg',
    alt: 'Translate',
    title: 'Translate selected text',
    action: 'translate'
  },
  {
    id: 'hide',
    icon: '/eye.svg',
    alt: 'Eye',
    title: 'Hide window',
    action: 'toggleEye',
    className: 'overlay-button' // Special class for this specific button
  },
  {
    id: 'resize',
    icon: '/chevron-down.svg',
    alt: 'Resize',
    title: 'Toggle Window Size',
    action: 'windowSizeToggle',
    isChevron: true // Flag to handle the rotation logic
  },
];

export default function Overlay() {
  const [isEyeOpen, setIsEyeOpen] = useState(true);
  const [isWindowOpen, setWindowOpen] = useState(false);
  const [text, setText] = useState("");

  const contentRef = useRef<HTMLDivElement>(null);

  const speak = () => invoke("tts_speak");

  const toggleChat = () => { };

  const toggleEye = () => {
    setIsEyeOpen(!isEyeOpen);
    if (isEyeOpen) {
      invoke("w_hide");
    } else {
      invoke("w_show");
    }
  };

  const translate = async () => {
    await invoke("w_resize", { height: 450 });

    const textContent = await invoke<string>("translate");
    setText(textContent);
  };

  const windowSizeToggle = () => {
    if (isWindowOpen) {
      invoke("w_resize", { height: 75 });
      setWindowOpen(false);
    } else {
      invoke("w_resize", { height: 450 });
      setWindowOpen(true);
    }
  };

  // Helpers
  const handleTextareaFocus = async () => {
    await invoke("w_focus");
  };

  const handleTextareaBlur = async () => {
    await invoke("w_unfocus");
  };

  const actions: Record<string, () => void> = {
    speak,
    toggleChat,
    translate,
    toggleEye,
    windowSizeToggle
  };

  return (
    <section className="draggable h-screen grid grid-cols-[auto] bg-c-primary" ref={contentRef}>
      <div className="draggable grid grid-cols-5 border-b border-c-divider w-screen h-[75px] place-items-center">
        {TOOLBAR_ACTIONS.map((item) => {
          const hasHover = item.id !== 'hide';

          return (
            <button
              key={item.id}
              onClick={actions[item.action]}
              title={item.title}
              className={`
                non-draggable size-12 p-3 cursor-pointer bg-c-secondary transition-all
                ${hasHover ? "hover:bg-c-hover" : ""}
                ${item.className || ""}
              `}
            >
              <Icon
                src={item.icon}
                color="bg-c-icon"
                className={`
                   ${item.isChevron && !isWindowOpen ? "rotate-180" : ""}
                   transition-transform duration-200
                `}
                id={item.isChevron ? "chevron-toggle" : undefined}
              />
            </button>
          );
        })}
      </div>
      <div className="select non-draggable w-full h-full p-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onMouseDown={handleTextareaFocus}
          onBlur={handleTextareaBlur}
          placeholder="Edit translation..."
          className="resize-none w-full h-full bg-c-secondary p-3 rounded-xl border border-white/5 outline-none focus:border-c-brand transition-colors text-c-text"
        />
      </div>
    </section >
  );
}
