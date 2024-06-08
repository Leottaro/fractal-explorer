import { useCallback, useEffect, useState, WheelEvent } from "react";

import {
    AppContext,
    AppSettings,
    Fractals,
    Point,
    pointLerp,
    ShaderSettings,
} from "@utils/exports";
import FractalCanvas from "@component/FractalCanvas/FractalCanvas";
import SettingsTab from "@component/SettingsTab/SettingsTab";
import ControlPoint from "@component/Inputs/ControlPoint";

export default function App() {
    const [shaderSettings, setShaderSettings] = useState<ShaderSettings>({
        width: window.innerWidth,
        height: window.innerHeight,

        smoothColors: true,
        maxIters: 186,
        aspectRatio: window.innerWidth / window.innerHeight,
        zoom: 0.75,
        fractal: Fractals.Julia,
        newtonCChecked: 0,
        juliaC: { x: 0, y: 0 },
        newtonR: { x: -0.25, y: -0.25 },
        newtonG: { x: -0.25, y: 0.25 },
        newtonB: { x: 0.4825, y: 0.0034 },
        center: { x: 0, y: 0 },
        fillingColor: { r: 0, g: 0, b: 0 },
        colorOffset: 0,
        colors: [
            // {r, g, b, t} sorted by t
            { r: 0.0, g: 0.027, b: 0.392, t: 0 },
            { r: 0.125, g: 0.42, b: 0.796, t: 0.25 },
            { r: 0.929, g: 1.0, b: 1.0, t: 0.5 },
            { r: 1.0, g: 0.667, b: 0.0, t: 0.75 },
            { r: 0.0, g: 0.008, b: 0.0, t: 1 },
        ].sort((a, b) => a.t - b.t),
    });

    const [appSettings, setAppSettings] = useState<AppSettings>({
        colorOffsetMax: 2 * Math.PI,
        colorOffsetMin: 0,
        colorOffsetTimeDependant: false,
        juliaC: { x: 0, y: 0 },
        maxItersFactor: 125,
        maxItersFactorMax: 1000,
        maxItersFactorMin: 1,
        maxItersZoomDependant: true,
        mouseDown: false,
        mouseDownTarget: document.createElement("div"),
        mousePixel: { x: 0, y: 0 },
        mousePoint: { x: 0, y: 0 },
        newtonB: { x: 0, y: 0 },
        newtonG: { x: 0, y: 0 },
        newtonR: { x: 0, y: 0 },
        playTime: false,
        time: 0,
        timeFactor: 1,
        zoomMax: 40000,
        zoomMin: 0.5,
        zoomRate: 1.05,
    });

    // Functions
    const PixelToPoint = useCallback(
        (p: Point) => {
            return {
                x:
                    (((p.x / shaderSettings.width) * 2 - 1) * shaderSettings.aspectRatio) /
                        shaderSettings.zoom +
                    shaderSettings.center.x,
                y:
                    ((p.y / shaderSettings.height) * -2 + 1) / shaderSettings.zoom +
                    shaderSettings.center.y,
            };
        },
        [
            shaderSettings.width,
            shaderSettings.height,
            shaderSettings.aspectRatio,
            shaderSettings.zoom,
            shaderSettings.center,
        ]
    );
    const PointToPixel = useCallback(
        (p: Point) => {
            return {
                x:
                    ((((p.x - shaderSettings.center.x) * shaderSettings.zoom) /
                        shaderSettings.aspectRatio +
                        1) /
                        2) *
                    shaderSettings.width,
                y:
                    (((p.y - shaderSettings.center.y) * shaderSettings.zoom - 1) / -2) *
                    shaderSettings.height,
            };
        },
        [
            shaderSettings.width,
            shaderSettings.height,
            shaderSettings.aspectRatio,
            shaderSettings.zoom,
            shaderSettings.center,
        ]
    );

    // ControlPoints updates
    useEffect(
        () =>
            setAppSettings((prevSettings) => ({
                ...prevSettings,
                juliaC: PointToPixel(shaderSettings.juliaC),
                newtonR: PointToPixel(shaderSettings.newtonR),
                newtonG: PointToPixel(shaderSettings.newtonG),
                newtonB: PointToPixel(shaderSettings.newtonB),
            })),
        [
            shaderSettings.width,
            shaderSettings.height,
            shaderSettings.aspectRatio,
            shaderSettings.zoom,
            shaderSettings.center,
        ]
    );

    // uSize
    window.onresize = () => {
        setShaderSettings((prevSettings) => ({
            ...prevSettings,
            width: window.innerWidth,
            height: window.innerHeight,
            aspectRatio: window.innerWidth / window.innerHeight,
        }));
    };

    // uZoom
    function handleWheel(event: WheelEvent<HTMLCanvasElement>) {
        let newZoom =
            event.deltaY < 0
                ? shaderSettings.zoom * appSettings.zoomRate
                : shaderSettings.zoom / appSettings.zoomRate;
        let effectiveZoomRate = appSettings.zoomRate;
        if (newZoom < appSettings.zoomMin) {
            newZoom = appSettings.zoomMin;
            effectiveZoomRate = shaderSettings.zoom / newZoom;
        } else if (newZoom > appSettings.zoomMax) {
            newZoom = appSettings.zoomMax;
            effectiveZoomRate = newZoom / shaderSettings.zoom;
        }
        if (newZoom === shaderSettings.zoom) {
            return;
        }
        effectiveZoomRate = event.deltaY < 0 ? 1 / effectiveZoomRate : effectiveZoomRate;
        const newCenter = pointLerp(
            appSettings.mousePoint,
            shaderSettings.center,
            effectiveZoomRate
        );
        setShaderSettings((prevSettings) => ({
            ...prevSettings,
            zoom: newZoom,
            center: newCenter,
        }));
    }
    useEffect(() => {
        if (appSettings.maxItersZoomDependant) {
            setShaderSettings((prevSettings) => ({
                ...prevSettings,
                maxIters:
                    Math.sqrt(2 * Math.sqrt(Math.abs(1 - Math.sqrt(5 * shaderSettings.zoom)))) *
                    appSettings.maxItersFactor,
            }));
        }
    }, [shaderSettings.zoom, appSettings.maxItersFactor]);

    // sMouseDown
    window.onmousedown = (event) =>
        setAppSettings((prevSettings) => ({
            ...prevSettings,
            mouseDown: true,
            mouseDownTarget: event.target as HTMLElement,
        }));
    window.onmouseup = () =>
        setAppSettings((prevSettings) => ({
            ...prevSettings,
            mouseDown: false,
        }));

    // uMouse
    window.onmousemove = (event) => {
        setAppSettings((prevSettings) => ({
            ...prevSettings,
            mousePixel: { x: event.clientX, y: event.clientY },
        }));
    };
    useEffect(() => {
        const newMouse = PixelToPoint(appSettings.mousePixel);

        if (!appSettings.mouseDown) {
            setAppSettings((prevSettings) => ({
                ...prevSettings,
                mousePoint: newMouse,
            }));
        } else if (appSettings.mouseDownTarget.classList.contains("FractalCanvas")) {
            const newCenter = {
                x: shaderSettings.center.x - newMouse.x + appSettings.mousePoint.x,
                y: shaderSettings.center.y - newMouse.y + appSettings.mousePoint.y,
            };
            setShaderSettings((prevSettings) => ({
                ...prevSettings,
                center: newCenter,
            }));
        }
    }, [appSettings.mousePixel]);

    // uTime
    useEffect(() => {
        if (appSettings.colorOffsetTimeDependant) {
            setShaderSettings((prevSettings) => ({
                ...prevSettings,
                colorOffset: appSettings.time % appSettings.colorOffsetMax,
            }));
        }
    }, [appSettings.time, appSettings.colorOffsetMax]);

    // Keys Pressing
    window.onkeydown = (event) => {
        if (event.key === " ") {
            setAppSettings((prevSettings) => ({
                ...prevSettings,
                playTime: !appSettings.playTime,
            }));
        }
    };

    return (
        <AppContext.Provider
            value={{ shaderSettings, setShaderSettings, appSettings, setAppSettings }}
        >
            <FractalCanvas
                id="FractalCanvas"
                className="FractalCanvas"
                onWheel={handleWheel}
            />
            <span onWheel={handleWheel}>
                {shaderSettings.fractal == Fractals.Julia ? (
                    <ControlPoint
                        getter={appSettings.juliaC}
                        setter={(newPoint) => {
                            setShaderSettings((prevSettings) => ({
                                ...prevSettings,
                                juliaC: PixelToPoint(newPoint),
                            }));
                            setAppSettings((prevSettings) => ({
                                ...prevSettings,
                                juliaC: newPoint,
                            }));
                        }}
                    />
                ) : shaderSettings.fractal == Fractals.Mandelbrot ? (
                    <></>
                ) : shaderSettings.fractal == Fractals.Newton ? (
                    <>
                        <ControlPoint
                            hidden={shaderSettings.newtonCChecked == 1}
                            getter={appSettings.newtonR}
                            setter={(newPoint) => {
                                setShaderSettings((prevSettings) => ({
                                    ...prevSettings,
                                    newtonR: PixelToPoint(newPoint),
                                }));
                                setAppSettings((prevSettings) => ({
                                    ...prevSettings,
                                    newtonR: newPoint,
                                }));
                            }}
                        />
                        <ControlPoint
                            hidden={shaderSettings.newtonCChecked == 2}
                            getter={appSettings.newtonG}
                            setter={(newPoint) => {
                                setShaderSettings((prevSettings) => ({
                                    ...prevSettings,
                                    newtonG: PixelToPoint(newPoint),
                                }));
                                setAppSettings((prevSettings) => ({
                                    ...prevSettings,
                                    newtonG: newPoint,
                                }));
                            }}
                        />
                        <ControlPoint
                            hidden={shaderSettings.newtonCChecked == 3}
                            getter={appSettings.newtonB}
                            setter={(newPoint) => {
                                setShaderSettings((prevSettings) => ({
                                    ...prevSettings,
                                    newtonB: PixelToPoint(newPoint),
                                }));
                                setAppSettings((prevSettings) => ({
                                    ...prevSettings,
                                    newtonB: newPoint,
                                }));
                            }}
                        />
                    </>
                ) : (
                    <></>
                )}
            </span>
            <SettingsTab />
        </AppContext.Provider>
    );
}
