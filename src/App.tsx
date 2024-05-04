import { useCallback, useEffect, useState, WheelEvent } from "react";
import AppContext, { ContextSettings, Fractals, Point } from "./context/AppContext";

import FractalCanvas from "./component/FractalCanvas/FractalCanvas";
import SettingsTab from "./component/SettingsTab/SettingsTab";
import ControlPoint from "./component/ControlPoint/ControlPoint";

function pointLerp(a: Point, b: Point, p: number) {
    return {
        x: a.x + p * (b.x - a.x),
        y: a.y + p * (b.y - a.y),
    };
}

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
            { r: 0.0, g: 0.027, b: 0.392, t: 0 },
            { r: 0.125, g: 0.42, b: 0.796, t: 0.25 },
            { r: 0.929, g: 1.0, b: 1.0, t: 0.5 },
            { r: 1.0, g: 0.667, b: 0.0, t: 0.75 },
            { r: 0.0, g: 0.008, b: 0.0, t: 1 },
        ].sort((a, b) => a.t - b.t),
        uFillingColor: { r: 0, g: 0, b: 0 },
        uFractal: Fractals.Julia,
        uJuliaC: { x: 0, y: 0 },

        sZoomMin: 0.5,
        sZoomMax: 40000,
        sZoomRate: 1.05,
        sColorOffsetMin: 0,
        sColorOffsetMax: 2 * Math.PI,
        sColorOffsetTimeDependant: false,
        sMaxItersFactor: 125,
        sMaxItersFactorMin: 1,
        sMaxItersFactorMax: 1000,
        sMaxItersZoomDependant: true,
        sMouse: { x: 0, y: 0 },
        sMouseDown: false,
        sMouseDownTarget: document.createElement("div"),
        sPlayTime: false,
        sTimeFactor: 1,
        sJuliaC: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    });

    // Functions
    const PixelToPoint = useCallback(
        (p: Point) => {
            return {
                x:
                    (((p.x / settings.aWidth) * 2 - 1) * settings.uAspectRatio) / settings.uZoom +
                    settings.uCenter.x,
                y: ((p.y / settings.aHeight) * -2 + 1) / settings.uZoom + settings.uCenter.y,
            };
        },
        [settings.aWidth, settings.aHeight, settings.uAspectRatio, settings.uZoom, settings.uCenter]
    );
    const PointToPixel = useCallback(
        (p: Point) => {
            return {
                x:
                    ((((p.x - settings.uCenter.x) * settings.uZoom) / settings.uAspectRatio + 1) /
                        2) *
                    settings.aWidth,
                y: (((p.y - settings.uCenter.y) * settings.uZoom - 1) / -2) * settings.aHeight,
            };
        },
        [settings.aWidth, settings.aHeight, settings.uAspectRatio, settings.uZoom, settings.uCenter]
    );

    // ControlPoints updates
    useEffect(
        () =>
            setSettings((prevSettings) => ({
                ...prevSettings,
                sJuliaC: PointToPixel(settings.uJuliaC),
            })),
        [settings.aWidth, settings.aHeight, settings.uAspectRatio, settings.uZoom, settings.uCenter]
    );

    // uSize
    window.onresize = () => {
        setSettings((prevSettings) => ({
            ...prevSettings,
            aWidth: window.innerWidth,
            aHeight: window.innerHeight,
            uAspectRatio: window.innerWidth / window.innerHeight,
        }));
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
        effectiveZoomRate = event.deltaY < 0 ? 1 / effectiveZoomRate : effectiveZoomRate;
        const newCenter = pointLerp(settings.uMouse, settings.uCenter, effectiveZoomRate);
        setSettings((prevSettings) => ({
            ...prevSettings,
            uZoom: newZoom,
            uCenter: newCenter,
        }));
    }
    useEffect(() => {
        if (settings.sMaxItersZoomDependant) {
            setSettings((prevSettings) => ({
                ...prevSettings,
                uMaxIters:
                    Math.sqrt(2 * Math.sqrt(Math.abs(1 - Math.sqrt(5 * settings.uZoom)))) *
                    settings.sMaxItersFactor,
            }));
        }
    }, [settings.uZoom, settings.sMaxItersFactor]);

    // sMouseDown
    window.onmousedown = (event) =>
        setSettings((prevSettings) => ({
            ...prevSettings,
            sMouseDown: true,
            sMouseDownTarget: event.target as HTMLElement,
        }));
    window.onmouseup = () =>
        setSettings((prevSettings) => ({
            ...prevSettings,
            sMouseDown: false,
        }));

    // uMouse
    window.onmousemove = (event) => {
        setSettings((prevSettings) => ({
            ...prevSettings,
            sMouse: { x: event.clientX, y: event.clientY },
        }));
    };
    useEffect(() => {
        const newMouse = PixelToPoint(settings.sMouse);

        if (!settings.sMouseDown) {
            setSettings((prevSettings) => ({
                ...prevSettings,
                uMouse: newMouse,
            }));
        } else if (settings.sMouseDownTarget.classList.contains("FractalCanvas")) {
            const newCenter = {
                x: settings.uCenter.x - newMouse.x + settings.uMouse.x,
                y: settings.uCenter.y - newMouse.y + settings.uMouse.y,
            };
            setSettings((prevSettings) => ({
                ...prevSettings,
                uCenter: newCenter,
            }));
        }
    }, [settings.sMouse]);

    // uTime
    useEffect(() => {
        if (settings.sColorOffsetTimeDependant) {
            setSettings((prevSettings) => ({
                ...prevSettings,
                uColorOffset: settings.uTime % settings.sColorOffsetMax,
            }));
        }
    }, [settings.uTime, settings.sColorOffsetMax]);

    return (
        <AppContext.Provider value={{ settings, setSettings }}>
            <FractalCanvas
                id="FractalCanvas"
                className="FractalCanvas"
                onWheel={handleWheel}
            />
            <SettingsTab />
            {settings.uFractal == Fractals.Julia ? (
                <ControlPoint
                    getter={settings.sJuliaC}
                    setter={(newPoint) =>
                        setSettings((prevSettings) => ({
                            ...prevSettings,
                            sJuliaC: newPoint,
                            uJuliaC: PixelToPoint(newPoint),
                        }))
                    }
                />
            ) : settings.uFractal == Fractals.Mandelbrot ? (
                <></>
            ) : settings.uFractal == Fractals.Newton ? (
                <></>
            ) : (
                <></>
            )}
        </AppContext.Provider>
    );
}
export default App;
