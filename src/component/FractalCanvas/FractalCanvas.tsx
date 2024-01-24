import { createRef, useEffect, useContext } from "react";
import AppContext from "../../context/AppContext";
import { Init, buildAttributes, buidlUniforms, draw } from "./FractalMethods";

interface FractalCanvasProps {
    canvasProps: {},
}

export default function FractalCanvas({ canvasProps }: FractalCanvasProps) {
    const { settings } = useContext(AppContext);

    const ref = createRef<HTMLCanvasElement>();

    useEffect(() => {
        if (!ref.current) return;
        Init(ref.current, settings);
    }, []);

    useEffect(() => {
        buildAttributes(settings);
        buidlUniforms(settings);
        draw();
    }, [settings]);

    return (
        <canvas ref={ref} {...canvasProps}></canvas>
    );
}