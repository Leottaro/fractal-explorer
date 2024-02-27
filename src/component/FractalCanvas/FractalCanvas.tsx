import React, { createRef, useEffect, useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import Renderer from "./Renderer";

export default function FractalCanvas(props: React.CanvasHTMLAttributes<HTMLCanvasElement>) {
    const { settings } = useContext(AppContext);

    const canvasRef = createRef<HTMLCanvasElement>();
    const [renderer, setRenderer] = useState<Renderer>(null!);

    useEffect(() => {
        if (!canvasRef.current) {
            throw new Error("can't find the canvas");
        }
        const newRenderer = new Renderer(canvasRef.current);
        newRenderer.Init("shaders/mandelbrot.wgsl").then(() => setRenderer(newRenderer));
    }, []);

    useEffect(() => {
        if (!renderer) {
            return;
        }
        renderer.updateSettings(settings);
        renderer.draw();
    }, [renderer, settings]);

    return (
        <canvas
            ref={canvasRef}
            {...props}
        ></canvas>
    );
}
