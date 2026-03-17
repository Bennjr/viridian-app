import { getCurrentWindow } from '@tauri-apps/api/window';
import "../component.css";
import { invoke } from '@tauri-apps/api/core';

const actions = [
    { invoke: "", label: "", svg: "" }
]

export default function Bottombar() {

    return (
        <div className="h-[20px] bg-c-tertiery select-none grid grid-cols-[1fr_auto] items-center text-white">
            <div className="h-full flex items-center px-4 text-xs font-medium uppercase tracking-wider cursor-default">
                Viridian App
            </div>
        </div>
    );
}