import "../component.css";
import { NavLink } from "react-router-dom";

const links = [
    { label: "Hovedside", to: "/" },
    { label: "Biblotek", to: "/library" },
];

export default function Sidebar() {
    return (
        <div className="bg-gray-900 text-white w-48 h-screen flex flex-col relative">
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-2 px-2">
                    {links.map((link) => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                end={link.to === "/"}
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded border border-gray-700 mb-1 hover:bg-gray-700 ${
                                        isActive ? "bg-gray-800" : ""
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="absolute bottom-2 left-0 w-full text-center">
                <NavLink
                    to="/continue"
                    className="text-xs text-gray-400 hover:text-gray-200"
                >
                    continue ↓
                </NavLink>
            </div>
        </div>
    );
}