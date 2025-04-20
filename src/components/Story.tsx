
import React, { useEffect, useState } from 'react';
import { useStore } from 'react-stores';
import { PlusCircleIcon } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";
import { storiesStore } from '../stores/storiesStore';

type StoryProps = {
    xPos?: number;
    yPos?: number;
    type?: 'default' | 'create'; // Optional string prop
}

export type StoryType = {
    id: number;
    order: number;
    title: string;
    text: string;
    stories: StoryType[];
}

function Story({ type, xPos, yPos }: StoryProps) {
    // const storyType: 'default' | 'create' = type ?? 'default';

    const [stories, setStories] = useState<StoryType[]>([]);
    const myStoreState = useStore(storiesStore);  // Getting the store state

    useEffect(() => {
        if (myStoreState.counter === 0) {
            storiesStore.setState({
                counter: 1,
            });
        }
    }, []);

    function createStory() {
        setStories([
            ...stories,
            {
                id: 1,
                order: 1,
                title: 'New Story',
                text: '',
                stories: [],
            }
        ]);

        // Increment stories counter
        storiesStore.setState({
            counter: myStoreState.counter + 1,
        });
    }

    return (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 z-10" style={{ left: xPos, top: yPos }}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className="h-10 w-10 rounded-full bg-blue-600 flex justify-center items-center cursor-pointer text-2xl" onClick={createStory}>
                        {/* <PlusCircleIcon /> */}
                    </TooltipTrigger>
                    <TooltipContent className="flex flex-col justify-center">
                        <button className="cursor-pointer">View</button>
                        <button className="cursor-pointer">Delete</button>
                        <button className="cursor-pointer">Edit</button>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}

export default Story;