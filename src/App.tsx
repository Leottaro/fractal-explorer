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
    const [maxIters, setMaxIters] = useState(50.);
    const [glow, setGlow] = useState(1.25);
    const [smoothColors, setSmoothColors] = useState(false);

    const zoomRate = 1.05;
    const [zoom, setZoom] = useState(2.);
    window.onwheel = (event) => {
        if (event.deltaY < 0) {
            setZoom(zoom * zoomRate);
        } else {
            setZoom(zoom / zoomRate)
        }
    }
    useEffect(() => {
        setMaxIters(Math.sqrt(2*Math.sqrt(Math.abs(1 - Math.sqrt(5 * zoom)))) * 100);
    }, [zoom]);
    
    const [mouseDown, setMouseDown] = useState(false);
    window.onmousedown = () => setMouseDown(true);
    window.onmouseup = () => setMouseDown(false);

    const [mouse, setMouse] = useState([0, 0]);
    window.onmousemove = (event) => {
        const newMouse = [event.offsetX, -event.offsetY].map(coord => (coord / size[1]) * 2 - 1);
        if (mouseDown) {
            const deltaMouse = [newMouse[0] - mouse[0], newMouse[1] - mouse[1]].map(coord => coord / zoom);
            setCenter([center[0] - deltaMouse[0], center[1] - deltaMouse[1]]);
        }
        setMouse(newMouse);
    }

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