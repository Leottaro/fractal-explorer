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
    const { settings, setSettings } = useContext(AppContext);
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
                                    settings.uFractal === Fractals[Fractal as keyof typeof Fractals]
                                }
                                onClick={() =>
                                    setSettings((prevSettings) => ({
                                        ...prevSettings,
                                        uFractal: Fractals[Fractal as keyof typeof Fractals],
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
                                {settings.uZoom.toPrecision(16)}
                            </span>
                        </Label>
                        <Slider
                            min={settings.sZoomMin}
                            max={settings.sZoomMax}
                            getter={settings.uZoom}
                            setter={(newZoom) =>
                                setSettings((prevSettings) => ({
                                    ...prevSettings,
                                    uZoom: newZoom,
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
                                {settings.sMaxItersZoomDependant ? (
                                    "  " + settings.uMaxIters.toFixed(0)
                                ) : (
                                    <Input
                                        value={Math.round(settings.uMaxIters)}
                                        font={LabelFonts.Poppins}
                                        baseColor={LabelBaseColors.Ligth}
                                        onInputChange={(value) =>
                                            setSettings((prevSettings) => ({
                                                ...prevSettings,
                                                uMaxIters: value,
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
                                checked={settings.sMaxItersZoomDependant}
                                onClick={() =>
                                    setSettings((prevSettings) => ({
                                        ...prevSettings,
                                        sMaxItersZoomDependant: !settings.sMaxItersZoomDependant,
                                    }))
                                }
                            />
                        </div>
                        {settings.sMaxItersZoomDependant ? (
                            <>
                                <Label
                                    font={LabelFonts.Poppins}
                                    baseColor={LabelBaseColors.Ligth}
                                    className="mr-auto"
                                >
                                    Max iterations fractor: {settings.sMaxItersFactor.toFixed(1)}
                                </Label>
                                <Slider
                                    min={settings.sMaxItersFactorMin}
                                    max={settings.sMaxItersFactorMax}
                                    getter={settings.sMaxItersFactor}
                                    setter={(newFactor) =>
                                        setSettings((prevSettings) => ({
                                            ...prevSettings,
                                            sMaxItersFactor: newFactor,
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
                                {settings.uCenter.x.toPrecision(8)}
                                {settings.uCenter.y > 0 ? " + " : " - "}
                                {Math.abs(settings.uCenter.y).toPrecision(8)}i
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
                                    value={settings.uCenter.x}
                                    font={LabelFonts.Roboto}
                                    baseColor={LabelBaseColors.Ligth}
                                    onInputChange={(value) =>
                                        setSettings((prevSettings) => ({
                                            ...prevSettings,
                                            uCenter: { x: value, y: settings.uCenter.y },
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
                                    value={settings.uCenter.y}
                                    font={LabelFonts.Roboto}
                                    baseColor={LabelBaseColors.Ligth}
                                    onInputChange={(value) =>
                                        setSettings((prevSettings) => ({
                                            ...prevSettings,
                                            uCenter: { x: settings.uCenter.x, y: value },
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
                            {settings.uMouse.x.toFixed(8)}
                            {settings.uMouse.y > 0 ? " + " : " - "}
                            {Math.abs(settings.uMouse.y).toFixed(8)}i
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
                                checked={settings.uSmoothColors}
                                onClick={() =>
                                    setSettings((prevSettings) => ({
                                        ...prevSettings,
                                        uSmoothColors: !settings.uSmoothColors,
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
                                min={settings.sColorOffsetMin}
                                max={settings.sColorOffsetMax}
                                printedMax="2π"
                                getter={settings.uColorOffset}
                                setter={(newOffset) =>
                                    setSettings((prevSettings) => ({
                                        ...prevSettings,
                                        uColorOffset: newOffset,
                                    }))
                                }
                                sliderType={SliderTypes.LINEAR}
                                disabled={settings.sColorOffsetTimeDependant}
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
                                checked={settings.sColorOffsetTimeDependant}
                                onClick={() =>
                                    setSettings((prevSettings) => ({
                                        ...prevSettings,
                                        sColorOffsetTimeDependant:
                                            !settings.sColorOffsetTimeDependant,
                                    }))
                                }
                            />
                        </div>
                    </Accordion>
                    {settings.uFractal === Fractals.Julia ? (
                        <>
                            <Accordion>
                                <Label
                                    font={LabelFonts.Poppins}
                                    baseColor={LabelBaseColors.Ligth}
                                >
                                    Constant ≈&nbsp;
                                    <span className="text-xl font-robotomono">
                                        {settings.uJuliaC.x > 0 ? "+" : "-"}
                                        {Math.abs(settings.uJuliaC.x).toFixed(7)}
                                        {settings.uJuliaC.y > 0 ? " + " : " - "}
                                        {Math.abs(settings.uJuliaC.y).toFixed(7)}i
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
                                            value={settings.uJuliaC.x}
                                            font={LabelFonts.Roboto}
                                            baseColor={LabelBaseColors.Ligth}
                                            onInputChange={(value) =>
                                                setSettings((prevSettings) => ({
                                                    ...prevSettings,
                                                    uJuliaC: { x: value, y: settings.uJuliaC.y },
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
                                            value={settings.uJuliaC.y}
                                            font={LabelFonts.Roboto}
                                            baseColor={LabelBaseColors.Ligth}
                                            onInputChange={(value) =>
                                                setSettings((prevSettings) => ({
                                                    ...prevSettings,
                                                    uJuliaC: { x: settings.uJuliaC.x, y: value },
                                                }))
                                            }
                                        />
                                    </div>
                                </span>
                            </Accordion>
                        </>
                    ) : settings.uFractal === Fractals.Mandelbrot ? (
                        <></>
                    ) : settings.uFractal === Fractals.Newton ? (
                        <>
                            <Accordion>
                                <Label
                                    font={LabelFonts.Poppins}
                                    baseColor={LabelBaseColors.Ligth}
                                >
                                    ConstantR ≈&nbsp;
                                    <span className="text-xl font-robotomono">
                                        {settings.uNewtonR.x > 0 ? "+" : "-"}
                                        {Math.abs(settings.uNewtonR.x).toFixed(7)}
                                        {settings.uNewtonR.y > 0 ? " + " : " - "}
                                        {Math.abs(settings.uNewtonR.y).toFixed(7)}i
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
                                        value={settings.uNewtonR.x}
                                        font={LabelFonts.Roboto}
                                        baseColor={LabelBaseColors.Ligth}
                                        onInputChange={(value) =>
                                            setSettings((prevSettings) => ({
                                                ...prevSettings,
                                                uNewtonR: {
                                                    x: value,
                                                    y: settings.uNewtonR.y,
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
                                        value={settings.uNewtonR.y}
                                        font={LabelFonts.Roboto}
                                        baseColor={LabelBaseColors.Ligth}
                                        onInputChange={(value) =>
                                            setSettings((prevSettings) => ({
                                                ...prevSettings,
                                                uNewtonR: {
                                                    x: settings.uNewtonR.x,
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
                                        checked={settings.uNewtonCChecked != 1}
                                        onClick={() =>
                                            setSettings((prevSettings) => ({
                                                ...prevSettings,
                                                uNewtonCChecked:
                                                    settings.uNewtonCChecked != 1 ? 1 : 0,
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
                                        {settings.uNewtonG.x > 0 ? "+" : "-"}
                                        {Math.abs(settings.uNewtonG.x).toFixed(7)}
                                        {settings.uNewtonG.y > 0 ? " + " : " - "}
                                        {Math.abs(settings.uNewtonG.y).toFixed(7)}i
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
                                        value={settings.uNewtonG.x}
                                        font={LabelFonts.Roboto}
                                        baseColor={LabelBaseColors.Ligth}
                                        onInputChange={(value) =>
                                            setSettings((prevSettings) => ({
                                                ...prevSettings,
                                                uNewtonG: {
                                                    x: value,
                                                    y: settings.uNewtonG.y,
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
                                        value={settings.uNewtonG.y}
                                        font={LabelFonts.Roboto}
                                        baseColor={LabelBaseColors.Ligth}
                                        onInputChange={(value) =>
                                            setSettings((prevSettings) => ({
                                                ...prevSettings,
                                                uNewtonG: {
                                                    x: settings.uNewtonG.x,
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
                                        checked={settings.uNewtonCChecked != 2}
                                        onClick={() =>
                                            setSettings((prevSettings) => ({
                                                ...prevSettings,
                                                uNewtonCChecked:
                                                    settings.uNewtonCChecked != 2 ? 2 : 0,
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
                                        {settings.uNewtonB.x > 0 ? "+" : "-"}
                                        {Math.abs(settings.uNewtonB.x).toFixed(7)}
                                        {settings.uNewtonB.y > 0 ? " + " : " - "}
                                        {Math.abs(settings.uNewtonB.y).toFixed(7)}i
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
                                        value={settings.uNewtonB.x}
                                        font={LabelFonts.Roboto}
                                        baseColor={LabelBaseColors.Ligth}
                                        onInputChange={(value) =>
                                            setSettings((prevSettings) => ({
                                                ...prevSettings,
                                                uNewtonB: {
                                                    x: value,
                                                    y: settings.uNewtonB.y,
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
                                        value={settings.uNewtonB.y}
                                        font={LabelFonts.Roboto}
                                        baseColor={LabelBaseColors.Ligth}
                                        onInputChange={(value) =>
                                            setSettings((prevSettings) => ({
                                                ...prevSettings,
                                                uNewtonB: {
                                                    x: settings.uNewtonB.x,
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
                                        checked={settings.uNewtonCChecked != 3}
                                        onClick={() =>
                                            setSettings((prevSettings) => ({
                                                ...prevSettings,
                                                uNewtonCChecked:
                                                    settings.uNewtonCChecked != 3 ? 3 : 0,
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
                            setSettings((prevSettings) => ({
                                ...prevSettings,
                                sTimeFactor: 1,
                                uTime: 0,
                                sPlayTime: false,
                            }))
                        }
                    >
                        <Icon type={IconType.Reset} />
                    </Container>
                    <Container
                        hover
                        onClick={() =>
                            setSettings((prevSettings) => ({
                                ...prevSettings,
                                sTimeFactor:
                                    prevSettings.sTimeFactor == 1
                                        ? -1
                                        : prevSettings.sTimeFactor - 1,
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
                            setSettings((prevSettings) => ({
                                ...prevSettings,
                                sPlayTime: false,
                                uTime: (prevSettings.uTime + 999.9) % 1000,
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
                            {settings.sTimeFactor}x
                        </Label>
                        <Label
                            font={LabelFonts.Roboto}
                            baseColor={LabelBaseColors.Ligth}
                            bold
                        >
                            {settings.uTime.toFixed(3)}
                        </Label>
                    </Container>
                    <Container
                        hover
                        onClick={() =>
                            setSettings((prevSettings) => ({
                                ...prevSettings,
                                sPlayTime: false,
                                uTime: (prevSettings.uTime + 0.1) % 1000,
                            }))
                        }
                    >
                        <Icon type={IconType.Arrow} />
                    </Container>
                    <Container
                        hover
                        onClick={() =>
                            setSettings((prevSettings) => ({
                                ...prevSettings,
                                sTimeFactor:
                                    prevSettings.sTimeFactor == -1
                                        ? 1
                                        : prevSettings.sTimeFactor + 1,
                            }))
                        }
                    >
                        <Icon type={IconType.DoubleArrow} />
                    </Container>
                    <Container
                        hover
                        onClick={() =>
                            setSettings((prevSettings) => ({
                                ...prevSettings,
                                sPlayTime: !settings.sPlayTime,
                            }))
                        }
                    >
                        <Icon
                            type={settings.sPlayTime ? IconType.Pause : IconType.Play}
                            pathProps={{ className: settings.sPlayTime ? "" : "fill-neutral-200" }}
                        />
                    </Container>
                </Container>
            </Container>
        </>
    );
}
