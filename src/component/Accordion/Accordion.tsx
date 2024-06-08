import { createRef, ReactNode, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import { ContainerProps, IconType } from "@utils/exports";
import Container from "@component/Container/Container";
import Icon from "@component/Icon/Icon";

export default function Accordion({ hover, blur, ...attributes }: ContainerProps) {
    const [opened, setOpened] = useState<boolean>(false);
    const [contentHeight, setContentHeight] = useState<number>(0);
    const contentRef = createRef<HTMLDivElement>();

    useEffect(() => {
        setContentHeight(contentRef.current ? contentRef.current.scrollHeight : -1);
    }, [contentRef.current]);

    return (
        <Container
            hover={hover}
            blur={blur}
            {...attributes}
            className={twMerge("flex flex-col overflow-visible " + (attributes.className ?? ""))}
        >
            <div className="z-10 flex h-14 flex-row items-center gap-2 p-1">
                {(attributes.children as ReactNode[])[0]}
                <Container
                    hover
                    className="ml-auto h-full"
                >
                    <Icon
                        type={IconType.Arrow}
                        onClick={() => setOpened(!opened)}
                        pathProps={{ className: opened ? "-rotate-90" : "rotate-90" }}
                    />
                </Container>
            </div>
            <div
                ref={contentRef}
                className="mx-2 flex flex-col overflow-hidden gap-y-1 transition-all duration-1000"
                style={{
                    maxHeight: opened ? contentHeight : 0,
                }}
            >
                {(attributes.children as ReactNode[]).slice(1)}
            </div>
        </Container>
    );
}
