export enum IconType {
    Arrow = "M13.333 33.833 26.666 20.5 13.333 7.167",
    DoubleArrow = "M18.333 33.833 31.667 20.5 18.332 7.167m-10 26.666L21.666 20.5 8.333 7.167",
    Play = "M13.334 30.5v-20l13.333 10-13.334 10Z",
    Pause = "M26.667 10.5v20m-13.334-20v20",
    Reset = "M30 7.167v26.666M23.333 7.167 10 20.5l13.333 13.333",
}

interface IconProps extends React.HTMLAttributes<SVGElement> {
    pathProps?: React.HTMLAttributes<SVGPathElement>;
    type: IconType;
    flipped?: "x" | "y";
}

export default function Icon({ flipped, type, pathProps, ...attributes }: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 40 40"
            fill="none"
            className="aspect-square h-full"
            {...attributes}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={4}
                d={type.valueOf()} // keyof typeof Enum
                {...pathProps}
                className={
                    (pathProps?.className ?? "") +
                    " origin-center duration-1000 " +
                    (flipped === "x" ? "-scale-x-100 " : flipped === "y" ? "-scale-y-100 " : "")
                }
            />
        </svg>
    );
}
