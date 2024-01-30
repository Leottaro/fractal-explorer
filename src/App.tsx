import { useCallback, useEffect, useRef, useState } from "react";
import AppContext, { ContextSettings } from "./context/AppContext";
import "./App.css";

import FractalCanvas from "./component/FractalCanvas/FractalCanvas";
import SettingsTab from "./component/SettingsTab/SettingsTab";

function App() {
    const [settings, setSettings] = useState<ContextSettings>({
        aWidth: window.innerWidth,
        aHeight: window.innerHeight,

        uAspectRatio: window.innerWidth / window.innerHeight,
        uCenter: [0, 0],
        uMaxIters: 25,
        uGlow: 1,
        uSmoothColors: true,
        uZoom: 1,
        uMouse: [0, 0],
        uTime: 0,

        sZoomRate: 1.05,
        sMouseDown: false,
    });

    // uSize
    window.onresize = () => {
        setSettings({
            ...settings,
            aWidth: window.innerWidth,
            aHeight: window.innerHeight,
            uAspectRatio: window.innerWidth / window.innerHeight,
        });
        console.log("oui");
    };

    // uZoom
    const zoomRate = 1.05;
    window.onwheel = (event) => {
        if (event.deltaY < 0) {
            setSettings({ ...settings, uZoom: settings.uZoom * zoomRate });
        } else {
            setSettings({ ...settings, uZoom: settings.uZoom / zoomRate });
        }
    };
    useEffect(() => {
        setSettings({
            ...settings,
            uMaxIters: Math.sqrt(2 * Math.sqrt(Math.abs(1 - Math.sqrt(5 * settings.uZoom)))) * 33,
        });
    }, [settings.uZoom]);

    // sMouseDown
    window.onmouseup = () => setSettings({ ...settings, sMouseDown: false });

    // uMouse
    window.onmousemove = (event) => {
        const newMouse = [event.clientX / settings.aWidth, event.clientY / settings.aHeight].map(
            (coord) => coord * 2 - 1
        ); // TOFIX: gaffe au coordonnées de la souris (pas traité pareil que les pixels)
        if (settings.sMouseDown) {
            const deltaMouse = [
                ((newMouse[0] - settings.uMouse[0]) * settings.aWidth) / settings.aHeight,
                settings.uMouse[1] - newMouse[1],
            ].map((coord) => coord / settings.uZoom);
            const newCenter = [
                settings.uCenter[0] - deltaMouse[0],
                settings.uCenter[1] - deltaMouse[1],
            ];
            setSettings({ ...settings, uCenter: newCenter, uMouse: newMouse });
        } else {
            setSettings({ ...settings, uMouse: newMouse });
        }
    };

    // uTime
    const intervalRef = useRef(0);
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setSettings({ ...settings, uTime: settings.uTime + 0.01 });
        }, 10);
        return () => clearInterval(intervalRef.current);
    });

    return (
        <AppContext.Provider value={{ settings, setSettings }}>
            <FractalCanvas
                id="FractalCanvas"
                onMouseDown={() => setSettings({ ...settings, sMouseDown: true })}
            />
            <SettingsTab />
        </AppContext.Provider>
    );
}
export default App;
