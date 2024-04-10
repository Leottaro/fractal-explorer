import { createRef, useContext, useEffect, useState } from "react";
import Label, { LabelBaseColors, LabelFonts } from "../Label/Label";
import AppContext from "../../context/AppContext";

export enum SliderTypes {
    LINEAR,
    EXPONENTIAL,
}

export interface SliderProps {
    min: number;
    printedMin?: string;
    max: number;
    printedMax?: string;
    getter: number;
    setter: (value: number) => void;
    sliderType: SliderTypes;
    disabled?: boolean;
}

export default function Slider(props: SliderProps) {
    const { settings } = useContext(AppContext);
    const [dragged, setDragged] = useState(false);
    const sliderRef = createRef<HTMLDivElement>();

    const [valueRange, setValueRange] = useState({ min: 0, max: 1 });
    const [value, setValue] = useState(props.getter);
    const [scale, setScale] = useState(props.max - props.min);

    useEffect(() => {
        let newValueRange = { min: 0, max: 1 };
        switch (props.sliderType) {
            case SliderTypes.LINEAR:
                newValueRange = { min: props.min, max: props.max };
                break;
            case SliderTypes.EXPONENTIAL:
                newValueRange = { min: Math.log(props.min), max: Math.log(props.max) };
                break;
        }
        setValueRange(newValueRange);
        setScale(newValueRange.max - newValueRange.min);
    }, [props.sliderType, props.min, props.max]);

    useEffect(() => {
        switch (props.sliderType) {
            case SliderTypes.LINEAR:
                setValue((props.getter - valueRange.min) / scale);
                break;
            case SliderTypes.EXPONENTIAL:
                setValue((Math.log(props.getter) - valueRange.min) / scale);
                break;
        }
    }, [props.sliderType, props.getter, valueRange.min, scale, setValue]);

    useEffect(() => {
        if (!settings.sMouseDown) {
            setDragged(false);
        }
    }, [settings.sMouseDown]);

    useEffect(() => {
        if (!dragged || !sliderRef.current) return;

        const sliderLeft = sliderRef.current.getBoundingClientRect().left;
        const sliderWidth = sliderRef.current.getBoundingClientRect().width;
        let sliderValue = (settings.sMouse.x - sliderLeft) / sliderWidth;

        if (sliderValue < 0) {
            sliderValue = 0;
        } else if (sliderValue > 1) {
            sliderValue = 1;
        }

        switch (props.sliderType) {
            case SliderTypes.LINEAR:
                props.setter(valueRange.min + sliderValue * scale);
                break;
            case SliderTypes.EXPONENTIAL:
                props.setter(Math.exp(valueRange.min + sliderValue * scale));
                break;
        }
    }, [dragged, sliderRef, settings.sMouse, props.sliderType, valueRange, scale, props.setter]);

    return (
        <div className="flex flex-grow flex-row items-center gap-4">
            <Label
                font={LabelFonts.Poppins}
                baseColor={LabelBaseColors.Ligth}
            >
                {props.printedMin ?? props.min}
            </Label>
            <div
                ref={sliderRef}
                className={
                    "relative h-2 w-full overflow-visible rounded-full bg-neutral-600 " +
                    (props.disabled ? "brightness-50" : "")
                }
            >
                <span
                    className="absolute left-0 h-full rounded-s-full bg-neutral-400"
                    style={{ width: `${Math.round(value * 100)}%` }}
                />
                <div
                    className="absolute top-1/2 aspect-square h-[250%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-200"
                    style={{ marginLeft: `${Math.round(value * 100)}%` }}
                    onMouseDown={props.disabled ? () => {} : () => setDragged(true)}
                />
            </div>
            <Label
                font={LabelFonts.Poppins}
                baseColor={LabelBaseColors.Ligth}
            >
                {props.printedMax ?? props.max}
            </Label>
        </div>
    );
}
