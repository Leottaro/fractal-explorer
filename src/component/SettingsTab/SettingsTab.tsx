import { useContext, useState } from "react";
import "./SettingsTab.css";
import AppContext from "../../context/AppContext";
import Slider, { SliderTypes } from "../Slider/Slider";

function SettingsTab() {
    const { settings, setSettings } = useContext(AppContext);
    const [hidden, setHidden] = useState(true);

    return (
        <>
            <div
                id="SettingsDiv"
                className={hidden ? "hidden" : undefined}
            >
                <div className="setting">
                    <label className="settingTitle">Zoom</label>
                    <Slider
                        min={settings.sZoomMin}
                        max={settings.sZoomMax}
                        getter={settings.uZoom}
                        setter={(newZoom) => setSettings({ ...settings, uZoom: newZoom })}
                        sliderType={SliderTypes.EXPONENTIAL}
                    />
                </div>
                <div className="setting">
                    <label className="settingTitle">Glow</label>
                    <Slider
                        min={settings.sGlowMin}
                        max={settings.sGlowMax}
                        getter={settings.uGlow}
                        setter={(glow) => setSettings({ ...settings, uGlow: glow })}
                        sliderType={SliderTypes.EXPONENTIAL}
                    />
                </div>
                <div className="setting">
                    <label className="settingTitle">Precision</label>
                    <Slider
                        min={settings.sMaxItersFactorMin}
                        max={settings.sMaxItersFactorMax}
                        getter={settings.sMaxItersFactor}
                        setter={(factor) => setSettings({ ...settings, sMaxItersFactor: factor })}
                        sliderType={SliderTypes.EXPONENTIAL}
                    />
                </div>
            </div>
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
