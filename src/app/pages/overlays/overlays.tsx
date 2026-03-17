import "../../global.css";
import { NavLink } from "react-router-dom";

interface Props {
    setFirstStart: any;
}

// EXAMPLE NAVLINK
// <NavLink to="bar" onClick={() => setFirstStart(false)}>foo</NavLink>

export default function Onboarding({ setFirstStart }: Props) {
    return (
        <div className="flex h-screen">
            <div className="m-auto grid grid-cols-2 grid-row-2 gap-x-4 gap-y-2">
                <div className="col-span-2 ">
                    <h2 className="text-2xl font-bold">Velkommen</h2>
                    <p>Bare et par kjappe spørsmål før vi kommer i gang</p>
                </div>
                <div className="bg-blue-500 p-32">
                    one
                </div>
                <div className="bg-red-500 p-32">
                    two
                </div>
            </div>
        </div>
    )
}