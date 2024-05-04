import { createContext } from "react";

export type Point = {
    x: number;
    y: number;
};

export type Color = {
    r: number;
    g: number;
    b: number;
};

export type ColorT = {
    r: number;
    g: number;
    b: number;
    t: number;
};

export enum Fractals {
    Julia,
    Mandelbrot,
    Newton,
}

export const colorToVec4 = (color: Color | ColorT) =>
    "t" in color ? [color.r, color.g, color.b, color.t] : [color.r, color.g, color.b];

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
    uColors: ColorT[];
    uFillingColor: Color;
    uFractal: Fractals;
    uJuliaC: Point;
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
    sMouse: Point;
    sMouseDown: boolean;
    sMouseDownTarget: HTMLElement;
    sPlayTime: boolean;
    sTimeFactor: number;
    sJuliaC: Point;
}

export interface ContextSettings extends Attributes, Uniforms, Settings {}

const AppContext = createContext<{
    settings: ContextSettings;
    setSettings: React.Dispatch<React.SetStateAction<ContextSettings>>;
}>(null!);
export default AppContext;
