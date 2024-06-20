import { HTMLAttributes } from "react";
import Container from "../Container/Container";

interface ButtonProps extends HTMLAttributes<HTMLDivElement> {
    blur?: boolean;
    onClick: () => void;
}

export default function Button({ blur, onClick, ...attributes }: ButtonProps) {
    return (
        <Container
            hover
            blur={blur}
            onClick={onClick}
            {...attributes}
        />
    );
}
