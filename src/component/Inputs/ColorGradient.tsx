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
    const { settings, setSettings } = useContext(AppContext);
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

    const addThumb = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!sliderRef.current) return;
        if (!(event.target as HTMLElement).classList.contains("colorGradient")) return;

        const sliderLeft = sliderRef.current.getBoundingClientRect().left;
        const sliderWidth = sliderRef.current.getBoundingClientRect().width;
        let newOffset = fromDisplayT((settings.sMouse.x - sliderLeft) / sliderWidth);

        const newColors = [...settings.uColors, { r: 0, g: 0, b: 0, t: newOffset }].sort(
            (a, b) => a.t - b.t
        );
        const newColorIndex = newColors.findIndex((color) => color.t === newOffset);
        const beforeColor = newColors[newColorIndex - 1];
        const afterColor = newColors[newColorIndex + 1];
        const percent = (newOffset - beforeColor.t) / (afterColor.t - beforeColor.t);

        newColors[newColorIndex].r = afterColor.r * percent + beforeColor.r * (1 - percent);
        newColors[newColorIndex].g = afterColor.g * percent + beforeColor.g * (1 - percent);
        newColors[newColorIndex].b = afterColor.b * percent + beforeColor.b * (1 - percent);
        setSettings({ ...settings, uColors: newColors });
    };

    return (
        <div
            ref={sliderRef}
            className="settingRange colorGradient"
            style={{
                background: toLinearGradient(settings.uColors),
                position: "relative",
                overflow: "visible",
            }}
            onClick={addThumb}
        >
            {settings.uColors.map((color, index) => (
                <Thumb
                    key={index}
                    offset={toDisplayT(color.t)}
                    background={torgb(color).split(" ")[0]}
                    onMouseDown={() => {
                        setDragged(true);
                    }}
                    onMouseEnter={(event) => {
                        if (dragged) return;
                        const thumbDiv = event.target as HTMLDivElement;
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
