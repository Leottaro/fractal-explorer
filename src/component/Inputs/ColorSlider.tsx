import { createRef, useContext, useEffect, useState } from "react";
import AppContext, { ColorT } from "../../context/AppContext";
import { RgbColorPicker } from "react-colorful";
import Container from "../Container/Container";
import "./ColorSlider.css";

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
    if (colors.length == 1) {
        return torgb(colors[0]).split(" ")[0];
    }
    return (
        "linear-Gradient(90deg, " +
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

export default function ColorSlider() {
    const { settings, setSettings } = useContext(AppContext);
    const [selected, setSelected] = useState<Selected | undefined>();
    const [dragged, setDragged] = useState<boolean>(false);
    const [shouldDeselect, setShouldDeselect] = useState<boolean>(false);
    const sliderRef = createRef<HTMLDivElement>();

    const deselect = () => {
        if (selected !== undefined) {
            selected.element.style.zIndex = "0";
        }
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
        if (!selected) return;
        if (settings.sMouseDown) return;
        if (!dragged && !shouldDeselect) return;
        deselect();
    }, [selected, settings.sMouseDown, dragged, shouldDeselect, deselect]);

    const handleThumbMouseLeave = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (dragged) return;
        if (settings.sMouseDown) {
            setShouldDeselect(true);
            return;
        }
        if ((event.relatedTarget as HTMLElement).classList.contains("colorSliderPicker")) return;
        if ((event.relatedTarget as HTMLElement).classList.contains("colorSliderThumb")) return;
        deselect();
    };

    const addThumb = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!sliderRef.current || selected) return;
        if (!(event.target as HTMLElement).classList.contains("colorSlider")) return;

        const sliderLeft = sliderRef.current.getBoundingClientRect().left;
        const sliderWidth = sliderRef.current.getBoundingClientRect().width;
        let newOffset = fromDisplayT((settings.sMouse.x - sliderLeft) / sliderWidth);
        newOffset = Math.max(0, Math.min(1, newOffset));

        const newColors = [...settings.uColors, { r: 0, g: 0, b: 0, t: newOffset }].sort(
            (a, b) => a.t - b.t
        );
        const newColorIndex = newColors.findIndex((color) => color.t === newOffset);
        if (newColorIndex == 0) {
            newColors[newColorIndex] = { ...newColors[newColorIndex + 1], t: newOffset };
        } else if (newColorIndex == newColors.length - 1) {
            newColors[newColorIndex] = { ...newColors[newColorIndex - 1], t: newOffset };
        } else {
            const beforeColor = newColors[newColorIndex - 1];
            const afterColor = newColors[newColorIndex + 1];
            const percent = (newOffset - beforeColor.t) / (afterColor.t - beforeColor.t);

            newColors[newColorIndex].r = afterColor.r * percent + beforeColor.r * (1 - percent);
            newColors[newColorIndex].g = afterColor.g * percent + beforeColor.g * (1 - percent);
            newColors[newColorIndex].b = afterColor.b * percent + beforeColor.b * (1 - percent);
        }
        setSettings({ ...settings, uColors: newColors });
    };

    return (
        <div
            ref={sliderRef}
            className="relative h-2 w-full overflow-visible rounded-full bg-neutral-600"
            style={{
                background: toLinearGradient(settings.uColors),
            }}
            onClick={addThumb}
            onContextMenu={(event) => event.preventDefault()}
        >
            {settings.uColors.map((color, index) => (
                <>
                    <div
                        key={index}
                        className="colorSliderThumb absolute top-1/2 aspect-square h-[250%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-200"
                        style={{
                            left: `${toDisplayT(color.t) * 100}%`,
                            background: torgb(color).split(" ")[0],
                        }}
                        onMouseDown={(event) => {
                            if (event.button != 0) return;
                            setDragged(true);
                        }}
                        onMouseEnter={(event) => {
                            if (dragged) return;
                            const thumbDiv = event.target as HTMLDivElement;
                            thumbDiv.style.zIndex = "1";
                            setSelected({ index, element: thumbDiv });
                        }}
                        onMouseLeave={handleThumbMouseLeave}
                        onContextMenu={(event) => {
                            event.preventDefault();
                            if (settings.uColors.length == 1) return;
                            const newColors = [...settings.uColors];
                            newColors.splice(index, 1);
                            setSelected(undefined);
                            setSettings({ ...settings, uColors: newColors });
                        }}
                    />
                </>
            ))}
            {selected !== undefined && !dragged ? (
                <Container
                    className="colorSliderPicker absolute top-full z-10 aspect-square w-1/2 -translate-x-1/2 rounded-lg p-3"
                    style={{
                        left:
                            Math.max(Math.min(parseInt(selected.element.style.left), 75), 25) + "%",
                    }}
                    onMouseEnter={() => setShouldDeselect(false)}
                    onMouseLeave={(event) => handleThumbMouseLeave(event)}
                >
                    <RgbColorPicker
                        className="colorSliderPicker gap-2"
                        style={{ width: "100%", height: "100%" }}
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
                    />
                </Container>
            ) : (
                <></>
            )}
        </div>
    );
}
