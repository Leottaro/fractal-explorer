import Container from "@component/Container/Container";
import { LabelProps } from "@utils/exports";
import Label from "../Label/Label";

interface TextInputProps extends LabelProps {
    value: number;
    onInputChange: (value: number) => void;
    disabled?: boolean;
}

export default function TextInput({
    value,
    onInputChange,
    disabled,
    ...labelProps
}: TextInputProps) {
    return (
        <Container className="w-full h-10 bg-opacity-100 bg-neutral-200 border-neutral-800">
            <Label {...labelProps}>
                <input
                    value={value}
                    onChange={(e) => {
                        const newValue = parseFloat(e.target.value);
                        if (isNaN(newValue)) {
                            console.log("NaN");
                            return;
                        }
                        if (newValue === value) {
                            console.log("Equal");
                            return;
                        }
                        onInputChange(newValue);
                    }}
                    disabled={disabled}
                    className="w-full h-full bg-transparent text-neutral-800 focus:outline-none"
                />
            </Label>
        </Container>
    );
}
