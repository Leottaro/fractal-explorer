import { IconType } from "@utils/exports";

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
