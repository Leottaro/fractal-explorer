import { createRef, useContext, useEffect, useState } from "react";

import { AppContext, LabelBaseColors, LabelFonts, SliderTypes } from "@utils/exports";
import Label from "@component/Label/Label";

interface SliderProps {
    min: number;
    printedMin?: string;
    max: number;
    printedMax?: string;
    getter: number;
    setter: (value: number) => void;
    sliderType: SliderTypes;
    disabled?: boolean;
}

export default function Slider({
    min,
    printedMin,
    max,
    printedMax,
    getter,
    setter,
    sliderType,
    disabled,
}: SliderProps) {
    const { appSettings } = useContext(AppContext);
    const [dragged, setDragged] = useState(false);
    const sliderRef = createRef<HTMLDivElement>();

    const [valueRange, setValueRange] = useState({ min: 0, max: 1 });
    const [value, setValue] = useState(getter);
    const [scale, setScale] = useState(max - min);

    useEffect(() => {
        let newValueRange = { min: 0, max: 1 };
        switch (sliderType) {
            case SliderTypes.LINEAR:
                newValueRange = { min, max };
                break;
            case SliderTypes.EXPONENTIAL:
                newValueRange = { min: Math.log(min), max: Math.log(max) };
                break;
        }
        setValueRange(newValueRange);
        setScale(newValueRange.max - newValueRange.min);
    }, [min, max, sliderType]);

    useEffect(() => {
        switch (sliderType) {
            case SliderTypes.LINEAR:
                setValue((getter - valueRange.min) / scale);
                break;
            case SliderTypes.EXPONENTIAL:
                setValue((Math.log(getter) - valueRange.min) / scale);
                break;
        }
    }, [getter, scale, sliderType]);

    useEffect(() => {
        if (!appSettings.mouseDown) {
            setDragged(false);
        }
    }, [appSettings.mouseDown]);

    useEffect(() => {
        if (!dragged || !sliderRef.current) return;

        const sliderLeft = sliderRef.current.getBoundingClientRect().left;
        const sliderWidth = sliderRef.current.getBoundingClientRect().width;
        let sliderValue = (appSettings.mousePixel.x - sliderLeft) / sliderWidth;

        if (sliderValue < 0) {
            sliderValue = 0;
        } else if (sliderValue > 1) {
            sliderValue = 1;
        }

        switch (sliderType) {
            case SliderTypes.LINEAR:
                setter(valueRange.min + sliderValue * scale);
                break;
            case SliderTypes.EXPONENTIAL:
                setter(Math.exp(valueRange.min + sliderValue * scale));
                break;
        }
    }, [appSettings.mousePixel]);

    return (
        <div className="flex flex-grow flex-row items-center gap-4">
            <Label
                font={LabelFonts.Poppins}
                baseColor={LabelBaseColors.Ligth}
            >
                {printedMin ?? min}
            </Label>
            <div
                ref={sliderRef}
                className={
                    "relative h-2 w-full overflow-visible rounded-full bg-neutral-600 " +
                    (disabled ? "brightness-50" : "")
                }
            >
                <span
                    className="absolute left-0 h-full rounded-s-full bg-neutral-400"
                    style={{ width: `${Math.round(value * 100)}%` }}
                />
                <div
                    className="absolute top-1/2 aspect-square h-[250%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-200"
                    style={{ marginLeft: `${Math.round(value * 100)}%` }}
                    onMouseDown={disabled ? () => {} : () => setDragged(true)}
                />
            </div>
            <Label
                font={LabelFonts.Poppins}
                baseColor={LabelBaseColors.Ligth}
            >
                {printedMax ?? max}
            </Label>
        </div>
    );
}
