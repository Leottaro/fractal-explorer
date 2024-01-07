import { useEffect, useRef, useState } from 'react';
import './App.css';

import WebGLCanvas from "./component/WebGLCanvas/WebGLCanvas";

// const stopInterval = () => {
//     if (intervalRef.current) {
//         window.clearInterval(intervalRef.current);
//         setTime(0);
//         intervalRef.current = null;
//     }
// };

export default function App() {
    const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
    window.onresize = () => { setSize([window.innerWidth, window.innerHeight]) };

    const [center, setCenter] = useState([0., 0.]);
    const [zoom, setZoom] = useState(1);
    const [maxIters, setMaxIters] = useState(50.);
    const [glow, setGlow] = useState(1.25);
    const [smoothColors, setSmoothColors] = useState(true);

    const [mouse, setMouse] = useState([0, 0]);
    window.onmousemove = (event) => { setMouse([event.offsetX / size[0], event.offsetY / size[1]].map(coord => coord * 2 - 1)) };

    const [time, setTime] = useState(0);
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

    useEffect(() => {
        // setZoom(zoom * 1.01);
    }, [time]);

    return (
        <WebGLCanvas
            attributes={{
                aSize: size,
            }}
            uniforms={{
                uAspectRatio: size[0] / size[1],
                uCenter: center,
                uZoom: zoom,
                uMaxIters: maxIters,
                uGlow: glow,
                uSmoothColors: smoothColors,
                uMouse: mouse,
                uTime: time,
            }}
        />
    );
}