
import React from 'react';
import { useStore } from 'react-stores';
import { PlusCircleIcon } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";
import { storiesStore } from '../stores/storiesStore';
import { v4 as uuidv4 } from 'uuid';

type StoryProps = {
    xPos?: number;
    yPos?: number;
    type?: 'default' | 'create';
}

export type StoryType = {
    id: string;
    order: number;
    title: string;
    text: string;
    stories: StoryType[];
    type?: 'default' | 'create';
}

function Story({ type, xPos, yPos }: StoryProps) {
    const storedStories = useStore(storiesStore);
    const storyType: 'default' | 'create' = type ?? 'default';

    function createStory() {
        storiesStore.setState({
            stories: [
                ...storedStories.stories,
                {
                    id: uuidv4(),
                    order: storedStories.stories.length + 1,
                    title: 'New Story',
                    text: '',
                    stories: [],
                }
            ],
        });
    }

    return (
        storyType === 'create'
            ? (
                <div className="absolute -translate-x-1/2 -translate-y-1/2 z-10" style={{ left: xPos, top: yPos }}>
                    <button
                        className="h-10 w-10 rounded-full bg-blue-600 flex justify-center items-center cursor-pointer text-2xl"
                        onClick={createStory}
                    >
                        <PlusCircleIcon />
                    </button>
                </div>
            )
            : (
                <div className="absolute -translate-x-1/2 -translate-y-1/2 z-10" style={{ left: xPos, top: yPos }}>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="h-10 w-10 rounded-full bg-blue-600 flex justify-center items-center cursor-pointer text-2xl">

                                <span>0</span>
                            </TooltipTrigger>
                            <TooltipContent className="flex flex-col justify-center">
                                <button className="cursor-pointer">View</button>
                                <button className="cursor-pointer">Delete</button>
                                <button className="cursor-pointer">Edit</button>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            )
    );
}

export default Story;