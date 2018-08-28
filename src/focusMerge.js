import { orderByTabIndex } from './utils/tabOrder';
import { getCommonParent, getTabbableNodes, parentAutofocusables } from './utils/DOMutils';
import { getFocusables } from './utils/tabUtils';
import pickFirstFocus from './utils/firstFocus';
import getAllAffectedNodes from './utils/all-affected';

const findAutoFocused = autoFocusables => node => (
  !!node.autofocus ||
  (node.dataset && !!node.dataset.autofocus) ||
  autoFocusables.indexOf(node) >= 0
);

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

const getTopCommonParent = (activeElement, entry, entries) => {
  let topCommon = entry;
  entries.forEach((subEntry) => {
    const common = getCommonParent(activeElement, subEntry);
    if (common) {
      if (common.contains(topCommon)) {
        topCommon = common;
      } else {
        topCommon = getCommonParent(common, topCommon);
      }
    }
  });
  return topCommon;
};

const allParentAutofocusables = entries => (
  entries.reduce((acc, node) => acc.concat(parentAutofocusables(node)), [])
);

const notAGuard = node => !(node.dataset && node.dataset.focusGuard);

const getFocusMerge = (topNode, lastNode) => {
  const activeElement = document.activeElement;
  const entries = getAllAffectedNodes(topNode).filter(notAGuard);

  const commonParent = getTopCommonParent(activeElement || topNode, topNode, entries);

  const innerElements = getTabbableNodes(entries).filter(({ node }) => notAGuard(node));
  if (!innerElements[0]) {
    return undefined;
  }

  const innerNodes = innerElements
    .map(({ node }) => node);

  const outerNodes = orderByTabIndex(
    getFocusables([commonParent]))
    .map(({ node }) => node);

  const newId = newFocus(
    innerNodes, outerNodes,
    activeElement, lastNode, innerNodes.filter(findAutoFocused(allParentAutofocusables(entries))),
  );

  if (newId === undefined) {
    return newId;
  }
  return innerElements[newId];
};

export default getFocusMerge;
