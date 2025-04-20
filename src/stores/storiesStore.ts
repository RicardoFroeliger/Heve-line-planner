import { Store, StoreEventType } from 'react-stores';
import { StoryType } from '../components/Story';

export interface IStoriesStoreState {
    stories: StoryType[];
}

// Get initial local storage data or create new local storage variable
let localStorageStories: StoryType[] = [];
try {
    const storedStories = localStorage.getItem('stories');
    localStorageStories = storedStories ? JSON.parse(storedStories) : [];
    if (!Array.isArray(localStorageStories)) throw new Error('Invalid data');
} catch {
    localStorageStories = [];
    localStorage.setItem('stories', JSON.stringify(localStorageStories));
}

// Create store with initial data
export const storiesStore = new Store<IStoriesStoreState>({
    stories: localStorageStories,
});

// Update listener to write to local storage
storiesStore.on(StoreEventType.All, (state) => {
    localStorage.setItem('stories', JSON.stringify(state.stories));
});