const SIBLINGS = 1;
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

// Returns page numbers with "ellipsis" markers, e.g. [1, "ellipsis", 9, 10, 11, "ellipsis", 20].
export const getPageItems = (page, pages) => {
  const totalSlots = SIBLINGS * 2 + 5;
  if (pages <= totalSlots) return range(1, pages);

  const left = Math.max(page - SIBLINGS, 1);
  const right = Math.min(page + SIBLINGS, pages);
  const showLeftDots = left > 2;
  const showRightDots = right < pages - 1;
  const edgeCount = 3 + 2 * SIBLINGS;

  if (!showLeftDots && showRightDots) return [...range(1, edgeCount), "ellipsis", pages];
  if (showLeftDots && !showRightDots) return [1, "ellipsis", ...range(pages - edgeCount + 1, pages)];
  return [1, "ellipsis", ...range(left, right), "ellipsis", pages];
};