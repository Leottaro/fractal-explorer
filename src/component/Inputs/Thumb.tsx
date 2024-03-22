interface ThumbProps extends React.HTMLAttributes<HTMLDivElement> {
    offset: number;
    background: string;
}

export default function Thumb(props: ThumbProps) {
    return (
        <div
            className="colorGradientThumb"
            style={{ left: `${props.offset * 100}%`, background: props.background }}
            {...props}
        ></div>
    );
}
