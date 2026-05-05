import { NavLink } from "react-router-dom";
import { Icon } from "..";
import { useLanguage } from "../../context/LanguageContext";
import { getTranslations } from "../../utils/translations";

type Lang = "no" | "en" | "es" | "de";

const links = [
    { key: "home", svg: "/home.svg", to: "/" },
    { key: "library", svg: "/folder.svg", to: "/library", isFolder: true },
    { key: "notes", svg: "/notes.svg", to: "/notes" },
    { key: "dictionary", svg: "/dict.svg", to: "/dict" },
    { key: "typing", svg: "/type.svg", to: "/typing" }
];

export default function Sidebar() {
    const { language } = useLanguage();
    const sidebarTranslations = getTranslations(language as Lang, 'sidebar');
    const t = (key: string) => sidebarTranslations[key] || key;
    return (
        <div>
            <aside className="bg-c-secondary backdrop-blur-md text-c-text w-56 h-full flex flex-col justify-between sticky top-0 z-50 shadow-2xl">

                <div className="h-14 border-b border-r border-c-divider">
                    <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-c-text">VIRIDIAN</h2>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 border-r border-b border-c-divider">
                    <ul className="space-y-1 px-3">
                        {links.map((link) => (
                            <li key={link.to}>
                                <NavLink
                                    to={link.to}
                                    end={link.to === "/"}
                                    className={({ isActive }) => `
                                    group relative flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 
                                    active:scale-[0.96] select-none gap-2
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
                                            <span className="text-[14px]">{t(link.key)}</span>
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex flex-col gap-2 p-3 border-r border-c-divider">
                    <div className="">
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-c-muted_text">Instillinger</h3>
                    </div>
                    <div>
                        <NavLink
                            to="/settings"
                            className={({ isActive }) => `
                        flex gap-3 p-3 rounded-xl transition-all
                        ${isActive ? "bg-c-brand/10 text-c-brand" : "hover:bg-c-btn_hover text-c-text"}
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
                    <div>
                        <NavLink
                            to="/settings"
                            className={({ isActive }) => `
                        flex items-center gap-3 p-3 rounded-xl transition-all
                        ${isActive ? "bg-c-brand/10 text-c-brand" : "hover:bg-c-btn_hover text-c-text/70"}
                    `}
                        >
                            <div className="w-5 h-5 rounded-full bg-red-500">c</div>
                            <span className="text-[14px]">Brukerkonto</span>
                        </NavLink>
                    </div>
                </div>
            </aside>
        </div>
    );
}

export function Topbar() {
    return (
        <header className="h-14 flex items-center px-8 bg-c-secondary border-b border-c-divider">
            <div className="flex-1">
                <span className="text-c-text/50 text-sm font-medium">content for now</span>
            </div>
        </header>
    );
};