export interface ToggleProps {
    checked: boolean;
    onClick: () => void;
}

export default function Toggle(props: ToggleProps) {
    return (
        <div
            onClick={props.onClick}
            className={
                "transition-colors duration-500 h-6 aspect-[1.9] p-0.5 rounded-full overflow-hidden disabled:brightness-75 " +
                (props.checked ? "bg-neutral-400" : "bg-neutral-600")
            }
        >
            <div
                className={
                    "transition-all duration-500 relative h-full aspect-square bg-neutral-200 rounded-full " +
                    (props.checked ? "left-full -translate-x-full" : "left-0")
                }
            />
        </div>
    );
}
