import { getCurrentWindow } from '@tauri-apps/api/window';
import "../component.css";


export default function Topbar() {

    return (
        <div className="h-[40px] bg-[#329ea3] select-none grid grid-cols-[1fr_auto] items-center text-white">
            <div className="h-full flex items-center px-4 text-xs font-medium uppercase tracking-wider cursor-default">
                Viridian App
            </div>
        </div>
    );
}