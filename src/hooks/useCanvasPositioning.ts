import { useEffect, useRef, useState } from 'react';
import { flattenAndCalculatePositions, calculateTotalDepth } from '../utils/positioningEngine';
import { CanvasItem } from '../components/Canvas';
import { StoryType } from '../components/Story';
import { CanvasHandle } from '../components/Canvas';

const minPaddingX = 50;
const minPaddingY = 50;

export const useCanvasPositioning = (elements: StoryType[]) => {
    const canvasRef = useRef<CanvasHandle>(null);
    const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);

    const getTextSize = (text: string): { width: number, height: number } => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return { width: 0, height: 0 }; // Fallback size

        context.font = '24px Arial'; // Match your real font
        const metrics = context.measureText(text);
        const height = 32; // Approximate line height
        return { width: metrics.width, height };
    };

    const getDynamicSpacing = (elements: StoryType[], getTextSize: (text: string) => { width: number, height: number }) => {
        let maxWidth = 0;
        let maxHeight = 0;

        const traverse = (elements: StoryType[]) => {
            for (const el of elements) {
                const { width, height } = getTextSize(el.title);
                maxWidth = Math.max(maxWidth, width);
                maxHeight = Math.max(maxHeight, height);
                if (el.stories) traverse(el.stories);
            }
        };

        traverse(elements);

        return {
            horizontal: maxWidth + minPaddingX,
            vertical: maxHeight + minPaddingY,
        };
    }

    const calculateAndSetPositions = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const center = canvas.getViewportCenter();
        const totalDepth = calculateTotalDepth(elements);
        const spacing = getDynamicSpacing(elements, getTextSize);

        const items = flattenAndCalculatePositions(
            elements,
            center.x,
            center.y,
            spacing.vertical,
            spacing.horizontal,
            0,
            0,
            totalDepth
        );

        setCanvasItems(items);
    };

    useEffect(() => {
        calculateAndSetPositions();
    }, [elements]);

    useEffect(() => {
        const handleResize = () => calculateAndSetPositions();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [elements]);

    return { canvasRef, canvasItems };
};
