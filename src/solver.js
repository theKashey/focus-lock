import { isGuard } from './utils/is';
import { correctNodes } from './utils/correctFocus';
import { pickFocusable } from './utils/firstFocus';

export const NEW_FOCUS = 'NEW_FOCUS';
/**
 * Main solver for the "find next focus" question
 * @param innerNodes
 * @param outerNodes
 * @param activeElement
 * @param lastNode
 * @returns {number|string|undefined|*}
 */
export const newFocus = (innerNodes, outerNodes, activeElement, lastNode) => {
  const cnt = innerNodes.length;
  const firstFocus = innerNodes[0];
  const lastFocus = innerNodes[cnt - 1];
  const isOnGuard = isGuard(activeElement);

  // focus is inside
  if (innerNodes.indexOf(activeElement) >= 0) {
    return undefined;
  }

  const activeIndex = outerNodes.indexOf(activeElement);
  const lastIndex = outerNodes.indexOf(lastNode || activeIndex);
  const lastNodeInside = innerNodes.indexOf(lastNode);
  const indexDiff = activeIndex - lastIndex;
  const firstNodeIndex = outerNodes.indexOf(firstFocus);
  const lastNodeIndex = outerNodes.indexOf(lastFocus);

  const correctedNodes = correctNodes(outerNodes);
  const correctedIndexDiff = (
    correctedNodes.indexOf(activeElement) -
    correctedNodes.indexOf(lastNode || activeIndex)
  );

  const returnFirstNode = pickFocusable(innerNodes, 0);
  const returnLastNode = pickFocusable(innerNodes, cnt - 1);

  // new focus
  if (activeIndex === -1 || lastNodeInside === -1) {
    return NEW_FOCUS;
  }
  // old focus
  if (!indexDiff && lastNodeInside >= 0) {
    return lastNodeInside;
  }
  // first element
  if (activeIndex <= firstNodeIndex && isOnGuard && Math.abs(indexDiff) > 1) {
    return returnLastNode;
  }
  // last element
  if (activeIndex >= lastNodeIndex && isOnGuard && Math.abs(indexDiff) > 1) {
    return returnFirstNode;
  }
  // jump out, but not on the guard
  if (indexDiff && Math.abs(correctedIndexDiff) > 1) {
    return lastNodeInside;
  }
  // focus above lock
  if (activeIndex <= firstNodeIndex) {
    return returnLastNode;
  }
  // focus below lock
  if (activeIndex > lastNodeIndex) {
    return returnFirstNode;
  }
  // index is inside tab order, but outside Lock
  if (indexDiff) {
    if (Math.abs(indexDiff) > 1) {
      return lastNodeInside;
    }
    return (cnt + lastNodeInside + indexDiff) % cnt;
  }
  // do nothing
  return undefined;
};
