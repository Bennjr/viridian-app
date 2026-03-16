import "../global.css";
import { invoke } from "@tauri-apps/api/core";
import { useState, useRef } from "react";

export default function Overlay() {
  const [isEyeOpen, setIsEyeOpen] = useState(true);
  const [isWindowOpen, setWindowOpen] = useState(false);
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

  const translate = () => invoke("translate");

  const windowSizeToggle = () => {
    if (isWindowOpen) {
      invoke("w_resize", { height: 75 });
      setWindowOpen(false);
    } else {
      invoke("w_resize", { height: 450 });
      setWindowOpen(true);
    }
  };

  return (
    <section className="draggable bg-o-bg h-screen items-center" ref={contentRef}>
      <div className="draggable bg-o-bg grid grid-cols-5" style={{ width: "100vw", height: "75px" }}>
        <button
          onClick={speak}
          className="non-draggable size-12 p-3 cursor-pointer bg-o-btn_bg hover:bg-primary-btn-hover-bg hover:text-primary-btn-hover-text"
        >
          <img src="/audio.svg" alt="Audio" title="Play selected text" />
        </button>
        <button
          onClick={toggleChat}
          className="non-draggable size-12 p-3 cursor-pointer bg-o-btn_bg hover:bg-primary-btn-hover-bg hover:text-primary-btn-hover-text"
        >
          <img src="/star.svg" alt="AI" title="AI" />
        </button>
        <button
          onClick={translate}
          className="non-draggable size-12 p-3 cursor-pointer bg-o-btn_bg hover:bg-primary-btn-hover-bg hover:text-primary-btn-hover-text"
        >
          <img src="/translate.svg" alt="Translate" title="Translate selected text" />
        </button>
        <button
          onClick={toggleEye}
          className="non-draggable size-12 p-3 overlay-button cursor-pointer bg-o-btn_bg"
        >
          <img src="/eye.svg" alt="Eye" title="Hide window" />
        </button>
        <button
          onClick={windowSizeToggle}
          className="flexnon-draggable size-12 p-3 cursor-pointer bg-o-btn_bg hover:bg-primary-btn-hover-bg hover:text-primary-btn-hover-text"
        >
          <img src="/chevron-down.svg" id="chevron-toggle" className={!isWindowOpen ? "rotate-180" : ""} alt="Eye" title="Toggle Window Size" />
        </button>
      </div>
    </section>
  );
}
