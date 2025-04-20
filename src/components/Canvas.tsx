import React, { useState, useMemo, useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

type ElementData = {
    id: number;
    x: number;
    y: number;
    text: string;
};

export default function Canvas() {
    const [elements, setElements] = useState<ElementData[]>([
        { id: 1, x: 100, y: 100, text: 'Element 1' },
        { id: 2, x: 600, y: 200, text: 'Element 2' },
        { id: 3, x: 1800, y: 400, text: 'Far Element' },
        { id: 3, x: 1800, y: 1500, text: 'Far Element' },
    ]);

    const transformRef = useRef<any>(null);

    // Canvas size and offset
    const canvasSize = useMemo(() => {
        const padding = 200;
        const minX = Math.min(...elements.map((el) => el.x));
        const maxX = Math.max(...elements.map((el) => el.x));
        const minY = Math.min(...elements.map((el) => el.y));
        const maxY = Math.max(...elements.map((el) => el.y));

        const contentWidth = maxX - minX + padding * 2;
        const contentHeight = maxY - minY + padding * 2;

        return {
            width: Math.max(contentWidth, window.innerWidth),
            height: Math.max(contentHeight, window.innerHeight),
            offsetX: minX - padding,
            offsetY: minY - padding,
        };
    }, [elements]);

    // Limit zooming out so canvas always fills screen
    const minZoom = useMemo(() => {
        const scaleX = window.innerWidth / canvasSize.width;
        const scaleY = window.innerHeight / canvasSize.height;
        return Math.min(scaleX, scaleY); // Ensures the canvas will fit the screen height and width
    }, [canvasSize]);

    // Zoom out to fit all content on mount or canvasSize change
    useEffect(() => {
        if (transformRef.current) {
            const containerWidth = window.innerWidth;
            const containerHeight = window.innerHeight;

            const scaleX = containerWidth / canvasSize.width;
            const scaleY = containerHeight / canvasSize.height;
            const newScale = Math.min(scaleX, scaleY, 1);

            const canvasCenterX = canvasSize.width / 2;
            const canvasCenterY = canvasSize.height / 2;
            const screenCenterX = containerWidth / 2;
            const screenCenterY = containerHeight / 2;

            const offsetX = screenCenterX - canvasCenterX * newScale;
            const offsetY = screenCenterY - canvasCenterY * newScale;

            transformRef.current.setTransform(screenCenterX - canvasCenterX, screenCenterY - canvasCenterY, 1, 0);
            transformRef.current.setTransform(offsetX, offsetY, newScale, 300);
        }
    }, [canvasSize]);

    // Prevent browser zoom
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey) {
                e.preventDefault();
            }
        };
        window.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            window.removeEventListener("wheel", handleWheel);
        };
    }, []);

    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                overflow: 'hidden'
            }}
        >
            <TransformWrapper
                ref={transformRef}
                minScale={minZoom}
                maxScale={3}
                initialScale={1}
                centerOnInit
                doubleClick={{ disabled: true }}
                wheel={{ step: 50 }}
            >
                <TransformComponent
                    wrapperStyle={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            width: `${canvasSize.width}px`,
                            height: `${canvasSize.height}px`,
                            position: 'relative',
                            backgroundColor: '#fff',
                            backgroundImage:
                                'linear-gradient(to right, #a0a0a0 1px, transparent 1px), linear-gradient(to bottom, #a0a0a0 1px, transparent 1px)',
                            backgroundSize: '50px 50px',
                            boxSizing: 'border-box',
                        }}
                    >
                        {elements.map((el) => (
                            <div
                                key={el.id}
                                style={{
                                    position: 'absolute',
                                    left: el.x,
                                    top: el.y,
                                    padding: '10px 20px',
                                    background: '#4287f5',
                                    color: 'white',
                                    borderRadius: 8,
                                }}
                            >
                                {el.text}
                            </div>
                        ))}
                    </div>
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
}
