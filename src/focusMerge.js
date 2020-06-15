import { getCommonParent, getTabbableNodes, getAllTabbableNodes, parentAutofocusables } from './utils/DOMutils';
import pickFirstFocus, { pickFocusable } from './utils/firstFocus';
import getAllAffectedNodes from './utils/all-affected';
import { asArray } from './utils/array';
import { correctNodes } from './utils/correctFocus';

const findAutoFocused = autoFocusables => node => (
  !!node.autofocus ||
  (node.dataset && !!node.dataset.autofocus) ||
  autoFocusables.indexOf(node) >= 0
);

const isGuard = node => (node && node.dataset && node.dataset.focusGuard);
const notAGuard = node => !isGuard(node);

export const newFocus = (innerNodes, outerNodes, activeElement, lastNode, autoFocused) => {
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
    return innerNodes.indexOf(
      autoFocused && autoFocused.length
        ? pickFirstFocus(autoFocused)
        : pickFirstFocus(innerNodes),
    );
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

const getTopCommonParent = (baseActiveElement, leftEntry, rightEntries) => {
  const activeElements = asArray(baseActiveElement);
  const leftEntries = asArray(leftEntry);
  const activeElement = activeElements[0];
  let topCommon = null;
  leftEntries
    .filter(Boolean)
    .forEach((entry) => {
      topCommon = getCommonParent(topCommon || entry, entry) || topCommon;
      rightEntries
        .filter(Boolean)
        .forEach((subEntry) => {
          const common = getCommonParent(activeElement, subEntry);
          if (common) {
            if (!topCommon || common.contains(topCommon)) {
              topCommon = common;
            } else {
              topCommon = getCommonParent(common, topCommon);
            }
          }
        });
    });
  return topCommon;
};

const allParentAutofocusables = entries => (
  entries.reduce((acc, node) => acc.concat(parentAutofocusables(node)), [])
);

const reorderNodes = (srcNodes, dstNodes) => {
  const remap = new Map();
  // no Set(dstNodes) for IE11 :(
  dstNodes.forEach(entity => remap.set(entity.node, entity));
  // remap to dstNodes
  return srcNodes.map(node => remap.get(node)).filter(Boolean);
};

export const getFocusabledIn = (topNode) => {
  const entries = getAllAffectedNodes(topNode).filter(notAGuard);
  const commonParent = getTopCommonParent(topNode, topNode, entries);
  const outerNodes = getTabbableNodes([commonParent], true);
  const innerElements = getTabbableNodes(entries)
    .filter(({ node }) => notAGuard(node))
    .map(({ node }) => node);

  return outerNodes.map(({ node, index }) => ({
    node,
    index,
    lockItem: innerElements.indexOf(node) >= 0,
    guard: isGuard(node),
  }));
};

const getFocusMerge = (topNode, lastNode) => {
  const activeElement = document && document.activeElement;
  const entries = getAllAffectedNodes(topNode).filter(notAGuard);

  const commonParent = getTopCommonParent(activeElement || topNode, topNode, entries);

  let innerElements = getTabbableNodes(entries).filter(({ node }) => notAGuard(node));

  if (!innerElements[0]) {
    innerElements = getAllTabbableNodes(entries).filter(({ node }) => notAGuard(node));
    if (!innerElements[0]) {
      return undefined;
    }
  }

  const outerNodes = getTabbableNodes([commonParent]).map(({ node }) => node);
  const orderedInnerElements = reorderNodes(outerNodes, innerElements);
  const innerNodes = orderedInnerElements.map(({ node }) => node);

  const newId = newFocus(
    innerNodes, outerNodes,
    activeElement, lastNode, innerNodes.filter(findAutoFocused(allParentAutofocusables(entries))),
  );

  if (newId === undefined) {
    return newId;
  }
  return orderedInnerElements[newId];
};

export default getFocusMerge;
