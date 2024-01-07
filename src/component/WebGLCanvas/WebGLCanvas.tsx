import { useRef, useEffect } from "react";
import { Init, fetchShader, buildShader, buildAttributes, buidlUniforms, draw } from "./WebGLMethods";

export interface WebGLCanvasAttributesProps {
    aSize: number[],
}

export interface WebGLCanvasUniformsProps {
    uAspectRatio: number,
    uCenter: number[],
    uZoom: number,
    uMaxIters: number,
    uGlow: number,
    uSmoothColors: boolean,
    uMouse: number[],
    uTime: number,
}

interface WebGLCanvasProps {
    attributes: WebGLCanvasAttributesProps,
    uniforms: WebGLCanvasUniformsProps,
}

export default function WebGLCanvas({ attributes, uniforms }: WebGLCanvasProps) {
    const ref = useRef<HTMLCanvasElement | null>(null);

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
        <canvas ref={ref} id={"glcanvas"}></canvas>
    );
}