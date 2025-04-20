import { useEffect, useRef, useState } from 'react';
import { flattenAndCalculatePositions, calculateTotalDepth } from '../utils/positioningEngine';
import { CanvasItem } from '../components/Canvas';
import { StoryType } from '../components/Story';
import { CanvasHandle } from '../components/Canvas';

export const useCanvasPositioning = (elements: StoryType[]) => {
    const canvasRef = useRef<CanvasHandle>(null);
    const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);

    // This function calculates the positions of the elements
    const calculateAndSetPositions = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const center = canvas.getViewportCenter();
        const totalDepth = calculateTotalDepth(elements);
        const items = flattenAndCalculatePositions(
            elements,
            center.x,
            center.y,
            100, // horizontal spacing
            100, // vertical spacing
            0,
            0,
            totalDepth
        );

        setCanvasItems(items);
    };

    // Initial positioning when elements are loaded
    useEffect(() => {
        calculateAndSetPositions();
    }, [elements]);

    // Recalculate when window resizes
    useEffect(() => {
        const handleResize = () => {
            calculateAndSetPositions();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [elements]);

    return { canvasRef, canvasItems };
};