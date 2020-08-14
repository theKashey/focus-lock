import { getAllTabbableNodes, getTabbableNodes } from './utils/DOMutils';
import { pickFirstFocus } from './utils/firstFocus';
import getAllAffectedNodes from './utils/all-affected';
import { allParentAutofocusables, getTopCommonParent } from './utils/parenting';
import { isNotAGuard } from './utils/is';
import { NEW_FOCUS, newFocus } from './solver';

const findAutoFocused = autoFocusables => node => (
  !!node.autofocus ||
  (node.dataset && !!node.dataset.autofocus) ||
  autoFocusables.indexOf(node) >= 0
);

const reorderNodes = (srcNodes, dstNodes) => {
  const remap = new Map();
  // no Set(dstNodes) for IE11 :(
  dstNodes.forEach(entity => remap.set(entity.node, entity));
  // remap to dstNodes
  return srcNodes.map(node => remap.get(node)).filter(Boolean);
};

const getFocusMerge = (topNode, lastNode) => {
  const activeElement = document && document.activeElement;
  const entries = getAllAffectedNodes(topNode).filter(isNotAGuard);

  const commonParent = getTopCommonParent(activeElement || topNode, topNode, entries);

  const anyFocusable = getAllTabbableNodes(entries);
  let innerElements = getTabbableNodes(entries).filter(({ node }) => isNotAGuard(node));

  if (!innerElements[0]) {
    innerElements = anyFocusable;
    if (!innerElements[0]) {
      return undefined;
    }
  }

  const outerNodes = getAllTabbableNodes([commonParent]).map(({ node }) => node);
  const orderedInnerElements = reorderNodes(outerNodes, innerElements);
  const innerNodes = orderedInnerElements.map(({ node }) => node);

  const newId = newFocus(
    innerNodes, outerNodes,
    activeElement, lastNode,
  );

  if (newId === NEW_FOCUS) {
    const autoFocusable = anyFocusable
      .map(({ node }) => node)
      .filter(findAutoFocused(allParentAutofocusables(entries)));

    return {
      node: autoFocusable && autoFocusable.length
        ? pickFirstFocus(autoFocusable)
        : pickFirstFocus(innerNodes),
    };
  }

  if (newId === undefined) {
    return newId;
  }
  return orderedInnerElements[newId];
};

export default getFocusMerge;
