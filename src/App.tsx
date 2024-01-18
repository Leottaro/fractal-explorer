import { useEffect, useRef, useState } from 'react';
import './App.css';

import FractalCanvas, { FractalCanvasAttributesProps, FractalCanvasUniformsProps } from "./component/FractalCanvas/FractalCanvas";
import SettingsTab from './component/SettingsTab/SettingsTab';

const defaultAttributes: FractalCanvasAttributesProps = {
    aSize: [window.innerWidth, window.innerHeight],
}
const defaultUniforms: FractalCanvasUniformsProps = {
    uAspectRatio: window.innerWidth / window.innerHeight,
    uCenter: [0., 0.],
    uMaxIters: 50,
    uGlow: 1.,
    uSmoothColors: true,
    uZoom: 1.,
    uMouse: [0., 0.],
    uTime: 0
}

export default function App() {
    const [size, setSize] = useState(defaultAttributes.aSize);
    window.onresize = () => { setSize([window.innerWidth, window.innerHeight]) };

    const [center, setCenter] = useState(defaultUniforms.uCenter);
    const [maxIters, setMaxIters] = useState(defaultUniforms.uMaxIters);
    const [glow, setGlow] = useState(defaultUniforms.uGlow);
    const [smoothColors, setSmoothColors] = useState(defaultUniforms.uSmoothColors);

    const zoomRate = 1.05;
    const [zoom, setZoom] = useState(defaultUniforms.uZoom);
    window.onwheel = (event) => {
        if (event.deltaY < 0) {
            setZoom(zoom * zoomRate);
        } else {
            setZoom(zoom / zoomRate)
        }
    }
    useEffect(() => {
        setMaxIters(Math.sqrt(2 * Math.sqrt(Math.abs(1 - Math.sqrt(5 * zoom)))) * 75);
    }, [zoom]);

    const [mouseDown, setMouseDown] = useState(false);
    window.onmouseup = () => setMouseDown(false);

    const [mouse, setMouse] = useState(defaultUniforms.uMouse);
    window.onmousemove = (event) => {
        const newMouse = [event.clientX, -event.clientY].map(coord => (coord / size[1]) * 2 - 1);
        if (mouseDown) {
            const deltaMouse = [newMouse[0] - mouse[0], newMouse[1] - mouse[1]].map(coord => coord / zoom);
            setCenter([center[0] - deltaMouse[0], center[1] - deltaMouse[1]]);
        }
        setMouse(newMouse);
    }

    const [time, setTime] = useState(defaultUniforms.uTime);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
            setTime(0);
        }
        intervalRef.current = window.setInterval(() => {
            setTime((time) => time + 0.01);
        }, 10);
    }, []);

    const Attributes: FractalCanvasAttributesProps = {
        aSize: size
    }

    const Uniforms: FractalCanvasUniformsProps = {
        uAspectRatio: size[0] / size[1],
        uCenter: center,
        uZoom: zoom,
        uMaxIters: maxIters,
        uGlow: glow,
        uSmoothColors: smoothColors,
        uMouse: mouse.map(coord => (coord+1)/2).map(coord => (coord-1)/2),
        uTime: time,
    };

    const canvasProps = {
        id: "FractalCanvas",
        onMouseDown: () => setMouseDown(true)
    }

    return (
        <>
            <FractalCanvas attributes={Attributes} uniforms={Uniforms} canvasProps={canvasProps} />
            <SettingsTab />
        </>
    );
}