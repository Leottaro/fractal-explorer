import { twMerge } from "tailwind-merge";

import { LabelProps } from "@utils/exports";

export default function Label({
    font,
    baseColor,
    bold,
    hover,
    selected,
    selectionable,
    wrapText,
    ...attributes
}: LabelProps) {
    const Classes = [
        "flex items-center justify-center rounded-lg text-2xl",
        font.valueOf(),
        baseColor.valueOf(),
        bold ? "font-bold" : "font-normal",
        hover ? " hover:bg-neutral-400 hover:bg-opacity-15 hover:text-neutral-200 " : "",
        selected ? " bg-neutral-400 bg-opacity-35 text-neutral-200 " : "",
        selectionable ? "select-all" : "select-none",
        wrapText ? "text-wrap" : "text-nowrap",
        attributes.className ?? "",
    ];
    return (
        <label
            {...attributes}
            className={twMerge(Classes.join(" "))}
        />
    );
}
