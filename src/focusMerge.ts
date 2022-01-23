import { NEW_FOCUS, newFocus } from './solver';
import { getAllAffectedNodes } from './utils/all-affected';
import { getAllTabbableNodes, getTabbableNodes } from './utils/DOMutils';
import { pickFirstFocus } from './utils/firstFocus';
import { getActiveElement } from './utils/getActiveElement';
import { isDefined, isNotAGuard } from './utils/is';
import { allParentAutofocusables, getTopCommonParent } from './utils/parenting';
import { NodeIndex } from './utils/tabOrder';

const findAutoFocused = (autoFocusables: HTMLInputElement[]) => (node: HTMLInputElement): boolean =>
  node.autofocus || (node.dataset && !!node.dataset.autofocus) || autoFocusables.indexOf(node) >= 0;

const reorderNodes = (srcNodes: HTMLElement[], dstNodes: NodeIndex[]): NodeIndex[] => {
  const remap = new Map<HTMLElement, NodeIndex>();
  // no Set(dstNodes) for IE11 :(
  dstNodes.forEach((entity) => remap.set(entity.node, entity));
  // remap to dstNodes
  return srcNodes.map((node) => remap.get(node)).filter(isDefined);
};

export const getFocusMerge = (topNode: HTMLElement | HTMLElement[], lastNode: HTMLInputElement | null) => {
  const activeElement: HTMLInputElement = (document && getActiveElement()) as any;
  const entries = getAllAffectedNodes(topNode).filter(isNotAGuard);

  const commonParent = getTopCommonParent(activeElement || topNode, topNode, entries);
  const visibilityCache = new Map();

  const anyFocusable = getAllTabbableNodes(entries, visibilityCache);
  let innerElements = getTabbableNodes(entries, visibilityCache).filter(({ node }) => isNotAGuard(node));

  if (!innerElements[0]) {
    innerElements = anyFocusable;
    if (!innerElements[0]) {
      return undefined;
    }
  }

  const outerNodes = getAllTabbableNodes([commonParent], visibilityCache).map(({ node }) => node);
  const orderedInnerElements = reorderNodes(outerNodes, innerElements);
  const innerNodes = orderedInnerElements.map(({ node }) => node);

  const newId = newFocus(innerNodes, outerNodes, activeElement, lastNode);

  if (newId === NEW_FOCUS) {
    const autoFocusable = anyFocusable
      .map(({ node }) => node)
      .filter(findAutoFocused(allParentAutofocusables(entries, visibilityCache)));

    return {
      node: autoFocusable && autoFocusable.length ? pickFirstFocus(autoFocusable) : pickFirstFocus(innerNodes),
    };
  }

  if (newId === undefined) {
    return newId;
  }
  return orderedInnerElements[newId];
};
