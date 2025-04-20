import React, { useMemo } from 'react';
import Canvas from './components/Canvas';
import { useCanvasPositioning } from './hooks/useCanvasPositioning';
import { StoryType } from './components/Story';

function App() {
    const stories = useMemo<StoryType[]>(() => [
        {
            id: 1,
            order: 1,
            title: 'Chapter 1',
            text: '',
            stories: [
                {
                    id: 2,
                    order: 1,
                    title: 'Exercise 1',
                    text: '',
                    stories: [{
                        id: 3,
                        order: 2,
                        title: 'Part 1',
                        text: '',
                        stories: []
                    }, {
                        id: 4,
                        order: 2,
                        title: 'Part 2',
                        text: '',
                        stories: []
                    }, {
                        id: 5,
                        order: 3,
                        title: 'Part 3',
                        text: '',
                        stories: []
                    }]
                },
                {
                    id: 6,
                    order: 2,
                    title: 'Exercise 2',
                    text: '',
                    stories: []
                }]
        },
        {
            id: 7,
            order: 2,
            title: 'Chapter 2',
            text: '',
            stories: [
                {
                    id: 8,
                    order: 1,
                    title: 'Exercise 1',
                    text: '',
                    stories: [{
                        id: 9,
                        order: 2,
                        title: 'Part 1',
                        text: '',
                        stories: []
                    }]
                },
                {
                    id: 10,
                    order: 2,
                    title: 'Exercise 2',
                    text: '',
                    stories: []
                }]
        },
        {
            id: 11,
            order: 2,
            title: 'Math',
            text: '',
            stories: []
        }
    ], []);

    // Use position calculated items for canvas
    const { canvasRef, canvasItems } = useCanvasPositioning(stories);

    return (
        <div className="text-center h-full">
            <header className="bg-[#282c34] min-h-[100vh] flex flex-col items-center text-white">
                <Canvas ref={canvasRef} canvasItems={canvasItems} />
            </header>
        </div>
    );
}

export default App;