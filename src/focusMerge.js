import { getCommonParent, getTabbableNodes, getAllTabbableNodes, parentAutofocusables } from './utils/DOMutils';
import pickFirstFocus from './utils/firstFocus';
import getAllAffectedNodes from './utils/all-affected';
import { asArray } from './utils/array';

const findAutoFocused = autoFocusables => node => (
  !!node.autofocus ||
  (node.dataset && !!node.dataset.autofocus) ||
  autoFocusables.indexOf(node) >= 0
);

const isGuard = node => (node.dataset && node.dataset.focusGuard);
const notAGuard = node => !isGuard(node);

export const newFocus = (innerNodes, outerNodes, activeElement, lastNode, autoFocused) => {
  const cnt = innerNodes.length;
  const firstFocus = innerNodes[0];
  const lastFocus = innerNodes[cnt - 1];

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

  // new focus
  if (activeIndex === -1 || lastNodeInside === -1) {
    return innerNodes.indexOf(
      autoFocused.length
        ? pickFirstFocus(autoFocused)
        : pickFirstFocus(innerNodes),
    );
  }
  // old focus
  if (!indexDiff && lastNodeInside >= 0) {
    return lastNodeInside;
  }
  // first element
  if (activeIndex <= firstNodeIndex && isGuard(activeElement) && Math.abs(indexDiff) > 1) {
    return 0;
  }
  // jump out
  if (indexDiff && Math.abs(indexDiff) > 1) {
    return lastNodeInside;
  }
  // focus above lock
  if (activeIndex <= firstNodeIndex) {
    return cnt - 1;
  }
  // focus below lock
  if (activeIndex > lastNodeIndex) {
    return 0;
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

const reorderNodes = (srcNodes, dstNodes) => (
  srcNodes
    .map(dnode => dstNodes.find(({ node }) => dnode === node))
    .filter(Boolean)
);

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
