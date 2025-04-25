import React, { useEffect, useState } from "react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/Tooltip";
import { useTooltipContext } from "./TooltipContext";

export function TogglableTooltip({
    tooltipTriggerText,
    children,
}: {
    tooltipTriggerText: string
    children: React.ReactNode
}) {
    const id = React.useId();
    const { activeTooltipId, setActiveTooltipId } = useTooltipContext();
    const isActive = activeTooltipId === id;

    const [toggledOpen, setToggleOpen] = useState(false);
    const [hoverOpen, setHoverOpen] = useState(false);

    // Close old toggled tooltips when hovered over another one
    useEffect(() => {
        if (!isActive && (toggledOpen || hoverOpen)) {
            setToggleOpen(false);
            setHoverOpen(false);
        }
    }, [isActive]);

    const handleOpenToggle = () => {
        // Update active & toggledOpen
        setActiveTooltipId(!toggledOpen ? id : null);
        setToggleOpen(!toggledOpen);
    }

    const handleOpenHover = (isHovered: boolean) => {
        // Only update hover state if not toggled
        if (!toggledOpen) {

            // Update active & hoverOpen
            setHoverOpen(isHovered);
            setActiveTooltipId(isHovered ? id : null);
        }
    }

    return (
        <TooltipProvider>
            <Tooltip open={toggledOpen || hoverOpen}>
                <TooltipTrigger
                    className="rounded-xl p-2 bg-blue-600 flex justify-center items-center cursor-pointer text-2xl"
                    onPointerEnter={() => handleOpenHover(true)}
                    onPointerLeave={() => handleOpenHover(false)}
                    onClick={handleOpenToggle}
                >
                    {toggledOpen ? 'toggle' : '!toggle'}
                    {hoverOpen ? 'hover' : '!hover'}
                    {/* {tooltipTriggerText} */}
                </TooltipTrigger>
                <TooltipContent className="flex flex-col justify-center">
                    {children}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}