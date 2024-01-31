import { createContext } from "react";

export interface Attributes {
    aWidth: number;
    aHeight: number;
}

export interface Uniforms {
    uAspectRatio: number;
    uCenter: number[];
    uMaxIters: number;
    uGlow: number;
    uSmoothColors: boolean;
    uZoom: number;
    uMouse: number[];
    uTime: number;
}

export interface Settings {
    sZoomMin: number;
    sZoomMax: number;
    sZoomRate: number;
    sGlowMin: number;
    sGlowMax: number;
    sMouseDown: boolean;
}

export interface ContextSettings extends Attributes, Uniforms, Settings {}

const AppContext = createContext<{
    settings: ContextSettings;
    setSettings: React.Dispatch<React.SetStateAction<ContextSettings>>;
}>(null!);
export default AppContext;
