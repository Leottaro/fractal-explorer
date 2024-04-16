import { createRef, useEffect, useContext, useState, useRef, HTMLAttributes } from "react";
import AppContext from "../../context/AppContext";
import Renderer from "../../utils/Renderer/Renderer";
import Stats from "../../utils/Stats";
import Label, { LabelBaseColors, LabelFonts } from "../Label/Label";

export default function FractalCanvas(attributes: HTMLAttributes<HTMLCanvasElement>) {
    const { settings, setSettings } = useContext(AppContext);

    const canvasRef = createRef<HTMLCanvasElement>();
    const [renderer, setRenderer] = useState<Renderer>(null!);
    const stats = useRef<Stats>();

    useEffect(() => {
        if (!canvasRef.current) {
            throw new Error("can't find the canvas");
        }
        const newRenderer = new Renderer(canvasRef.current);
        newRenderer
            .Init(settings, "shaders/mandelbrot.wgsl")
            // .Init(settings, "shaders/mandelbrot.wgsl", "shaders/compute.wgsl")
            .then(() => setRenderer(newRenderer));
        stats.current = new Stats(50);
    }, []);

    const [avgDeltaTime, setAvgDeltaTime] = useState<number>(0);
    useEffect(() => {
        if (!renderer) {
            return;
        }
        const loop = setInterval(() => {
            if (renderer.isDrawing()) return;

            const newSettings = { ...settings, uTime: performance.now() / 1000 };
            setSettings(newSettings);
            renderer.updateSettings(newSettings);

            renderer.draw().then((deltaTime) => {
                if (!deltaTime || !stats.current) return;
                stats.current.update(deltaTime);
                setAvgDeltaTime(stats.current.getAvgMs());
            });
        }, 0);
        return () => clearInterval(loop);
    }, [renderer, settings]);

    return (
        <>
            <canvas
                {...attributes}
                ref={canvasRef}
                className="FractalCanvas"
            ></canvas>
            <Label
                font={LabelFonts.Roboto}
                baseColor={LabelBaseColors.Ligth}
                bold
                className="absolute left-0 top-0 m-2 "
            >
                {Math.floor(1000 / avgDeltaTime)}fps
            </Label>
        </>
    );
}
