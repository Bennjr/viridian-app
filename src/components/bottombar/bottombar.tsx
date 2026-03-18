// Make sure to import invoke if you haven't!
import { invoke } from "@tauri-apps/api/core";
import { Icon } from "../../components";

const actions = [
    { invoke: "w_show", label: "Vis", svg: "/eye.svg" }
];

export default function Bottombar() {
    const invokeAction = async (action: string) => {
        if (action === "w_show") {
            await invoke("w_show_by_label", { label: "overlayWin" });
        } else {
            await invoke(action);
        }
    };

    return (
        <div className="h-[25px] bg-c-tertiery select-none flex items-center justify-between text-c-text border-t border-white/5 px-4">
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold uppercase opacity-40">
                    Viridian
                </span>

                <div className="flex gap-2">
                    {actions.map((item) => (
                        <button
                            key={item.invoke}
                            onClick={() => invokeAction(item.invoke)}
                            className="flex items-center gap-1 text-[10px] hover:text-c-brand transition-colors cursor-pointer"
                        >
                            <Icon src={item.svg} size="w-3 h-3" color="bg-current" />
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}