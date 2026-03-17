import "../component.css";
import { NavLink } from "react-router-dom";

const links = [
    { label: "Hovedside", svg: "/home.svg", to: "/" },
    { label: "Biblotek", svg: "/folder.svg", to: "/library" },
    { label: "Logg", svg: "/log.svg", to: "/log" },
];

export default function Sidebar() {
    return (
        <div className="bg-c-secondary text-c-text w-48 h-full flex flex-col justify-between sticky top-0">
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-2 px-2">
                    {links.map((link) => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                end={link.to === "/"}
                                className={({ isActive }) =>
                                    `grid grid-cols-[auto_1fr] gap-2 block px-3 py-2 rounded border border-c-btn mb-1 hover:bg-c-btn_hover ${isActive ? "bg-c-btn_hover" : ""
                                    }`
                                }
                            >
                                <img src={link.svg} className="w-6 h-auto" alt="icon" />
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <NavLink
                to="/settings"
                className="flex flex-row items-center p-4 hover:bg-c-btn_hover cursor-pointer select-none border-t border-white/5"
            >
                <img src="/settings.svg" alt="Settings" className="mr-2 size-5" />
                Innstillinger
            </NavLink>
        </div>
    );
}