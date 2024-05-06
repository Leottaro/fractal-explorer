import { twMerge } from "tailwind-merge";

import { ContainerProps } from "@utils/exports";

export default function Container({ hover, blur, ...attributes }: ContainerProps) {
    const Classes = [
        "flex justify-center rounded-lg border border-neutral-300 bg-neutral-800 bg-opacity-50 stroke-neutral-200 p-1",
        hover ? "hover:bg-neutral-600 hover:bg-opacity-50" : "",
        blur ? "backdrop-blur-sm" : "",
        attributes.className ?? "",
    ];
    return (
        <div
            {...attributes}
            className={twMerge(Classes.join(" "))}
        ></div>
    );
}
