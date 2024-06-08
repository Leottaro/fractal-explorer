import { useContext, useEffect, useState } from "react";
import { AppContext, Point } from "@utils/exports";

interface ControlPointProps {
    hidden?: boolean;
    getter: Point;
    setter: (point: Point) => void;
}

export default function ControlPoint({ hidden, getter, setter }: ControlPointProps) {
    const { appSettings } = useContext(AppContext);
    const [dragged, setDragged] = useState<boolean>(false);
    const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });

    useEffect(() => {
        if (!appSettings.mouseDown) {
            setDragged(false);
        }
    }, [appSettings.mouseDown]);

    useEffect(() => {
        if (dragged) {
            setter({
                x: appSettings.mousePixel.x - offset.x,
                y: appSettings.mousePixel.y - offset.y,
            });
        }
    }, [appSettings.mousePixel]);

    return (
        <div
            className={
                "absolute -translate-x-1/2 -translate-y-1/2 bg-opacity-50 backdrop-blur-sm border-2 border-white rounded-full transition-[width,height] duration-500 " +
                (dragged ? "size-8" : "hover:size-8 size-6") +
                " " +
                (hidden ? "invisible" : "visible")
            }
            style={{ left: getter.x, top: getter.y }}
            onMouseDown={() => {
                setOffset({
                    x: appSettings.mousePixel.x - getter.x,
                    y: appSettings.mousePixel.y - getter.y,
                });
                setDragged(true);
            }}
        ></div>
    );
}
