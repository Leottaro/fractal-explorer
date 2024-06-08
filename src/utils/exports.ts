import { createContext, HTMLAttributes } from "react";

// TYPES

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

// ENUMS

export enum Fractals {
    Julia,
    Mandelbrot,
    Newton,
}

export interface LabelProps extends HTMLAttributes<HTMLLabelElement> {
    font: LabelFonts;
    baseColor: LabelBaseColors;
    bold?: boolean;
    hover?: boolean;
    selected?: boolean;
    selectionable?: boolean;
    wrapText?: boolean;
}

export enum LabelFonts {
    Poppins = "font-poppins",
    Roboto = "font-robotomono",
}

export enum LabelBaseColors {
    Ligth = "text-neutral-200",
    Dark = "text-neutral-400",
}

export enum SliderTypes {
    LINEAR,
    EXPONENTIAL,
}

export enum IconType {
    Arrow = "M13.333 33.833 26.666 20.5 13.333 7.167",
    DoubleArrow = "M18.333 33.833 31.667 20.5 18.332 7.167m-10 26.666L21.666 20.5 8.333 7.167",
    Play = "M13.334 30.5v-20l13.333 10-13.334 10Z",
    Pause = "M26.667 10.5v20m-13.334-20v20",
    Reset = "M30 7.167v26.666M23.333 7.167 10 20.5l13.333 13.333",
}

// INTERFACES

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    blur?: boolean;
}

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
    uNewtonR: Point;
    uNewtonG: Point;
    uNewtonB: Point;
    uNewtonCChecked: number;
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
    sNewtonR: Point;
    sNewtonG: Point;
    sNewtonB: Point;
}

export interface ContextSettings extends Attributes, Uniforms, Settings {}

// FUNCTIONS

export function pointLerp(a: Point, b: Point, p: number) {
    return {
        x: a.x + p * (b.x - a.x),
        y: a.y + p * (b.y - a.y),
    };
}
export const colorToVec4 = (color: Color | ColorT) =>
    "t" in color ? [color.r, color.g, color.b, color.t] : [color.r, color.g, color.b];

export const toDisplayT = (t: number) => t * 0.94 + 0.03;
export const fromDisplayT = (t: number) => (t - 0.03) / 0.94;

export const to256 = (p: number) => Math.round(p * 255);
export const torgb = (color: ColorT) =>
    `rgb(${to256(color.r)},${to256(color.g)},${to256(color.b)}) ${color.t * 100}`;

export function toLinearGradient(colors: ColorT[]): string {
    if (colors.length == 1) {
        return torgb(colors[0]).split(" ")[0];
    }
    return (
        "linear-Gradient(90deg, " +
        [...colors]
            .map((color) => ({ ...color, t: toDisplayT(color.t) }))
            .sort((a, b) => a.t - b.t)
            .map((color) => torgb(color) + "%")
            .reduce(
                (previousValue: string, currentValue: string) => previousValue + ", " + currentValue
            ) +
        ")"
    );
}

export function discardNull(element: any | null | undefined, errorMessage: string) {
    if (!element) {
        console.error(errorMessage);
        alert(errorMessage);
        throw new Error(errorMessage);
    }
    return element;
}

// OTHERS

export const AppContext = createContext<{
    settings: ContextSettings;
    setSettings: React.Dispatch<React.SetStateAction<ContextSettings>>;
}>(null!);
