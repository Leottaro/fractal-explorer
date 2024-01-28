import React, { createRef, useEffect, useContext } from "react";
import AppContext from "../../context/AppContext";
import { Init, buildAttributes, buidlUniforms, draw } from "./FractalMethods";

export default function FractalCanvas(props: React.CanvasHTMLAttributes<HTMLCanvasElement>) {
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
        <canvas ref={ref} {...props}></canvas>
    );
}