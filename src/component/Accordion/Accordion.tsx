import { ReactNode, useEffect, useState } from "react";
import Container, { ContainerProps } from "../Container/Container";
import Icon, { IconType } from "../Icon/Icon";

export default function Accordion(props: ContainerProps) {
    const [opened, setOpened] = useState<Boolean>(false);

    return (
        <Container
            {...props}
            className={(props.className ?? "") + " flex flex-col overflow-hidden"}
        >
            <div className="flex flex-row gap-2 items-center h-14 p-1 z-10">
                {(props.children as ReactNode[])[0]}
                <Container
                    hover
                    className="h-full ml-auto"
                >
                    <Icon
                        type={IconType.Arrow}
                        rotate={opened ? "-90" : "90"}
                        onClick={() => setOpened(!opened)}
                    />
                </Container>
            </div>
            {opened ? ( // TODO: better (animation etc)
                <div className="mx-2 transition-all duration-1000 flex flex-col gap-y-1">
                    {(props.children as ReactNode[]).slice(1)}
                </div>
            ) : (
                <></>
            )}
        </Container>
    );
}
