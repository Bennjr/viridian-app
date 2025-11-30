import "../global.css";
import { invoke } from "@tauri-apps/api/core";
import { useState, useRef, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window"; // ⬅ add this

import api_gemni from "../../hooks/gemni";

export default function Overlay() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatResponse, setChatResponse] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [isEyeOpen, setIsEyeOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);

  // --- 🆕 Add window handle + docking state --- //
  const win = getCurrentWindow();
  const DOCKED = useRef(false);

  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new ResizeObserver(() => {
      const height = contentRef.current?.scrollHeight || 0;
      invoke("w_resize", { height });
    });

    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const unlisten = win.onMoved(async ({ payload }) => {
      const { x, y } = payload;

      if (!DOCKED.current && y <= 0) {
        DOCKED.current = true;
        await invoke("dock");
        return;
      }

      // Undock if moved downward
      if (DOCKED.current && y > 20) {
        DOCKED.current = false;
        await invoke("undock");
        return;
      }
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  const speak = () => invoke("overlay_speak");

  const toggleChat = () => {
    if (isChatOpen) {
      invoke("w_ignore_cursor", { ignore: true });
      invoke("w_unfocus");
      setIsChatOpen(false);
    } else {
      invoke("w_ignore_cursor", { ignore: false });
      invoke("w_focus");
      setIsChatOpen(true);
    }
  };

  const toggleEye = () => {
    setIsEyeOpen(!isEyeOpen);
    if (isEyeOpen) {
      invoke("w_hide");
    } else {
      invoke("w_show");
    }
  };

  const translate = () => invoke("translate");

  const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message") as string;

    if (!message) return;

    try {
      const chat_resp = await api_gemni(message);
      setChatResponse(chat_resp);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      setChatResponse("Error getting response");
    }
  };

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartY(e.clientY);
  };

  const handleDragMove = async (e: React.MouseEvent) => {
    if (!isDragging) return;

    const dragDistance = e.clientY - dragStartY;

    // If dragged down more than 50px, unsnap
    if (dragDistance > 50) {
      await invoke("w_detect_drag_unsnap", { yOffset: dragDistance });
      setIsDragging(false);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const snapToggle = async () => {
    await invoke("w_handle_snap", { window });
  };

  return (
    <section
      className="bg-transparent"
      ref={contentRef}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onDoubleClick={snapToggle}
    >
      {/* Draggable titlebar for moving/docking */}
      <div
        className="draggable bg-primary-text"
        style={{ width: "100vw", height: "25px" }}
      />
      <div
        className="draggable bg-primary-bg grid grid-cols-4 gap-0 items-center p-1"
        style={{ width: "100vw", height: "50px" }}
      >
        <button
          onClick={speak}
          className="non-draggable p-2.5 w-10 cursor-pointer bg-primary-btn-bg hover:bg-primary-btn-hover-bg hover:text-primary-btn-hover-text"
        >
          <img src="/audio.svg" alt="Audio" />
        </button>
        <button
          onClick={toggleChat}
          className="non-draggable p-2.5 w-10 cursor-pointer bg-primary-btn-bg hover:bg-primary-btn-hover-bg hover:text-primary-btn-hover-text"
        >
          <img src="/star.svg" alt="AI" />
        </button>
        <button
          onClick={translate}
          className="non-draggable p-2.5 w-10 cursor-pointer bg-primary-btn-bg hover:bg-primary-btn-hover-bg hover:text-primary-btn-hover-text"
        >
          <img src="/translate.svg" alt="Translate" />
        </button>
        <button
          onClick={toggleEye}
          className="non-draggable p-2.5 w-10 cursor-pointer bg-primary-btn-bg hover:bg-primary-btn-hover-bg hover:text-primary-btn-hover-text"
        >
          <img src="/eye.svg" alt="Eye" />
        </button>
      </div>

      {isChatOpen && (
        <div className="bg-primary-bg grid grid-rows-2-auto gap-2 p-1">
          <div className="bg-secondary-bg p-3">{chatResponse}</div>

          <form onSubmit={handleChatSubmit} className="display-inline">
            <input
              type="text"
              name="message"
              className="bg-secondary-bg p-2.5 rounded-full"
              placeholder="Type your message..."
            />
            <button type="submit" className="rounded-full">
              <img
                src="/upload.svg"
                alt="Send"
                className="w-8 h-8 cursor-pointer hover:opacity-80"
              />
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
