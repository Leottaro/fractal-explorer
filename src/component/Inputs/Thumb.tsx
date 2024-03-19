import { createRef } from "react";

interface ThumbProps {
    sliderRef: React.RefObject<HTMLDivElement>;
    offset: number;
    onThumbMouseDown: (thumbRef: React.RefObject<HTMLDivElement>) => void;
    onThumbMouseUp: () => void;
}

export default function Thumb(props: ThumbProps) {
    const thumbRef = createRef<HTMLDivElement>();

    return (
        <div
            ref={thumbRef}
            style={{
                height: "100%",
                aspectRatio: 1,

                position: "absolute",
                top: 0,
                left: `${props.offset * 100}%`,
                transform: "translate(-50%, 0%)",

                borderRadius: "100%",
                background: "white",
                border: "2px solid black",

                opacity: 1 / 2,
            }}
            draggable={false}
            onMouseDown={() => {
                if (thumbRef.current !== null) {
                    thumbRef.current.style.zIndex = "1";
                }
                props.onThumbMouseDown(thumbRef);
            }}
        ></div>
    );
}
