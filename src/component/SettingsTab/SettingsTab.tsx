import { useContext, useState } from "react";
import Setting from "./Setting";
import "./SettingsTab.css";
import AppContext from "../../context/AppContext";

function SettingsTab() {
    const { settings, setSettings } = useContext(AppContext);
    const [hidden, setHidden] = useState(false);

    return (
        <>
            <div
                id="SettingsDiv"
                className={hidden ? "hidden" : undefined}
            ></div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 60 90"
                fill="none"
                id="SettingsButton"
                onClick={() => setHidden(!hidden)}
                className={hidden ? "hidden" : undefined}
            >
                <path
                    className="background"
                    d="M29.9999 15C14.9999 15 -0.000133991 30 0 45C6.43817e-06 60 14.9999 75 29.9999 75C44.9998 75 60 75 60 90V0C60 15 44.9998 15 29.9999 15Z"
                />
                <path
                    className="arrow"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={5}
                    d="M15.0002 45H45.0001M45.0001 45L30.0002 30M45.0001 45L30.0002 60"
                />
            </svg>
        </>
    );
}
export default SettingsTab;
