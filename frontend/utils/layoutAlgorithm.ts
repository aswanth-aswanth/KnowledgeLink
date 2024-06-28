// utils/layoutAlgorithm.ts
import { Topic, Rect } from "@/types/types";

const VERTICAL_SPACING = 80;
const HORIZONTAL_SPACING = 200;
const RECT_WIDTH = 150;
const RECT_HEIGHT = 70;

export function calculateHierarchicalLayout(topic: Topic, level: number = 0, yOffset: number = 0): Rect[] {
    const rects: Rect[] = [];

    const rect: Rect = {
        id: `rect-${level}-${yOffset}`,
        x: level * HORIZONTAL_SPACING,
        y: yOffset,
        width: RECT_WIDTH,
        height: RECT_HEIGHT,
        name: topic.name,
        progress: topic.progress || 0,
    };

    rects.push(rect);

    let currentYOffset = yOffset + RECT_HEIGHT + VERTICAL_SPACING;

    topic.children.forEach((child, index) => {
        const childRects = calculateHierarchicalLayout(child, level + 1, currentYOffset);
        rects.push(...childRects);
        currentYOffset = childRects[childRects.length - 1].y + RECT_HEIGHT + VERTICAL_SPACING;
    });

    return rects;
}