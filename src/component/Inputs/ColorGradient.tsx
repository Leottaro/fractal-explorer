import { createRef, useContext, useEffect, useState } from "react";
import AppContext, { ColorT } from "../../context/AppContext";
import Thumb from "./Thumb";
import { RgbColorPicker } from "react-colorful";

interface Selected {
    index: number;
    element: HTMLDivElement;
}

const toDisplayT = (t: number) => t * 0.94 + 0.03;
const fromDisplayT = (t: number) => (t - 0.03) / 0.94;

const to256 = (p: number) => Math.round(p * 255);
const torgb = (color: ColorT) =>
    `rgb(${to256(color.r)},${to256(color.g)},${to256(color.b)}) ${color.t * 100}`;
function toLinearGradient(colors: ColorT[]): string {
    return (
        "linear-gradient(90deg, " +
        [...colors]
            .map((color) => ({ ...color, t: toDisplayT(color.t) }))
            .sort((a, b) => a.t - b.t)
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
    const [dragged, setDragged] = useState<boolean>(false);
    const sliderRef = createRef<HTMLDivElement>();

    const deselect = () => {
        if (selected === undefined) {
            return;
        }
        selected.element.style.zIndex = "0";
        setDragged(false);
        setSelected(undefined);
    };

    useEffect(() => {
        if (!selected || !dragged || !sliderRef.current) return;

        const sliderLeft = sliderRef.current.getBoundingClientRect().left;
        const sliderWidth = sliderRef.current.getBoundingClientRect().width;
        let newOffset = fromDisplayT((settings.sMouse.x - sliderLeft) / sliderWidth);

        if (newOffset < 0) {
            newOffset = 0;
        } else if (newOffset > 1) {
            newOffset = 1;
        }

        if (newOffset !== settings.uColors[selected.index].t) {
            settings.uColors[selected.index].t = newOffset;
        }
    }, [settings.sMouse]);

    useEffect(() => {
        if (!settings.sMouseDownTarget) {
            deselect();
        }
    }, [settings.sMouseDownTarget]);

    const handleThumbMouseLeave = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (dragged) return;
        if ((event.relatedTarget as HTMLElement).classList.contains("colorGradientPicker")) return;
        if ((event.relatedTarget as HTMLElement).classList.contains("colorGradientThumb")) return;
        deselect();
    };

    return (
        <div
            ref={sliderRef}
            className="settingRange"
            style={{
                background: toLinearGradient(settings.uColors),
                position: "relative",
                overflow: "visible",
            }}
        >
            {settings.uColors.map((color, index) => (
                <Thumb
                    key={index}
                    sliderRef={sliderRef}
                    offset={toDisplayT(color.t)}
                    background={torgb(color).split(" ")[0]}
                    onMouseDown={() => {
                        setDragged(true);
                    }}
                    onThumbMouseEnter={(thumbDiv) => {
                        if (dragged) return;
                        thumbDiv.style.zIndex = "1";
                        setSelected({ index, element: thumbDiv });
                    }}
                    onMouseLeave={handleThumbMouseLeave}
                />
            ))}
            {selected !== undefined && !dragged ? (
                <RgbColorPicker
                    className="colorGradientPicker"
                    style={{
                        width: "50%",
                        aspectRatio: 1,
                        left:
                            Math.max(Math.min(parseInt(selected.element.style.left), 75), 25) + "%",
                    }}
                    color={{
                        r: settings.uColors[selected.index].r * 255,
                        g: settings.uColors[selected.index].g * 255,
                        b: settings.uColors[selected.index].b * 255,
                    }}
                    onChange={(newColor) => {
                        settings.uColors[selected.index].r = newColor.r / 255;
                        settings.uColors[selected.index].g = newColor.g / 255;
                        settings.uColors[selected.index].b = newColor.b / 255;
                    }}
                    onMouseLeave={handleThumbMouseLeave}
                />
            ) : (
                <></>
            )}
        </div>
    );
}
