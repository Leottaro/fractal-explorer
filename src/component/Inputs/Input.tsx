import Container from "@component/Container/Container";

interface TextInputProps {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
}

export default function TextInput({ value, onChange, disabled }: TextInputProps) {
    return (
        <Container className="w-full h-10 ml-2 bg-opacity-100 bg-neutral-200 border-neutral-800">
            <input
                value={value}
                onChange={(e) => {
                    const newValue = parseInt(e.target.value);
                    onChange(isNaN(newValue) ? 0 : newValue);
                }}
                disabled={disabled}
                className="w-full h-full bg-transparent text-neutral-800 focus:outline-none"
            />
        </Container>
    );
}
