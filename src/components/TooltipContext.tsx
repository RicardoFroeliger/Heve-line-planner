import React, { createContext, useContext, useState } from "react";

type TooltipContextType = {
    activeTooltipId: string | null;
    setActiveTooltipId: (id: string | null) => void;
};

const TooltipContext = createContext<TooltipContextType | null>(null);

export const useTooltipContext = () => {
    const context = useContext(TooltipContext);
    if (!context) {
        throw new Error("useTooltipContext must be used within a TooltipProviderWrapper");
    }
    return context;
};

export const TooltipProviderWrapper = ({ children }: { children: React.ReactNode }) => {
    const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

    return (
        <TooltipContext.Provider value={{ activeTooltipId, setActiveTooltipId }}>
            {children}
        </TooltipContext.Provider>
    );
};
