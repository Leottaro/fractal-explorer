import { createContext, useState } from "react";

export interface Attributes {
    aWidth: number,
    aHeight: number,
}

export interface Uniforms {
    uAspectRatio: number,
    uCenter: number[],
    uMaxIters: number,
    uGlow: number,
    uSmoothColors: boolean,
    uZoom: number,
    uMouse: number[],
    uTime: number,
}

export interface Settings {
    sZoomRate: number,
    sMouseDown: boolean,
}

export interface ContextSettings extends Attributes, Uniforms, Settings { }

const AppContext = createContext<{
    settings: ContextSettings,
    setSettings: React.Dispatch<React.SetStateAction<ContextSettings>>,
}>(null!);
export default AppContext;