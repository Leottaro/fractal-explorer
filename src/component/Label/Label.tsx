import { HTMLAttributes } from "react";

export enum LabelFonts {
    Poppins = "font-poppins",
    Roboto = "font-robotomono",
}

export enum LabelBaseColors {
    Ligth = "text-neutral-200",
    Dark = "text-neutral-400",
}

interface LabelProps extends HTMLAttributes<HTMLLabelElement> {
    font: LabelFonts;
    baseColor: LabelBaseColors;
    bold?: boolean;
    hover?: boolean;
    selected?: boolean;
    selectionable?: boolean;
}

export default function Label({
    font,
    baseColor,
    bold,
    hover,
    selected,
    selectionable,
    ...attributes
}: LabelProps) {
    return (
        <label
            {...attributes}
            className={
                (bold ? " font-bold " : " font-normal ") +
                (selectionable ? " select-all " : " select-none ") +
                font.valueOf() +
                " flex items-center justify-center rounded-lg text-2xl " +
                (selected
                    ? " bg-neutral-400 bg-opacity-35 text-neutral-200 "
                    : baseColor.valueOf() +
                      (hover
                          ? " hover:bg-neutral-400 hover:bg-opacity-15 hover:text-neutral-200 "
                          : " ")) +
                (attributes.className ?? "")
            }
        />
    );
}
