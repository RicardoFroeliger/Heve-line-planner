
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
import { CanvasItem } from './Canvas';

type StoryProps = CanvasItem;

export type StoryType = {
    id: string;
    order: number;
    title: string;
    text: string;
    stories: StoryType[];
    type?: 'default' | 'create';
}

function Story({
    id,
    order,
    stories,
    text,
    title,
    x,
    y,
    type,
}: StoryProps) {
    const storedStories = useStore(storiesStore);
    const storyType: 'default' | 'create' = type ?? 'default';

    // Recursive function to update stories
    const updateNestedStories = (
        stories: StoryType[],
        id: string,
        callback: (story: StoryType) => StoryType | null
    ): StoryType[] => {
        return stories
            .map(story => {
                if (story.id === id) {
                    const updatedStory = callback(story);
                    return updatedStory ? { ...updatedStory } : null;
                }

                // Recursively search in nested stories
                return {
                    ...story,
                    stories: updateNestedStories(story.stories, id, callback),
                };
            })
            .filter(story => story !== null) as StoryType[]; // Filter out null values for deletions
    }

    const createStory = (id?: string) => {
        if (id?.length) {
            // Add a new story to an existing story
            storiesStore.setState({
                stories: updateNestedStories(storedStories.stories, id, (story) => ({
                    ...story,
                    stories: [
                        ...story.stories,
                        {
                            id: uuidv4(),
                            order: story.stories.length + 1,
                            title: 'New Story',
                            text: '',
                            stories: [],
                        },
                    ],
                }))
            });
        } else {
            // Add a new story at the root level if no id is provided
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
    }

    const deleteStory = (id: string) => {
        const newStoredStories = updateNestedStories(storedStories.stories, id, () => null);
        storiesStore.setState({
            stories: newStoredStories,
        });
    }

    return (
        storyType === 'create'
            ? (
                <div className="absolute -translate-x-1/2 -translate-y-1/2 z-10" style={{ left: x, top: y }}>
                    <button
                        className="h-10 w-10 rounded-full bg-blue-600 flex justify-center items-center cursor-pointer text-2xl"
                        onClick={() => createStory()}
                    >
                        <PlusCircleIcon />
                    </button>
                </div>
            )
            : (
                <div className="absolute -translate-x-1/2 -translate-y-1/2 z-10" style={{ left: x, top: y }}>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="rounded-xl p-2 bg-blue-600 flex justify-center items-center cursor-pointer text-2xl">

                                <span>{title}</span>
                            </TooltipTrigger>
                            <TooltipContent className="flex flex-col justify-center">
                                <button className="cursor-pointer">View</button>
                                <button className="cursor-pointer" onClick={() => createStory(id)}>Create</button>
                                <button className="cursor-pointer" onClick={() => deleteStory(id)}>Delete</button>
                                <button className="cursor-pointer">Edit</button>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            )
    );
}

export default Story;