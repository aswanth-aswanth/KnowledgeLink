import { Topic, Rect } from '@/types/EditorTypes';

export const createRectanglesFromData = (
  topic: Topic,
  level: number = 0,
  yOffset: number = 0,
  existingRects: Rect[] = []
): Rect[] => {
  const newRects: Rect[] = [];
  const rectWidth = 180;
  const rectHeight = 40;
  const xOffset = level * 250;

  const existingRect = existingRects.find((r) => r.id === topic?.uniqueId);
  const rect: Rect = existingRect || {
    id: `${topic.uniqueId}`,
    x: xOffset,
    y: yOffset,
    width: rectWidth,
    height: rectHeight,
    name: topic?.name,
    uniqueId: `${topic.uniqueId}`,
  };
  newRects.push(rect);

  let currentYOffset = yOffset + rectHeight + 20;
  topic?.children.forEach((child) => {
    const childRects = createRectanglesFromData(
      child,
      level + 1,
      currentYOffset,
      existingRects
    );
    newRects.push(...childRects);
    currentYOffset += childRects.length * (rectHeight + 20);
  });

  return newRects;
};