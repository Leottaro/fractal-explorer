import { ContainerProps } from "@utils/exports";

export default function Container({ hover, blur, ...attributes }: ContainerProps) {
    return (
        <div
            {...attributes}
            className={
                (attributes.className ?? "") +
                (hover ? " hover:bg-neutral-600 hover:bg-opacity-50 " : "") +
                (blur ? " backdrop-blur-sm " : "") +
                " flex justify-center rounded-lg border border-neutral-300 bg-neutral-800 bg-opacity-50 stroke-neutral-200 p-1 "
            }
        ></div>
    );
}
