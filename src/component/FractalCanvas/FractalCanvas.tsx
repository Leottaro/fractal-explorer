import { createRef, useEffect, useContext, useState, useRef, HTMLAttributes } from "react";
import AppContext from "../../context/AppContext";
import Renderer from "../../utils/Renderer/Renderer";
import Stats from "../../utils/Stats";
import Label, { LabelBaseColors, LabelFonts } from "../Label/Label";

export default function FractalCanvas(attributes: HTMLAttributes<HTMLCanvasElement>) {
    const { settings, setSettings } = useContext(AppContext);

    const canvasRef = createRef<HTMLCanvasElement>();
    const [renderer, setRenderer] = useState<Renderer>(null!);
    const stats = useRef<Stats>(new Stats(50));

    useEffect(() => {
        if (!canvasRef.current) {
            throw new Error("can't find the canvas");
        }
        const newRenderer = new Renderer(canvasRef.current);
        newRenderer.Init(settings, "shaders/fractals.wgsl").then(() => setRenderer(newRenderer));
    }, [canvasRef.current]);

    useEffect(() => {
        if (!renderer) {
            return;
        }
        function reRender() {
            if (renderer.isDrawing()) return;

            renderer.updateSettings(settings);
            renderer.draw().then((deltaTime) => {
                if (!deltaTime || !stats.current) return;
                if (settings.sPlayTime) {
                    setSettings((prevSettings) => ({
                        ...prevSettings,
                        uTime:
                            (1000 +
                                prevSettings.uTime +
                                (prevSettings.sTimeFactor * deltaTime) / 1000) %
                            1000,
                    }));
                }
                stats.current.update(deltaTime);
            });
        }
        reRender();
        if (!settings.sPlayTime) {
            return;
        }
        const loop = setInterval(reRender, 0);
        return () => clearInterval(loop);
    }, [renderer, settings]);

    return (
        <>
            <canvas
                {...attributes}
                ref={canvasRef}
            ></canvas>
            {settings.sPlayTime ? (
                <Label
                    font={LabelFonts.Roboto}
                    baseColor={LabelBaseColors.Ligth}
                    bold
                    className="absolute left-0 top-0 m-2 "
                >
                    {Math.floor(1000 / stats.current.getAvgMs())}fps
                </Label>
            ) : (
                <></>
            )}
        </>
    );
}
