export interface ToggleProps {
    checked: boolean;
    onClick: () => void;
}

export default function Toggle(props: ToggleProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 45 45"
            fill="none"
            className="settingCheckbox"
            onClick={() => props.onClick()}
        >
            <path
                d="M37 1.5c1.512 0 3.15.771 4.44 2.06C42.728 4.85 43.5 6.489 43.5 8v29c0 1.512-.771 3.15-2.06 4.44-1.29 1.289-2.928 2.06-4.44 2.06H8c-1.512 0-3.15-.771-4.44-2.06C2.272 40.15 1.5 38.511 1.5 37V8c0-1.512.771-3.15 2.06-4.44C4.85 2.272 6.489 1.5 8 1.5h29Z"
                strokeWidth="3"
                className="box"
            />
            {props.checked ? (
                <path
                    d="M9 23.326 18.58 32 36 13"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="check"
                />
            ) : (
                <></>
            )}
        </svg>
    );
}
