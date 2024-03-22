import { useEffect, useState, WheelEvent } from "react";
import AppContext, { ContextSettings, Point } from "./context/AppContext";
import "./App.css";

import FractalCanvas from "./component/FractalCanvas/FractalCanvas";
import SettingsTab from "./component/SettingsTab/SettingsTab";

function App() {
    const [settings, setSettings] = useState<ContextSettings>({
        aWidth: window.innerWidth,
        aHeight: window.innerHeight,

        uAspectRatio: window.innerWidth / window.innerHeight,
        uCenter: { x: 0, y: 0 },
        uMaxIters: 186,
        uColorOffset: 0,
        uSmoothColors: true,
        uZoom: 1,
        uMouse: { x: 0, y: 0 },
        uTime: 0,
        uColors: [
            // {r, g, b, t} sorted by t
            { r: 0.0, g: 0.027450980392156862, b: 0.39215686274509803, t: 0 },
            { r: 0.12549019607843137, g: 0.4196078431372549, b: 0.796078431372549, t: 0.25 },
            { r: 0.9294117647058824, g: 1.0, b: 1.0, t: 0.5 },
            { r: 1.0, g: 0.6666666666666666, b: 0.0, t: 0.75 },
            { r: 0.0, g: 0.00784313725490196, b: 0.0, t: 1 },
        ].sort((a, b) => a.t - b.t),
        uFillingColor: { r: 0, g: 0, b: 0 },

        sZoomMin: 0.5,
        sZoomMax: 40000,
        sZoomRate: 1.05,
        sColorOffsetMin: 0,
        sColorOffsetMax: 2 * Math.PI,
        sColorOffsetTimeDependant: false,
        sMaxItersFactor: 125,
        sMaxItersFactorMin: 1,
        sMaxItersFactorMax: 500,
        sMaxItersZoomDependant: true,
        sMouse: { x: 0, y: 0 },
        sMouseDownTarget: undefined,
    });

    // Functions
    function PixelToPoint(p: Point) {
        return {
            x:
                (((p.x / settings.aWidth) * 2 - 1) * settings.uAspectRatio) / settings.uZoom +
                settings.uCenter.x,
            y: ((p.y / settings.aHeight) * -2 + 1) / settings.uZoom + settings.uCenter.y,
        };
    }
    function pointLerp(a: Point, b: Point, p: number) {
        return {
            x: a.x + p * (b.x - a.x),
            y: a.y + p * (b.y - a.y),
        };
    }

    // uSize
    window.onresize = () => {
        setSettings({
            ...settings,
            aWidth: window.innerWidth,
            aHeight: window.innerHeight,
            uAspectRatio: window.innerWidth / window.innerHeight,
        });
    };

    // uZoom
    function handleWheel(event: WheelEvent<HTMLCanvasElement>) {
        let newZoom =
            event.deltaY < 0
                ? settings.uZoom * settings.sZoomRate
                : settings.uZoom / settings.sZoomRate;
        let effectiveZoomRate = settings.sZoomRate;
        if (newZoom < settings.sZoomMin) {
            newZoom = settings.sZoomMin;
            effectiveZoomRate = settings.uZoom / newZoom;
        } else if (newZoom > settings.sZoomMax) {
            newZoom = settings.sZoomMax;
            effectiveZoomRate = newZoom / settings.uZoom;
        }
        if (newZoom === settings.uZoom) {
            return;
        }

        const newCenter = pointLerp(
            settings.uMouse,
            settings.uCenter,
            event.deltaY < 0 ? 1 / effectiveZoomRate : effectiveZoomRate
        );
        setSettings({ ...settings, uZoom: newZoom, uCenter: newCenter });
    }
    useEffect(() => {
        setSettings({
            ...settings,
            uMaxIters:
                Math.sqrt(2 * Math.sqrt(Math.abs(1 - Math.sqrt(5 * settings.uZoom)))) *
                settings.sMaxItersFactor,
        });
    }, [settings.sMaxItersZoomDependant ? settings.uZoom : undefined, settings.sMaxItersFactor]);

    // sMouseDown
    window.onmousedown = (event) =>
        setSettings({ ...settings, sMouseDownTarget: event.target as HTMLElement });
    window.onmouseup = () => setSettings({ ...settings, sMouseDownTarget: undefined });

    // uMouse
    window.onmousemove = (event) => {
        setSettings({
            ...settings,
            sMouse: { x: event.clientX, y: event.clientY },
        });
    };
    useEffect(() => {
        const newMouse = PixelToPoint(settings.sMouse);

        if (!settings.sMouseDownTarget) {
            setSettings({ ...settings, uMouse: newMouse });
            return;
        }
        if (settings.sMouseDownTarget.classList.contains("FractalCanvas")) {
            const newCenter = {
                x: settings.uCenter.x - newMouse.x + settings.uMouse.x,
                y: settings.uCenter.y - newMouse.y + settings.uMouse.y,
            };
            setSettings({ ...settings, uCenter: newCenter });
        }
    }, [settings.sMouse, settings.aWidth, settings.aHeight, settings.uAspectRatio]);

    // uTime
    useEffect(() => {
        setSettings({ ...settings, uColorOffset: settings.uTime % settings.sColorOffsetMax });
    }, [settings.sColorOffsetTimeDependant ? settings.uTime : undefined]);

    return (
        <AppContext.Provider value={{ settings, setSettings }}>
            <FractalCanvas
                id="FractalCanvas"
                onWheel={handleWheel}
            />
            <SettingsTab />
        </AppContext.Provider>
    );
}
export default App;
