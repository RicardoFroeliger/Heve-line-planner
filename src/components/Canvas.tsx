import React, { useMemo, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Story, { StoryType } from './Story';

export type CanvasItem = StoryType & {
    x: number;
    y: number;
};

export type CanvasHandle = {
    getViewportCenter: () => { x: number; y: number };
};

type CanvasProps = {
    canvasItems: CanvasItem[];
};

const canvasPadding = 175;
// TODO: padding is currently necessary because the center cords of the story determine the expanding of the canvas 
// For long words, the padding should be increased, but ideally the canvas shouln't expand based on the center but on the actual Story's size
const Canvas = forwardRef<CanvasHandle, CanvasProps>(({ canvasItems }, ref) => {
    const transformRef = useRef<any>(null);
    const innerCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const prevItemCount = useRef(canvasItems.length);

    const getViewportCenter = () => {
        /**
         * Disabled for now because this causes issues when deleting elements
         */
        // if (!transformRef.current) return { x: 0, y: 0 };

        // const { scale, positionX, positionY } = transformRef.current.instance.transformState;

        // const centerX = (window.innerWidth / 2 - positionX) / scale;
        // const centerY = (window.innerHeight / 2 - positionY) / scale;

        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2

        return { x: centerX, y: centerY };
    };

    useImperativeHandle(ref, () => ({
        getViewportCenter,
    }));

    // Adjust all coordinates to make them positive and add minimum padding
    const adjustedCanvasItems = (() => {
        const minX = Math.min(...canvasItems.map(item => item.x));
        const minY = Math.min(...canvasItems.map(item => item.y));

        const offsetX = minX < canvasPadding ? canvasPadding - minX : 0;
        const offsetY = minY < canvasPadding ? canvasPadding - minY : 0;

        return canvasItems.map(item => ({
            ...item,
            x: item.x + offsetX,
            y: item.y + offsetY,
        }));
    })();

    // Calculate the canvas size and offsets
    const canvasSize = useMemo(() => {
        if (adjustedCanvasItems.length === 0) {
            return {
                width: window.innerWidth,
                height: window.innerHeight,
                offsetX: 0,
                offsetY: 0,
            };
        }

        const minX = Math.min(...adjustedCanvasItems.map(item => item.x));
        const minY = Math.min(...adjustedCanvasItems.map(item => item.y));
        const maxX = Math.max(...adjustedCanvasItems.map(item => item.x));
        const maxY = Math.max(...adjustedCanvasItems.map(item => item.y));

        return {
            width: Math.max(maxX - minX + canvasPadding * 2, window.innerWidth),
            height: Math.max(maxY - minY + canvasPadding * 2, window.innerHeight),
            offsetX: -minX + canvasPadding,
            offsetY: -minY + canvasPadding,
        };
    }, [adjustedCanvasItems]);

    // Calculate minimum zoom level to fit the entire canvas
    const minZoom = useMemo(() => {
        const scaleX = window.innerWidth / canvasSize.width;
        const scaleY = window.innerHeight / canvasSize.height;
        return Math.min(scaleX, scaleY); // Ensures the canvas will fit the screen height and width
    }, [canvasSize]);

    // Wait for transform ref to be ready before zoom out is 100% always working
    const waitForTransformRefReady = (): Promise<any> => {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (transformRef.current?.instance) {
                    clearInterval(interval);
                    resolve(transformRef.current);
                }
            }, 50); // check every 50ms
        });
    };

    // Zoom out to fit all content on mount or canvasSize change
    useEffect(() => {
        (async () => {
            prevItemCount.current = canvasItems.length;

            if (transformRef.current) {
                const ref = await waitForTransformRefReady();

                const containerWidth = window.innerWidth;
                const containerHeight = window.innerHeight;

                const scaleX = containerWidth / canvasSize.width;
                const scaleY = containerHeight / canvasSize.height;
                const newScale = Math.min(scaleX, scaleY, 1);

                const canvasCenterX = canvasSize.width / 2;
                const canvasCenterY = canvasSize.height / 2;

                const offsetX = containerWidth / 2 - canvasCenterX * newScale;
                const offsetY = containerHeight / 2 - canvasCenterY * newScale;

                ref.setTransform(offsetX, offsetY, newScale, 300);
            }
        })();
    }, [canvasSize]);

    // Prevent browser zoom
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey) {
                e.preventDefault();
            }
        };
        window.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, []);

    // Draw lines between connected stories
    useEffect(() => {
        if (!innerCanvasRef.current) return;

        const ctx = innerCanvasRef.current.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, innerCanvasRef.current.width, innerCanvasRef.current.height);
        ctx.strokeStyle = '#6e737d';
        ctx.lineWidth = 4;

        const drawLineBetween = (from: CanvasItem, to: CanvasItem) => {
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
        };

        // Draw parent-child lines
        adjustedCanvasItems.forEach((parent) => {
            if (parent.stories) {
                parent.stories.forEach((child) => {
                    const childFull = adjustedCanvasItems.find((item) => item.id === child.id);
                    if (childFull) drawLineBetween(parent, childFull);
                });
            }
        });

        // Draw lines between top-level items (no one is linking to them)
        const childIds = new Set(adjustedCanvasItems.flatMap((item) => item.stories?.map((story) => story.id) || []));
        const topLevelItems = adjustedCanvasItems.filter((item) => !childIds.has(item.id));

        // Sort top-levels (optional: by x or y position for nicer layout)
        const sortedTopLevels = topLevelItems.slice().sort((a, b) => a.x - b.x);

        for (let i = 0; i < sortedTopLevels.length - 1; i++) {
            drawLineBetween(sortedTopLevels[i], sortedTopLevels[i + 1]);
        }
    }, [adjustedCanvasItems]);

    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
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
                            // backgroundColor: '#fff',
                            // backgroundImage:
                            //     'linear-gradient(to right, #a0a0a0 1px, transparent 1px), linear-gradient(to bottom, #a0a0a0 1px, transparent 1px)',
                            // backgroundSize: '50px 50px',
                            boxSizing: 'border-box',
                        }}
                    >
                        <canvas
                            ref={innerCanvasRef}
                            width={canvasSize.width}
                            height={canvasSize.height}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                pointerEvents: 'none',
                                zIndex: 1
                            }}
                        />
                        {adjustedCanvasItems.map((item, index) => (
                            <Story key={index} {...item} />
                        ))}
                        {
                            !canvasItems.filter(item => item.type !== 'create')?.length && (
                                <>
                                    <h1 className="pb-36 text-2xl absolute -translate-x-1/2 -translate-y-1/2" style={{
                                        top: getViewportCenter().y,
                                        left: getViewportCenter().x,
                                    }}>
                                        Create your first story by clicking below
                                    </h1>
                                </>
                            )
                        }
                    </div>
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
});

export default Canvas;
