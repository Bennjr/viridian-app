import { NavLink } from "react-router-dom";
import { Icon } from "../../components";

const links = [
    { label: "Hovedside", svg: "/home.svg", to: "/" },
    { label: "Bibliotek", svg: "/folder.svg", to: "/library" },
    { label: "Chat", svg: "/chat.svg", to: "/chat" },
    { label: "Logg", svg: "/log.svg", to: "/log" },
    { label: "Notater", svg: "/notes.svg", to: "/notes" }
];

export default function Sidebar() {
    return (
        <aside className="bg-c-secondary backdrop-blur-md text-c-text w-56 h-full flex flex-col justify-between sticky top-0 z-50 shadow-2xl">

            <div className="p-6 pb-2">
                <h1 className="text-xs font-bold uppercase tracking-[0.2em] text-c-text/40">Viridian</h1>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {links.map((link) => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                end={link.to === "/"}
                                className={({ isActive }) => `
                                    group relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-[0.98]
                                    ${isActive
                                        ? "bg-c-brand/10 text-c-brand font-semibold shadow-[inset_0_0_0_1px_rgba(58,117,97,0.2)]"
                                        : "text-c-text/70 hover:bg-c-btn_hover hover:text-c-text"}
                                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className={`absolute left-0 w-1 h-6 rounded-r-full bg-c-brand transition-all duration-300 ${isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}`} />

                                        <Icon
                                            src={link.svg}
                                            color={isActive ? "bg-c-brand" : "bg-current"}
                                            size="w-5 h-5"
                                            className="group-hover:scale-110 transition-transform"
                                        />
                                        <span className="text-[14px]">{link.label}</span>
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-3 border-t border-white/5">
                <NavLink
                    to="/settings"
                    className={({ isActive }) => `
                        flex items-center gap-3 p-3 rounded-xl transition-all
                        ${isActive ? "bg-c-brand/10 text-c-brand" : "hover:bg-c-btn_hover text-c-text/70"}
                    `}
                >
                    <Icon
                        src="/settings.svg"
                        color="bg-current"
                        size="w-5 h-5"
                    />
                    <span className="text-[14px]">Innstillinger</span>
                </NavLink>
            </div>
        </aside>
    );
}