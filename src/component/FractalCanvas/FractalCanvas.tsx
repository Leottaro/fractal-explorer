import { createRef, useEffect, useContext, useState, useRef, HTMLAttributes } from "react";

import { AppContext, LabelBaseColors, LabelFonts } from "@utils/exports";
import Renderer from "@utils/Renderer/Renderer";
import Stats from "@utils/Stats";
import Label from "@component/Label/Label";

export default function FractalCanvas(attributes: HTMLAttributes<HTMLCanvasElement>) {
    const { shaderSettings, appSettings, setAppSettings } = useContext(AppContext);

    const canvasRef = createRef<HTMLCanvasElement>();
    const [renderer, setRenderer] = useState<Renderer>(null!);
    const stats = useRef<Stats>(new Stats(50));

    useEffect(() => {
        if (!canvasRef.current) {
            throw new Error("can't find the canvas");
        }
        const newRenderer = new Renderer(canvasRef.current);
        newRenderer
            .Init(shaderSettings, "shaders/fractals.wgsl")
            .then(() => setRenderer(newRenderer));
    }, [canvasRef.current]);

    useEffect(() => {
        if (!renderer) {
            return;
        }
        function reRender() {
            if (renderer.isDrawing()) return;

            renderer.updateSettings(shaderSettings);
            renderer.draw().then((deltaTime) => {
                if (!deltaTime || !stats.current) return;
                if (appSettings.playTime) {
                    setAppSettings((prevSettings) => ({
                        ...prevSettings,
                        time:
                            (1000 +
                                prevSettings.time +
                                (prevSettings.timeFactor * deltaTime) / 1000) %
                            1000,
                    }));
                }
                stats.current.update(deltaTime);
            });
        }
        reRender();
        if (!appSettings.playTime) {
            return;
        }
        const loop = setInterval(reRender, 0);
        return () => clearInterval(loop);
    }, [renderer, shaderSettings, appSettings.time, appSettings.playTime]);

    return (
        <>
            <canvas
                {...attributes}
                ref={canvasRef}
            ></canvas>
            {appSettings.playTime ? (
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
