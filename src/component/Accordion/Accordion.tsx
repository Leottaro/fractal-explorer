import { createRef, ReactNode, useEffect, useState } from "react";
import Container, { ContainerProps } from "../Container/Container";
import Icon, { IconType } from "../Icon/Icon";

export default function Accordion({ hover, blur, ...attributes }: ContainerProps) {
    const [opened, setOpened] = useState<Boolean>(false);
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
            className={(attributes.className ?? "") + " flex flex-col overflow-hidden"}
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
