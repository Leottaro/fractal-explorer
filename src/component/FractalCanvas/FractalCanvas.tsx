import { createRef, useEffect } from "react";
import { Init, fetchShader, buildShader, buildAttributes, buidlUniforms, draw } from "./FractalMethods";

export interface FractalCanvasAttributesProps {
    aSize: number[],
}

export interface FractalCanvasUniformsProps {
    uAspectRatio: number,
    uCenter: number[],
    uZoom: number,
    uMaxIters: number,
    uGlow: number,
    uSmoothColors: boolean,
    uMouse: number[],
    uTime: number,
}

interface FractalCanvasProps {
    attributes: FractalCanvasAttributesProps,
    uniforms: FractalCanvasUniformsProps,
    canvasProps: {},
}

export default function FractalCanvas({ attributes, uniforms, canvasProps }: FractalCanvasProps) {
    const ref = createRef<HTMLCanvasElement>();

    useEffect(() => {
        if (!ref.current) return;
        Init(ref.current, attributes, uniforms);
    }, []);

    useEffect(() => {
        buildAttributes(attributes);
        buidlUniforms(uniforms);
        draw();
    }, [attributes, uniforms]);

    return (
        <canvas ref={ref} {...canvasProps}></canvas>
    );
}