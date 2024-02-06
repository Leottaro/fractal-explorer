import { createContext } from "react";

export type Point = {
    x: number;
    y: number;
};

export interface Attributes {
    aWidth: number;
    aHeight: number;
}

export interface Uniforms {
    uAspectRatio: number;
    uCenter: Point;
    uMaxIters: number;
    uGlow: number;
    uSmoothColors: boolean;
    uZoom: number;
    uMouse: Point;
    uTime: number;
}

export interface Settings {
    sZoomMin: number;
    sZoomMax: number;
    sZoomRate: number;
    sGlowMin: number;
    sGlowMax: number;
    sMaxItersFactor: number;
    sMaxItersFactorMin: number;
    sMaxItersFactorMax: number;
    sMouseDown: boolean;
    sMouse: Point;
}

export interface ContextSettings extends Attributes, Uniforms, Settings {}

const AppContext = createContext<{
    settings: ContextSettings;
    setSettings: React.Dispatch<React.SetStateAction<ContextSettings>>;
}>(null!);
export default AppContext;
