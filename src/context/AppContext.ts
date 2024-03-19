import { createContext } from "react";

export type Point = {
    x: number;
    y: number;
};

export type Color = {
    r: number;
    g: number;
    b: number;
    t?: number;
};

export const colorToVec4 = (color: Color) => [color.r, color.g, color.b, color.t ?? 0];

export interface Attributes {
    aWidth: number;
    aHeight: number;
}

export interface Uniforms {
    uAspectRatio: number;
    uCenter: Point;
    uMaxIters: number;
    uColorOffset: number;
    uSmoothColors: boolean;
    uZoom: number;
    uMouse: Point;
    uTime: number;
    uColors: Color[];
    uFillingColor: Color;
}

export interface Settings {
    sZoomMin: number;
    sZoomMax: number;
    sZoomRate: number;
    sColorOffsetMin: number;
    sColorOffsetMax: number;
    sColorOffsetTimeDependant: boolean;
    sMaxItersFactor: number;
    sMaxItersFactorMin: number;
    sMaxItersFactorMax: number;
    sMaxItersZoomDependant: boolean;
    sMouseDown: boolean;
    sMouse: Point;
}

export interface ContextSettings extends Attributes, Uniforms, Settings {}

const AppContext = createContext<{
    settings: ContextSettings;
    setSettings: React.Dispatch<React.SetStateAction<ContextSettings>>;
}>(null!);
export default AppContext;
