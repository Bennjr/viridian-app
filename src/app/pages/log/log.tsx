import "../../global.css"

interface logProps {
    label: string;
    desc: string;
}

const LogInstance = ({ label, desc }: logProps) => (
    <div className="p-4 grid grid-row-[auto_auto] bg-c-secondary border border-c-divider min-h-16 hover:bg-c-hover">
        <div>{label}</div>
        <div>{desc}</div>
    </div>
);

export default function Log() {
    return (
        <div className="grid grid-rows-[auto_auto] gap-6">
            <h1 className="text-xl font-bold">Log</h1>
            <main>
                <LogInstance label="App Tema" desc="Some desc"></LogInstance>
                <LogInstance label="App Tema" desc="Some desc"></LogInstance>
                <LogInstance label="App Tema" desc="Some desc"></LogInstance>
            </main>
        </div>
    )
}