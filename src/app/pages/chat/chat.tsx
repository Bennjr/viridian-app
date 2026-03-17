import { useState } from "react"
import Ask from "../../../hooks/gemni"

export default function Chat() {
    const [userQuery, setUserQuery] = useState("");

    const submit = () => {
        Ask(userQuery)
    }

    return (
        <div>
            <main>

            </main>
            <div>
                <input type="text" placeholder="Søk i biblioteket..." value={userQuery} onChange={(e) => setUserQuery(e.target.value)} className="w-full p-1 border rounded" />
            </div>
        </div>
    )
}