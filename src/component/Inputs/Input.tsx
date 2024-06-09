import Container from "@component/Container/Container";
import { LabelProps } from "@utils/exports";
import Label from "@component/Label/Label";
import { useEffect, useState } from "react";

interface TextInputProps extends LabelProps {
    value: number;
    onInputValid: (value: number) => void;
    disabled?: boolean;
}

export default function TextInput({
    value,
    onInputValid,
    disabled,
    ...labelProps
}: TextInputProps) {
    const [inputValue, setInputValue] = useState<string>(value.toString());

    useEffect(() => {
        setInputValue(value.toString());
    }, [value]);

    return (
        <Container className="w-full px-2 h-10 bg-opacity-100 bg-neutral-200 border-neutral-800">
            <Label
                {...labelProps}
                className={labelProps.className + " w-full"}
                onKeyDown={(e) => {
                    if (e.key === "Enter") onInputValid(parseFloat(inputValue));
                }}
                onBlur={() => onInputValid(parseFloat(inputValue))}
            >
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={disabled}
                    className="w-full h-full bg-transparent text-neutral-800 focus:outline-none"
                />
            </Label>
        </Container>
    );
}
