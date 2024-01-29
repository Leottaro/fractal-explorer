import { useState } from "react";
import "./SettingsTab.css";

function SettingsTab() {
    const [hidden, setHidden] = useState(false);

    return (
        <>
            <div
                id="SettingsDiv"
                className={hidden ? "hidden" : undefined}
            ></div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 48"
                id="SettingsButton"
                onClick={() => setHidden(!hidden)}
                className={hidden ? "hidden" : undefined}
            >
                <path
                    className="background"
                    d="M0 24c0-6 6-12 12-12S24 6 24 0v48c0-6-6-12-12-12S0 30 0 24Z"
                />
                <path
                    className="arrow"
                    d="M20 24H4M20 24l-8-6M20 24l-8 6"
                    strokeLinecap="round"
                    strokeWidth={3}
                />
            </svg>
        </>
    );
}
export default SettingsTab;
