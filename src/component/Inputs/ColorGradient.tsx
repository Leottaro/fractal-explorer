import { createRef, useContext, useState } from "react";
import AppContext, { Color } from "../../context/AppContext";
import Thumb from "./Thumb";

interface Selected {
    index: number;
    element: HTMLDivElement;
}

const toDisplayT = (t: number | undefined) => (t ?? 0) * 0.94 + 0.03;
const fromDisplayT = (t: number) => (t - 0.03) / 0.94;

const to256 = (p: number) => Math.round(p * 255);
const torgb = (color: Color) =>
    `rgb(${to256(color.r)}, ${to256(color.g)}, ${to256(color.b)}) ${(color.t ?? 0) * 100}`;
function toLinearGradient(colors: Color[]): string {
    return (
        "linear-gradient(90deg, " +
        [...colors]
            .map((color) => ({ ...color, t: toDisplayT(color.t) }))
            .sort((a, b) => (a.t ?? 0) - (b.t ?? 0))
            .map((color) => torgb(color) + "%")
            .reduce(
                (previousValue: string, currentValue: string) => previousValue + ", " + currentValue
            ) +
        ")"
    );
}

export default function ColorGradient() {
    const { settings } = useContext(AppContext);
    const [selected, setSelected] = useState<Selected | undefined>();

    const deselect = () => {
        if (selected === undefined) {
            return;
        }
        selected.element.style.zIndex = "0";
        setSelected(undefined);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!selected || !sliderRef.current) return;

        const sliderLeft = sliderRef.current.getBoundingClientRect().left;
        const sliderWidth = sliderRef.current.getBoundingClientRect().width;
        let newOffset = fromDisplayT((event.clientX - sliderLeft) / sliderWidth);

        if (newOffset < 0) {
            newOffset = 0;
        } else if (newOffset > 1) {
            newOffset = 1;
        }

        if (newOffset !== settings.uColors[selected.index].t) {
            settings.uColors[selected.index].t = newOffset;
        }
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
            onMouseMove={handleMouseMove}
        >
            {settings.uColors.map((color, index) => (
                <Thumb
                    key={index}
                    sliderRef={sliderRef}
                    offset={toDisplayT(color.t)}
                    onThumbMouseDown={(thumbRef) =>
                        setSelected({ index, element: thumbRef.current! })
                    }
                />
            ))}
        </div>
    );
}
