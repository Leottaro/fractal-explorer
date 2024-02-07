import { useEffect, useState } from "react";

export enum SliderTypes {
    LINEAR,
    EXPONENTIAL,
}

export interface SliderProps {
    min: number;
    max: number;
    getter: number;
    setter: (value: number) => void;
    sliderType: SliderTypes;
}

export default function Slider(props: SliderProps) {
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
    }, [props.min, props.max]);

    useEffect(() => {
        switch (props.sliderType) {
            case SliderTypes.LINEAR:
                setValue((props.getter - valueRange.min) / scale);
                break;
            case SliderTypes.EXPONENTIAL:
                setValue((Math.log(props.getter) - valueRange.min) / scale);
                break;
        }
    }, [props.getter, scale]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const sliderVal = parseFloat(e.target.value);
        switch (props.sliderType) {
            case SliderTypes.LINEAR:
                props.setter(valueRange.min + sliderVal * scale);
                break;
            case SliderTypes.EXPONENTIAL:
                props.setter(Math.exp(valueRange.min + sliderVal * scale));
                break;
        }
    }

    return (
        <input
            className="settingRange"
            type="range"
            min={0}
            max={1}
            step={0.000001}
            value={value}
            onChange={handleInputChange}
        />
    );
}
