import { useContext, useEffect, useState } from "react";
import AppContext, { Point } from "@context/AppContext";

export interface ControlPointProps {
    getter: Point;
    setter: (point: Point) => void;
}

export default function ControlPoint({ getter, setter }: ControlPointProps) {
    const { settings } = useContext(AppContext);
    const [dragged, setDragged] = useState<boolean>(false);
    const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });

    useEffect(() => {
        if (!settings.sMouseDown) {
            setDragged(false);
        }
    }, [settings.sMouseDown]);

    useEffect(() => {
        if (dragged) {
            setter({ x: settings.sMouse.x - offset.x, y: settings.sMouse.y - offset.y });
        }
    }, [settings.sMouse]);

    return (
        <div
            className={
                "absolute -translate-x-1/2 -translate-y-1/2 bg-opacity-50 backdrop-blur-sm border-2 border-white rounded-full transition-[width,height] duration-500 " +
                (dragged ? "size-8" : "hover:size-8 size-6")
            }
            style={{ left: getter.x, top: getter.y }}
            onMouseDown={() => {
                setOffset({ x: settings.sMouse.x - getter.x, y: settings.sMouse.y - getter.y });
                setDragged(true);
            }}
        ></div>
    );
}
