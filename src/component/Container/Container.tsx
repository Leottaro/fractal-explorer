export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: Boolean;
    blur?: boolean;
}

export default function Container(props: ContainerProps) {
    return (
        <div
            {...props}
            className={
                (props.className ?? "") +
                (props.hover ? " hover:bg-neutral-600 hover:bg-opacity-50 " : "") +
                (props.blur ? " backdrop-blur-sm " : "") +
                " flex justify-center rounded-lg border border-neutral-300 bg-neutral-800 bg-opacity-50 stroke-neutral-200 p-1 "
            }
        ></div>
    );
}
