export enum LabelFonts {
    Poppins = "font-poppins",
    Roboto = "font-robotomono",
}

export enum LabelBaseColors {
    Ligth = "text-neutral-200",
    Dark = "text-neutral-400",
}

interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {
    font: LabelFonts;
    baseColor: LabelBaseColors;
    bold?: boolean;
    hover?: boolean;
    seleted?: boolean;
}

export default function Label(props: LabelProps) {
    return (
        <label
            {...props}
            className={
                (props.bold ? " font-bold " : " ") +
                props.font.valueOf() +
                " flex items-center justify-center rounded-lg text-2xl " +
                (props.seleted
                    ? " bg-neutral-400 bg-opacity-35 text-neutral-200 "
                    : props.baseColor.valueOf() +
                      (props.hover
                          ? " hover:bg-neutral-400 hover:bg-opacity-15 hover:text-neutral-200 "
                          : " ")) +
                (props.className ?? "")
            }
        />
    );
}
