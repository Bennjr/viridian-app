import "../component.css";
import { NavLink } from "react-router-dom";

const links = [
    { label: "Hovedside", to: "/" },
    { label: "Biblotek", to: "/library" },
];

export default function Sidebar() {
    return (
        <div className="bg-c-nav-bg text-c-text w-48 h-screen flex flex-col sticky top-0 space-between">
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-2 px-2">
                    {links.map((link) => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                end={link.to === "/"}
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded border border-c-nav-btn-bg mb-1 hover:bg-c-nav-btn_hover ${isActive ? "bg-c-nav-btn_bg" : ""
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <span className="flex flex-row items-center p-2 hover:bg-c-nav-btn_hover cursor-pointer select-none">
                <img src="/settings.svg" alt="Settings" className="mr-2 size-5" />
                Innstillinger
            </span>
        </div>
    );
}