import { PlusCircleIcon } from 'lucide-react';
import logo from './logo.png';
import React, { useState } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./components/ui/tooltip";

type Story = {
    name: string;
    stories: Story[];
}

function App() {
    const [stories, setStories] = useState<Story[]>([]);
    function createStory() {
        setStories([
            ...stories,
            {
                name: 'New Story',
                stories: [],
            }
        ]);
    }

    return (
        <div className="text-center h-full">
            <header className="bg-[#282c34] min-h-[100vh] flex flex-col items-center text-white">
                <img
                    src={logo}
                    className="h-20 absolute top-20 rounded-full border-gray-500 border-2"
                    alt="logo"
                />
                <div className="flex flex-col items-center justify-center flex-grow w-full">
                    {
                        !stories.length && (
                            <h1 className="mb-12 text-2xl">
                                Create your first story by clicking below
                            </h1>
                        )
                    }
                    <div className='flex flex-row gap-20 relative'>
                        <div className="absolute w-[90%] h-1 bg-gray-700 rounded-full z-10 top-1/2 left-1/2 -translate-x-[50%]"></div>

                        <div className="flex flex-row gap-20 relative z-20">
                            {
                                stories.map(story => (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <button
                                                    className="h-10 w-10 rounded-full bg-blue-600 flex justify-center items-center cursor-pointer text-2xl"
                                                    onClick={createStory}
                                                >
                                                    0
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent className="flex flex-col justify-center">
                                                <button className="cursor-pointer">View</button>
                                                <button className="cursor-pointer">Delete</button>
                                                <button className="cursor-pointer">Edit</button>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))
                            }
                            <button
                                className="h-10 w-10 rounded-full bg-blue-600 flex justify-center items-center cursor-pointer"
                                onClick={createStory}
                            >
                                <PlusCircleIcon className="h-7 w-7" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default App;