import "../global.css";
import { invoke } from '@tauri-apps/api/core';
import { useState, useRef, useEffect } from 'react';

import api_gemni from '../../hooks/gemni';


export default function Overlay() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatResponse, setChatResponse] = useState("");
    const [chatInput, setChatInput] = useState("");
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!contentRef.current) return;

        const observer = new ResizeObserver(() => {
            const height = contentRef.current?.scrollHeight || 0;
            invoke("w_resize", { height });
        });

        observer.observe(contentRef.current);
        return () => observer.disconnect();
    }, []);

    const speak = () => {
        invoke("overlay_speak");
    };

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

    const translate = () => {
        invoke("translate");
    };

    const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message") as string;
    
    if (message) {
        try {
            console.log("Sending message:", message);
            const chat_resp = await api_gemni(message);
            console.log("API response:", chat_resp);
            setChatResponse(chat_resp);
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error("Full error:", error);
            console.error("Error message:", error instanceof Error ? error.message : String(error));
            setChatResponse("Error getting response");
        }
    }
};

    return (
        <section className="bg-transparent" ref={contentRef}>
        <div className="draggable bg-primary-text" style={{ width: "100vw", height: "25px" }} />
        <div className="draggable bg-primary-bg grid grid-cols-3 gap-0 items-center p-1" style={{ width: "100vw", height: "50px" }}>
           <button onClick={speak} className="non-draggable p-2.5 w-10 cursor-pointer bg-primary-btn-bg hover:bg-primary-btn-hover-bg hover:text-primary-btn-hover-text"><img src="/audio.svg" alt="Audio" /></button>
           <button onClick={toggleChat} className="non-draggable p-2.5 w-10 cursor-pointer bg-primary-btn-bg hover:bg-primary-btn-hover-bg hover:text-primary-btn-hover-text"><img src="/star.svg" alt="AI" /></button>
           <button onClick={translate} className="non-draggable p-2.5 w-10 cursor-pointer bg-primary-btn-bg hover:bg-primary-btn-hover-bg hover:text-primary-btn-hover-text"><img src="/translate.svg" alt="Translate" /></button>
        </div>
        <div className="bg-primary-bg">
            {isChatOpen && <div className="grid grid-rows-2-auto gap-2 p-1">
            <div className="bg-secondary-bg p-3 rounded-lg">
                {chatResponse && <p>{chatResponse}</p>}
            </div>
            <form onSubmit={handleChatSubmit} className="display-inline">
                <input 
                    type="text" 
                    name="message"
                    className="bg-secondary-bg p-2.5 rounded-full"
                    placeholder="Type your message..."
                />
                <button type="submit" className=""><img src="/upload.svg" alt="Send" className="w-8 h-8 cursor-pointer hover:opacity-80"/></button>
            </form>
            </div>}
        </div>
        </section>
    );
}