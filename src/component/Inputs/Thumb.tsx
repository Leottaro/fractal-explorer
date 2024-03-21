import { createRef } from "react";

interface ThumbProps extends React.HTMLAttributes<HTMLDivElement> {
    sliderRef: React.RefObject<HTMLDivElement>;
    offset: number;
    background: string;
    onThumbMouseEnter: (element: HTMLDivElement) => void;
}

export default function Thumb(props: ThumbProps) {
    const thumbRef = createRef<HTMLDivElement>();

    return (
        <div
            ref={thumbRef}
            className="colorGradientThumb"
            style={{ left: `${props.offset * 100}%`, background: props.background }}
            {...props}
            onMouseEnter={() => {
                if (thumbRef.current !== null) {
                    props.onThumbMouseEnter(thumbRef.current);
                }
            }}
        ></div>
    );
}
