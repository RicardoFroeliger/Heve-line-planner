import { Store } from 'react-stores';

export interface IStoriesStoreState {
    counter: number;
}

export const storiesStore = new Store<IStoriesStoreState>({
    counter: 0,
});