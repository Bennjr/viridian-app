export function GridAdapter({ options, activeId, onSelect, columns = 3 }: any) {
    return (
        <div className={`grid grid-cols-${columns} gap-3`}>
            {options.map((opt: any) => (
                <button
                    key={opt.id}
                    onClick={() => onSelect(opt.id)}
                    className={`flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all
                        ${activeId === opt.id ? 'border-c-brand bg-c-brand/5' : 'border-white/5 bg-c-primary hover:border-white/10'}`}
                >
                    {opt.icon ? <div className="text-2xl">{opt.icon}</div> : <span className="text-xl font-bold">Aa</span>}
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{opt.label}</span>
                </button>
            ))}
        </div>
    );
}

export function ListAdapter({ options, activeId, onSelect }: any) {
    return (
        <div className="flex flex-col gap-1.5">
            {options.map((opt: any) => (
                <button
                    key={opt.id}
                    onClick={() => onSelect(opt.id)}
                    className="flex items-center justify-between p-4 rounded-xl bg-c-primary border border-white/5 hover:border-c-brand/40 group transition-all"
                >
                    <span className={`text-sm font-bold ${activeId === opt.id ? 'text-c-brand' : 'text-c-text/60 group-hover:text-c-text'}`}>
                        {opt.label}
                    </span>
                    {activeId === opt.id && <div className="size-1.5 rounded-full bg-c-brand" />}
                </button>
            ))}
        </div>
    );
}