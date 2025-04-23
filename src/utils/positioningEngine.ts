import { CanvasItem } from '../components/Canvas';
import { StoryType } from '../components/Story';

export function calculateTotalDepth(elements: StoryType[]): number {
    let maxDepth = 0;

    const traverse = (elements: StoryType[], depth: number) => {
        maxDepth = Math.max(maxDepth, depth);
        elements.forEach(element => {
            if (element.stories && element.stories.length > 0) {
                traverse(element.stories, depth + 1);
            }
        });
    };

    traverse(elements, 0);
    return maxDepth;
}

function countTotalLeafNodes(stories: StoryType[]): number {
    if (!stories || stories.length === 0) return 1;

    return stories.reduce((acc, story) => {
        if (!story.stories || story.stories.length === 0) return acc + 1;
        return acc + countTotalLeafNodes(story.stories);
    }, 0);
}

export function flattenAndCalculatePositions(
    elements: StoryType[],
    centerX: number,
    centerY: number,
    spacingY: number,
    spacingX: number,
    currentY: number = 0,
    depth: number = 0,
    totalDepth: number = 0,
    parentX: number = centerX
): CanvasItem[] {
    let result: CanvasItem[] = [];

    // Calculate total width of this level (every item counts as 1 block)
    // const totalWidth = elements.length * spacingX;
    // let offsetX = parentX - totalWidth / 2 + spacingX / 2;

    // Total width occupied by the entire tree for centering at root level
    const totalLeafs = countTotalLeafNodes(elements);
    let offsetX = parentX - (totalLeafs * spacingX) / 2;

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        // block spacing
        // const calculatedX = offsetX;
        // const calculatedY = centerY + (depth - totalDepth / 2) * spacingY;

        // Tree leaf spacing
        const thisSubtreeLeafs = countTotalLeafNodes([element]);
        const calculatedX = offsetX + (thisSubtreeLeafs * spacingX) / 2;
        const calculatedY = centerY + (depth - totalDepth / 2) * spacingX;

        result.push({ ...element, x: calculatedX, y: calculatedY });

        if (element.stories && element.stories.length > 0) {
            const children = flattenAndCalculatePositions(
                element.stories,
                centerX,
                centerY,
                spacingY,
                spacingX,
                currentY + spacingY,
                depth + 1,
                totalDepth,
                calculatedX
            );

            result = result.concat(children);
        }

        // offsetX += spacingX; // Block spacing
        offsetX += thisSubtreeLeafs * spacingX; // Tree leaf spacing
    }

    return result;
}
