export interface ToggleProps {
    checked: boolean;
    onClick: () => void;
}

export default function Toggle(props: ToggleProps) {
    return (
        <div
            onClick={props.onClick}
            className={
                "aspect-[1.9] h-6 overflow-hidden rounded-full p-0.5 transition-colors duration-500 disabled:brightness-75 " +
                (props.checked ? "bg-neutral-400" : "bg-neutral-600")
            }
        >
            <div
                className={
                    "relative aspect-square h-full rounded-full bg-neutral-200 transition-all duration-500 " +
                    (props.checked ? "left-full -translate-x-full" : "left-0")
                }
            />
        </div>
    );
}
