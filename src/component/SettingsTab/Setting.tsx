import { useEffect, useState } from "react";

export interface SettingProps {
    title: String;
    min: number;
    max: number;
    getter: number;
    setter: (value: number) => void;
}

export default function Setting(props: SettingProps) {
    // TODO: logarithmic multiplier
    const [value, setValue] = useState(0);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        setValue(props.getter);
    }, [props.getter]);

    return (
        <div className="setting">
            <label className="settingTitle">{props.title}</label>
            <input
                className="settingRange"
                type="range"
                min={props.min}
                max={props.max}
                step={0.001}
                value={value}
                onChange={(e) => props.setter(parseFloat(e.target.value))}
            />

            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 45 45"
                fill="none"
                className="settingCheckbox"
                onClick={() => setChecked(!checked)}
            >
                <path
                    className="box"
                    d="M37 1.5C38.5122 1.5 40.1499 2.27118 41.4393 3.56066C42.7288 4.85014 43.5 6.48785 43.5 8V37C43.5 38.5122 42.7288 40.1499 41.4393 41.4393C40.1499 42.7288 38.5122 43.5 37 43.5H8C6.48785 43.5 4.85014 42.7288 3.56066 41.4393C2.27118 40.1499 1.5 38.5122 1.5 37V8C1.5 6.48785 2.27118 4.85014 3.56066 3.56066C4.85014 2.27118 6.48785 1.5 8 1.5H37Z"
                    strokeWidth="3"
                />
                {checked ? (
                    <path
                        className="check"
                        d="M9 23.3261L18.5806 32L36 13"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                ) : (
                    <></>
                )}
            </svg>
        </div>
    );
}
