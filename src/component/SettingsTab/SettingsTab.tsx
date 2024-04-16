import { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import Slider, { SliderTypes } from "../Inputs/Slider";
import Toggle from "../Inputs/Toggle";
import ColorSlider from "../Inputs/ColorSlider";
import Container from "../Container/Container";
import Icon, { IconType } from "../Icon/Icon";
import Label, { LabelBaseColors, LabelFonts } from "../Label/Label";
import Accordion from "../Accordion/Accordion";

function SettingsTab() {
    const { settings, setSettings } = useContext(AppContext);
    const [hidden, setHidden] = useState(true);
    const [isPause, setPause] = useState(false);

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
                <Container className="grid h-14 grid-cols-3 grid-rows-1 p-1.5">
                    <Label
                        font={LabelFonts.Poppins}
                        baseColor={LabelBaseColors.Dark}
                        bold
                    >
                        Julia
                    </Label>
                    <Label
                        font={LabelFonts.Poppins}
                        baseColor={LabelBaseColors.Dark}
                        bold
                        selected
                    >
                        Mandelbrot
                    </Label>
                    <Label
                        font={LabelFonts.Poppins}
                        baseColor={LabelBaseColors.Dark}
                        bold
                    >
                        Newton
                    </Label>
                </Container>
                <div className="Settings flex h-auto flex-grow flex-col gap-2">
                    <Accordion>
                        <Label
                            font={LabelFonts.Poppins}
                            baseColor={LabelBaseColors.Ligth}
                        >
                            Zoom factor: {settings.uZoom.toFixed(10)}
                        </Label>
                        <Slider
                            min={settings.sZoomMin}
                            max={settings.sZoomMax}
                            getter={settings.uZoom}
                            setter={(newZoom) => setSettings({ ...settings, uZoom: newZoom })}
                            sliderType={SliderTypes.EXPONENTIAL}
                        />
                    </Accordion>
                    <Accordion>
                        <Label
                            font={LabelFonts.Poppins}
                            baseColor={LabelBaseColors.Ligth}
                        >
                            Maximum iterations: {settings.uMaxIters.toFixed(0)}
                        </Label>
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
                                    setSettings({
                                        ...settings,
                                        sMaxItersZoomDependant: !settings.sMaxItersZoomDependant,
                                    })
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
                                        setSettings({ ...settings, sMaxItersFactor: newFactor })
                                    }
                                    sliderType={SliderTypes.LINEAR}
                                />
                            </>
                        ) : (
                            <></>
                        )}
                    </Accordion>
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
                                    setSettings({
                                        ...settings,
                                        uSmoothColors: !settings.uSmoothColors,
                                    })
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
                                    setSettings({ ...settings, uColorOffset: newOffset })
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
                                    setSettings({
                                        ...settings,
                                        sColorOffsetTimeDependant:
                                            !settings.sColorOffsetTimeDependant,
                                    })
                                }
                            />
                        </div>
                    </Accordion>
                </div>
                <Container className="flex h-14 flex-row gap-x-2 border-neutral-400">
                    <Container>
                        <Icon type={IconType.Reset} />
                    </Container>
                    <Container>
                        <Icon
                            type={IconType.DoubleArrow}
                            flipped="x"
                        />
                    </Container>
                    <Container>
                        <Icon
                            type={IconType.Arrow}
                            flipped="x"
                        />
                    </Container>
                    <Container className="flex-grow">
                        <Label
                            font={LabelFonts.Roboto}
                            baseColor={LabelBaseColors.Ligth}
                            bold
                        >
                            {settings.uTime.toFixed(3)}
                        </Label>
                    </Container>
                    <Container>
                        <Icon type={IconType.Arrow} />
                    </Container>
                    <Container>
                        <Icon type={IconType.DoubleArrow} />
                    </Container>
                    <Container>
                        <Icon
                            type={isPause ? IconType.Pause : IconType.Play}
                            onClick={() => setPause(!isPause)}
                            pathProps={{ className: isPause ? "" : "fill-neutral-200" }}
                        />
                    </Container>
                </Container>
            </Container>
        </>
    );
}
export default SettingsTab;
