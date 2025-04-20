import React, { useMemo } from 'react';
import Canvas from './components/Canvas';
import { useCanvasPositioning } from './hooks/useCanvasPositioning';
import { useStore } from 'react-stores';
import { storiesStore } from './stores/storiesStore';

function App() {
    const storedStories = useStore(storiesStore);

    const { canvasRef, canvasItems } = useCanvasPositioning(
        useMemo(() => [
            ...storedStories.stories,
            {
                id: '0',
                order: 0,
                title: '',
                text: '',
                stories: [],
                type: 'create' as const,
            },
        ], [storedStories.stories])
    );

    return (
        <div className="text-center h-full">
            <header className="bg-[#282c34] min-h-[100vh] flex flex-col items-center text-white">
                <Canvas ref={canvasRef} canvasItems={canvasItems} />
            </header>
        </div>
    );
}

export default App;