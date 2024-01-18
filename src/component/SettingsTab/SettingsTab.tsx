import { useState } from 'react';
import "./SettingsTab.css";

export default function SettingsTab() {
    const [shown, setShown] = useState(false);

    return (
        <>
            <svg viewBox="-12 -12 24 24" id="SettingsButton" onClick={() => setShown(!shown)} className={shown ? "shown" : ""}>
                <path d="M 7 0 L -7 0 M 7 0 L 1 -6 M 7 0 L 1 6" strokeLinecap="round" />
            </svg>
            <div id="SettingsDiv" className={shown ? "shown" : ""}>
            </div>
        </>
    )
}