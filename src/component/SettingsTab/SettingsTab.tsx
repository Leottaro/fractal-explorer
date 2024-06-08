import { useContext, useState } from "react";

import {
    AppContext,
    Fractals,
    IconType,
    LabelBaseColors,
    LabelFonts,
    SliderTypes,
} from "@utils/exports";
import Accordion from "@component/Accordion/Accordion";
import Container from "@component/Container/Container";
import Icon from "@component/Icon/Icon";
import ColorSlider from "@component/Inputs/ColorSlider";
import Input from "@component/Inputs/Input";
import Slider from "@component/Inputs/Slider";
import Toggle from "@component/Inputs/Toggle";
import Label from "@component/Label/Label";

export default function SettingsTab() {
    const { shaderSettings, setShaderSettings, appSettings, setAppSettings } =
        useContext(AppContext);
    const [hidden, setHidden] = useState(true);

    return (
        <>
            <Container
                hover
                blur
                onClick={() => setHidden(!hidden)}
                className={
                    "absolute top-1/2 size-14 -translate-y-1/2 transition-[right,margin] duration-1000 " +
                    (hidden ? "right-2" : "mr-128 right-4")
                }
            >
                <Icon
                    type={IconType.Arrow}
                    flipped={hidden ? "x" : undefined}
                />
            </Container>
            <Container
                blur
                className={
                    "w-128 absolute bottom-2 top-2 flex flex-col gap-y-2 p-1.5 transition-[right] duration-1000 " +
                    (hidden ? "-right-128" : "right-2")
                }
            >
                <Container className={`grid h-14 grid-cols-3 grid-rows-1 p-1.5`}>
                    {Object.keys(Fractals)
                        .filter(
                            (Fractal) =>
                                typeof Fractals[Fractal as keyof typeof Fractals] === "number"
                        )
                        .map((Fractal) => (
                            <Label
                                key={Fractal}
                                font={LabelFonts.Poppins}
                                baseColor={LabelBaseColors.Dark}
                                bold
                                hover
                                selected={
                                    shaderSettings.fractal ===
                                    Fractals[Fractal as keyof typeof Fractals]
                                }
                                onClick={() =>
                                    setShaderSettings((prevSettings) => ({
                                        ...prevSettings,
                                        fractal: Fractals[Fractal as keyof typeof Fractals],
                                    }))
                                }
                            >
                                {Fractal}
                            </Label>
                        ))}
                </Container>
                <div className="flex h-full flex-col flex-grow gap-2 overflow-scroll">
                    <Accordion>
                        <Label
                            font={LabelFonts.Poppins}
                            baseColor={LabelBaseColors.Ligth}
                        >
                            Zoom factor:&nbsp;
                            <span className="font-robotomono">
                                {shaderSettings.zoom.toPrecision(16)}
                            </span>
                        </Label>
                        <Slider
                            min={appSettings.zoomMin}
                            max={appSettings.zoomMax}
                            getter={shaderSettings.zoom}
                            setter={(newZoom) =>
                                setShaderSettings((prevSettings) => ({
                                    ...prevSettings,
                                    zoom: newZoom,
                                }))
                            }
                            sliderType={SliderTypes.EXPONENTIAL}
                        />
                    </Accordion>
                    <Accordion>
                        <>
                            <Label
                                font={LabelFonts.Poppins}
                                baseColor={LabelBaseColors.Ligth}
                            >
                                Maximum iterations:&nbsp;
                                {appSettings.maxItersZoomDependant ? (
                                    "  " + shaderSettings.maxIters.toFixed(0)
                                ) : (
                                    <Input
                                        value={Math.round(shaderSettings.maxIters)}
                                        font={LabelFonts.Poppins}
                                        baseColor={LabelBaseColors.Ligth}
                                        onInputChange={(value) =>
                                            setShaderSettings((prevSettings) => ({
                                                ...prevSettings,
                                                maxIters: value,
                                            }))
                                        }
                                    />
                                )}
                            </Label>
                        </>
                        <div className="flex flex-row items-center gap-2">
                            <Label
                                font={LabelFonts.Poppins}
                                baseColor={LabelBaseColors.Ligth}
                            >
                                Automatic
                            </Label>
                            <Toggle
                                checked={appSettings.maxItersZoomDependant}
                                onClick={() =>
                                    setAppSettings((prevSettings) => ({
                                        ...prevSettings,
                                        maxItersZoomDependant: !appSettings.maxItersZoomDependant,
                                    }))
                                }
                            />
                        </div>
                        {appSettings.maxItersZoomDependant ? (
                            <>
                                <Label
                                    font={LabelFonts.Poppins}
                                    baseColor={LabelBaseColors.Ligth}
                                    className="mr-auto"
                                >
                                    Max iterations fractor: {appSettings.maxItersFactor.toFixed(1)}
                                </Label>
                                <Slider
                                    min={appSettings.maxItersFactorMin}
                                    max={appSettings.maxItersFactorMax}
                                    getter={appSettings.maxItersFactor}
                                    setter={(newFactor) =>
                                        setAppSettings((prevSettings) => ({
                                            ...prevSettings,
                                            maxItersFactor: newFactor,
                                        }))
                                    }
                                    sliderType={SliderTypes.LINEAR}
                                />
                            </>
                        ) : (
                            <></>
                        )}
                    </Accordion>
                    <Accordion>
                        <Label
                            font={LabelFonts.Poppins}
                            baseColor={LabelBaseColors.Ligth}
                        >
                            Center ≈&nbsp;
                            <span className="text-xl font-robotomono">
                                {shaderSettings.center.x.toPrecision(8)}
                                {shaderSettings.center.y > 0 ? " + " : " - "}
                                {Math.abs(shaderSettings.center.y).toPrecision(8)}i
                            </span>
                        </Label>
                        <span className="font-robotomono">
                            <div className="flex flex-row gap-2">
                                <Label
                                    font={LabelFonts.Roboto}
                                    baseColor={LabelBaseColors.Ligth}
                                >
                                    x:
                                </Label>
                                <Input
                                    value={shaderSettings.center.x}
                                    font={LabelFonts.Roboto}
                                    baseColor={LabelBaseColors.Ligth}
                                    onInputChange={(value) =>
                                        setShaderSettings((prevSettings) => ({
                                            ...prevSettings,
                                            center: { x: value, y: shaderSettings.center.y },
                                        }))
                                    }
                                />
                            </div>
                            <div className="flex flex-row gap-2">
                                <Label
                                    font={LabelFonts.Roboto}
                                    baseColor={LabelBaseColors.Ligth}
                                >
                                    y:
                                </Label>
                                <Input
                                    value={shaderSettings.center.y}
                                    font={LabelFonts.Roboto}
                                    baseColor={LabelBaseColors.Ligth}
                                    onInputChange={(value) =>
                                        setShaderSettings((prevSettings) => ({
                                            ...prevSettings,
                                            center: { x: shaderSettings.center.x, y: value },
                                        }))
                                    }
                                />
                            </div>
                        </span>
                    </Accordion>
                    <Container className="justify-start p-2">
                        <Label
                            font={LabelFonts.Poppins}
                            baseColor={LabelBaseColors.Ligth}
                        >
                            Mouse:&nbsp;
                        </Label>
                        <Label
                            font={LabelFonts.Roboto}
                            baseColor={LabelBaseColors.Ligth}
                        >
                            {appSettings.mousePoint.x.toFixed(8)}
                            {appSettings.mousePoint.y > 0 ? " + " : " - "}
                            {Math.abs(appSettings.mousePoint.y).toFixed(8)}i
                        </Label>
                    </Container>
                    <Accordion className="overflow-visible">
                        <div className="flex flex-grow flex-row items-center gap-2 pr-2">
                            <Label
                                font={LabelFonts.Poppins}
                                baseColor={LabelBaseColors.Ligth}
                            >
                                Colors:
                            </Label>
                            <ColorSlider />
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <Label
                                font={LabelFonts.Poppins}
                                baseColor={LabelBaseColors.Ligth}
                            >
                                Smooth colors
                            </Label>
                            <Toggle
                                checked={shaderSettings.smoothColors}
                                onClick={() =>
                                    setShaderSettings((prevSettings) => ({
                                        ...prevSettings,
                                        smoothColors: !shaderSettings.smoothColors,
                                    }))
                                }
                            />
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <Label
                                font={LabelFonts.Poppins}
                                baseColor={LabelBaseColors.Ligth}
                            >
                                Colors offset
                            </Label>
                            <Slider
                                min={appSettings.colorOffsetMin}
                                max={appSettings.colorOffsetMax}
                                printedMax="2π"
                                getter={shaderSettings.colorOffset}
                                setter={(newOffset) =>
                                    setShaderSettings((prevSettings) => ({
                                        ...prevSettings,
                                        colorOffset: newOffset,
                                    }))
                                }
                                sliderType={SliderTypes.LINEAR}
                                disabled={appSettings.colorOffsetTimeDependant}
                            />
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <Label
                                font={LabelFonts.Poppins}
                                baseColor={LabelBaseColors.Ligth}
                            >
                                Colors offset time dependant
                            </Label>
                            <Toggle
                                checked={appSettings.colorOffsetTimeDependant}
                                onClick={() =>
                                    setAppSettings((prevSettings) => ({
                                        ...prevSettings,
                                        colorOffsetTimeDependant:
                                            !appSettings.colorOffsetTimeDependant,
                                    }))
                                }
                            />
                        </div>
                    </Accordion>
                    {shaderSettings.fractal === Fractals.Julia ? (
                        <>
                            <Accordion>
                                <Label
                                    font={LabelFonts.Poppins}
                                    baseColor={LabelBaseColors.Ligth}
                                >
                                    Constant ≈&nbsp;
                                    <span className="text-xl font-robotomono">
                                        {shaderSettings.juliaC.x > 0 ? "+" : "-"}
                                        {Math.abs(shaderSettings.juliaC.x).toFixed(7)}
                                        {shaderSettings.juliaC.y > 0 ? " + " : " - "}
                                        {Math.abs(shaderSettings.juliaC.y).toFixed(7)}i
                                    </span>
                                </Label>
                                <span className="font-robotomono">
                                    <div className="flex flex-row gap-2">
                                        <Label
                                            font={LabelFonts.Roboto}
                                            baseColor={LabelBaseColors.Ligth}
                                        >
                                            x:
                                        </Label>
                                        <Input
                                            value={shaderSettings.juliaC.x}
                                            font={LabelFonts.Roboto}
                                            baseColor={LabelBaseColors.Ligth}
                                            onInputChange={(value) =>
                                                setShaderSettings((prevSettings) => ({
                                                    ...prevSettings,
                                                    juliaC: {
                                                        x: value,
                                                        y: shaderSettings.juliaC.y,
                                                    },
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <Label
                                            font={LabelFonts.Roboto}
                                            baseColor={LabelBaseColors.Ligth}
                                        >
                                            y:
                                        </Label>
                                        <Input
                                            value={shaderSettings.juliaC.y}
                                            font={LabelFonts.Roboto}
                                            baseColor={LabelBaseColors.Ligth}
                                            onInputChange={(value) =>
                                                setShaderSettings((prevSettings) => ({
                                                    ...prevSettings,
                                                    juliaC: {
                                                        x: shaderSettings.juliaC.x,
                                                        y: value,
                                                    },
                                                }))
                                            }
                                        />
                                    </div>
                                </span>
                            </Accordion>
                        </>
                    ) : shaderSettings.fractal === Fractals.Mandelbrot ? (
                        <></>
                    ) : shaderSettings.fractal === Fractals.Newton ? (
                        <>
                            <Accordion>
                                <Label
                                    font={LabelFonts.Poppins}
                                    baseColor={LabelBaseColors.Ligth}
                                >
                                    ConstantR ≈&nbsp;
                                    <span className="text-xl font-robotomono">
                                        {shaderSettings.newtonR.x > 0 ? "+" : "-"}
                                        {Math.abs(shaderSettings.newtonR.x).toFixed(7)}
                                        {shaderSettings.newtonR.y > 0 ? " + " : " - "}
                                        {Math.abs(shaderSettings.newtonR.y).toFixed(7)}i
                                    </span>
                                </Label>
                                <div className="flex flex-row gap-2">
                                    <Label
                                        font={LabelFonts.Roboto}
                                        baseColor={LabelBaseColors.Ligth}
                                    >
                                        x:
                                    </Label>
                                    <Input
                                        value={shaderSettings.newtonR.x}
                                        font={LabelFonts.Roboto}
                                        baseColor={LabelBaseColors.Ligth}
                                        onInputChange={(value) =>
                                            setShaderSettings((prevSettings) => ({
                                                ...prevSettings,
                                                newtonR: {
                                                    x: value,
                                                    y: shaderSettings.newtonR.y,
                                                },
                                            }))
                                        }
                                    />
                                </div>
                                <div className="flex flex-row gap-2">
                                    <Label
                                        font={LabelFonts.Roboto}
                                        baseColor={LabelBaseColors.Ligth}
                                    >
                                        y:
                                    </Label>
                                    <Input
                                        value={shaderSettings.newtonR.y}
                                        font={LabelFonts.Roboto}
                                        baseColor={LabelBaseColors.Ligth}
                                        onInputChange={(value) =>
                                            setShaderSettings((prevSettings) => ({
                                                ...prevSettings,
                                                newtonR: {
                                                    x: shaderSettings.newtonR.x,
                                                    y: value,
                                                },
                                            }))
                                        }
                                    />
                                </div>
                                <div className="flex flex-row items-center gap-2">
                                    <Label
                                        font={LabelFonts.Poppins}
                                        baseColor={LabelBaseColors.Ligth}
                                    >
                                        Fixed
                                    </Label>
                                    <Toggle
                                        checked={shaderSettings.newtonCChecked != 1}
                                        onClick={() =>
                                            setShaderSettings((prevSettings) => ({
                                                ...prevSettings,
                                                newtonCChecked:
                                                    shaderSettings.newtonCChecked != 1 ? 1 : 0,
                                            }))
                                        }
                                    />
                                </div>
                            </Accordion>
                            <Accordion>
                                <Label
                                    font={LabelFonts.Poppins}
                                    baseColor={LabelBaseColors.Ligth}
                                >
                                    ConstantG ≈&nbsp;
                                    <span className="text-xl font-robotomono">
                                        {shaderSettings.newtonG.x > 0 ? "+" : "-"}
                                        {Math.abs(shaderSettings.newtonG.x).toFixed(7)}
                                        {shaderSettings.newtonG.y > 0 ? " + " : " - "}
                                        {Math.abs(shaderSettings.newtonG.y).toFixed(7)}i
                                    </span>
                                </Label>
                                <div className="flex flex-row gap-2">
                                    <Label
                                        font={LabelFonts.Roboto}
                                        baseColor={LabelBaseColors.Ligth}
                                    >
                                        x:
                                    </Label>
                                    <Input
                                        value={shaderSettings.newtonG.x}
                                        font={LabelFonts.Roboto}
                                        baseColor={LabelBaseColors.Ligth}
                                        onInputChange={(value) =>
                                            setShaderSettings((prevSettings) => ({
                                                ...prevSettings,
                                                newtonG: {
                                                    x: value,
                                                    y: shaderSettings.newtonG.y,
                                                },
                                            }))
                                        }
                                    />
                                </div>
                                <div className="flex flex-row gap-2">
                                    <Label
                                        font={LabelFonts.Roboto}
                                        baseColor={LabelBaseColors.Ligth}
                                    >
                                        y:
                                    </Label>
                                    <Input
                                        value={shaderSettings.newtonG.y}
                                        font={LabelFonts.Roboto}
                                        baseColor={LabelBaseColors.Ligth}
                                        onInputChange={(value) =>
                                            setShaderSettings((prevSettings) => ({
                                                ...prevSettings,
                                                newtonG: {
                                                    x: shaderSettings.newtonG.x,
                                                    y: value,
                                                },
                                            }))
                                        }
                                    />
                                </div>
                                <div className="flex flex-row items-center gap-2">
                                    <Label
                                        font={LabelFonts.Poppins}
                                        baseColor={LabelBaseColors.Ligth}
                                    >
                                        Fixed
                                    </Label>
                                    <Toggle
                                        checked={shaderSettings.newtonCChecked != 2}
                                        onClick={() =>
                                            setShaderSettings((prevSettings) => ({
                                                ...prevSettings,
                                                newtonCChecked:
                                                    shaderSettings.newtonCChecked != 2 ? 2 : 0,
                                            }))
                                        }
                                    />
                                </div>
                            </Accordion>
                            <Accordion>
                                <Label
                                    font={LabelFonts.Poppins}
                                    baseColor={LabelBaseColors.Ligth}
                                >
                                    ConstantB ≈&nbsp;
                                    <span className="text-xl font-robotomono">
                                        {shaderSettings.newtonB.x > 0 ? "+" : "-"}
                                        {Math.abs(shaderSettings.newtonB.x).toFixed(7)}
                                        {shaderSettings.newtonB.y > 0 ? " + " : " - "}
                                        {Math.abs(shaderSettings.newtonB.y).toFixed(7)}i
                                    </span>
                                </Label>
                                <div className="flex flex-row gap-2">
                                    <Label
                                        font={LabelFonts.Roboto}
                                        baseColor={LabelBaseColors.Ligth}
                                    >
                                        x:
                                    </Label>
                                    <Input
                                        value={shaderSettings.newtonB.x}
                                        font={LabelFonts.Roboto}
                                        baseColor={LabelBaseColors.Ligth}
                                        onInputChange={(value) =>
                                            setShaderSettings((prevSettings) => ({
                                                ...prevSettings,
                                                newtonB: {
                                                    x: value,
                                                    y: shaderSettings.newtonB.y,
                                                },
                                            }))
                                        }
                                    />
                                </div>
                                <div className="flex flex-row gap-2">
                                    <Label
                                        font={LabelFonts.Roboto}
                                        baseColor={LabelBaseColors.Ligth}
                                    >
                                        y:
                                    </Label>
                                    <Input
                                        value={shaderSettings.newtonB.y}
                                        font={LabelFonts.Roboto}
                                        baseColor={LabelBaseColors.Ligth}
                                        onInputChange={(value) =>
                                            setShaderSettings((prevSettings) => ({
                                                ...prevSettings,
                                                newtonB: {
                                                    x: shaderSettings.newtonB.x,
                                                    y: value,
                                                },
                                            }))
                                        }
                                    />
                                </div>
                                <div className="flex flex-row items-center gap-2">
                                    <Label
                                        font={LabelFonts.Poppins}
                                        baseColor={LabelBaseColors.Ligth}
                                    >
                                        Fixed
                                    </Label>
                                    <Toggle
                                        checked={shaderSettings.newtonCChecked != 3}
                                        onClick={() =>
                                            setShaderSettings((prevSettings) => ({
                                                ...prevSettings,
                                                newtonCChecked:
                                                    shaderSettings.newtonCChecked != 3 ? 3 : 0,
                                            }))
                                        }
                                    />
                                </div>
                            </Accordion>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
                <Container className="flex h-14 flex-row gap-x-2 border-neutral-400">
                    <Container
                        hover
                        onClick={() =>
                            setAppSettings((prevSettings) => ({
                                ...prevSettings,
                                timeFactor: 1,
                                time: 0,
                                playTime: false,
                            }))
                        }
                    >
                        <Icon type={IconType.Reset} />
                    </Container>
                    <Container
                        hover
                        onClick={() =>
                            setAppSettings((prevSettings) => ({
                                ...prevSettings,
                                timeFactor:
                                    prevSettings.timeFactor == 1 ? -1 : prevSettings.timeFactor - 1,
                            }))
                        }
                    >
                        <Icon
                            type={IconType.DoubleArrow}
                            flipped="x"
                        />
                    </Container>
                    <Container
                        hover
                        onClick={() =>
                            setAppSettings((prevSettings) => ({
                                ...prevSettings,
                                playTime: false,
                                time: (prevSettings.time + 999.9) % 1000,
                            }))
                        }
                    >
                        <Icon
                            type={IconType.Arrow}
                            flipped="x"
                        />
                    </Container>
                    <Container className="relative flex-grow">
                        <Label
                            font={LabelFonts.Roboto}
                            baseColor={LabelBaseColors.Ligth}
                            className="absolute top-0.5 left-1 text-xs"
                        >
                            {appSettings.timeFactor}x
                        </Label>
                        <Label
                            font={LabelFonts.Roboto}
                            baseColor={LabelBaseColors.Ligth}
                            bold
                        >
                            {appSettings.time.toFixed(3)}
                        </Label>
                    </Container>
                    <Container
                        hover
                        onClick={() =>
                            setAppSettings((prevSettings) => ({
                                ...prevSettings,
                                playTime: false,
                                time: (prevSettings.time + 0.1) % 1000,
                            }))
                        }
                    >
                        <Icon type={IconType.Arrow} />
                    </Container>
                    <Container
                        hover
                        onClick={() =>
                            setAppSettings((prevSettings) => ({
                                ...prevSettings,
                                timeFactor:
                                    prevSettings.timeFactor == -1 ? 1 : prevSettings.timeFactor + 1,
                            }))
                        }
                    >
                        <Icon type={IconType.DoubleArrow} />
                    </Container>
                    <Container
                        hover
                        onClick={() =>
                            setAppSettings((prevSettings) => ({
                                ...prevSettings,
                                playTime: !appSettings.playTime,
                            }))
                        }
                    >
                        <Icon
                            type={appSettings.playTime ? IconType.Pause : IconType.Play}
                            pathProps={{
                                className: appSettings.playTime ? "" : "fill-neutral-200",
                            }}
                        />
                    </Container>
                </Container>
            </Container>
        </>
    );
}
