import { createRef, useContext, useState } from "react";
import AppContext, { Color } from "../../context/AppContext";
import Thumb from "./Thumb";

interface Selected {
    index: number;
    element: HTMLDivElement;
}

const offset: number = 0.03;
const to256 = (p: number) => Math.round(p * 255);
const torgb = (color: Color) =>
    `rgb(${to256(color.r)}, ${to256(color.g)}, ${to256(color.b)}) ${(color.t ?? 0) * 100}`;
function toLinearGradient(colors: Color[]): string {
    return (
        "linear-gradient(90deg, " +
        [...colors]
            .sort((a, b) => (a.t ?? 0) - (b.t ?? 0))
            .map((color) => torgb(color) + "%")
            .reduce(
                (previousValue: string, currentValue: string) => previousValue + ", " + currentValue
            ) +
        ")"
    );
}

export default function ColorGradient() {
    const { settings, setSettings } = useContext(AppContext);
    const [selected, setSelected] = useState<Selected | undefined>();
    const deselect = () => {
        if (selected === undefined) {
            return;
        }
        selected.element.style.zIndex = "0";
        setSelected(undefined);
    };

    const sliderRef = createRef<HTMLDivElement>();

    return (
        <div
            ref={sliderRef}
            className="settingRange"
            style={{
                background: toLinearGradient(settings.uColors),
                position: "relative",
                overflow: "visible",
            }}
            onMouseUp={deselect}
            onMouseLeave={deselect}
            onMouseMove={(event) => {
                if (!selected || !sliderRef.current) return;

                const sliderLeft = sliderRef.current.getBoundingClientRect().left;
                const sliderWidth = sliderRef.current.getBoundingClientRect().width;
                let newOffset = (event.clientX - sliderLeft) / sliderWidth;

                if (newOffset < offset) {
                    newOffset = offset;
                } else if (newOffset > 1 - offset) {
                    newOffset = 1 - offset;
                }

                if (newOffset !== settings.uColors[selected.index].t) {
                    const newColors = settings.uColors;
                    newColors[selected.index].t = newOffset;
                }
            }}
        >
            {settings.uColors.map((color, index) => (
                <Thumb
                    key={index}
                    sliderRef={sliderRef}
                    offset={color.t ?? 0}
                    onThumbMouseDown={(thumbRef) =>
                        setSelected({ index, element: thumbRef.current! })
                    }
                    onThumbMouseUp={deselect}
                />
            ))}
        </div>
    );
}
