import { orderByTabIndex } from './tabOrder';
import { getFocusables, getParentAutofocusables } from './tabUtils';
import { toArray } from './array';

const isElementHidden = (computedStyle) => {
  if (!computedStyle || !computedStyle.getPropertyValue) {
    return false;
  }
  return (
    computedStyle.getPropertyValue('display') === 'none' ||
    computedStyle.getPropertyValue('visibility') === 'hidden'
  );
};

export const isVisible = node => (
  (
    !node ||
    node === document ||
    node.nodeType === Node.DOCUMENT_NODE
  ) ||
  (
    !isElementHidden(window.getComputedStyle(node, null)) &&
    isVisible(
      node.parentNode.nodeType === node.DOCUMENT_FRAGMENT_NODE ?
        node.parentNode.host :
        node.parentNode,
    )
  )
);

export const notHiddenInput = node => !(
  (node.tagName === 'INPUT' || node.tagName === 'BUTTON') &&
  (node.type === 'hidden' || node.disabled)
);

const getParents = (node, parents = []) => {
  parents.push(node);
  if (node.parentNode) {
    getParents(node.parentNode, parents);
  }
  return parents;
};

export const getCommonParent = (nodea, nodeb) => {
  const parentsA = getParents(nodea);
  const parentsB = getParents(nodeb);

  for (let i = 0; i < parentsA.length; i += 1) {
    const currentParent = parentsA[i];
    if (parentsB.indexOf(currentParent) >= 0) {
      return currentParent;
    }
  }
  return false;
};

export const filterFocusable = nodes =>
  toArray(nodes)
    .filter(node => isVisible(node))
    .filter(node => notHiddenInput(node))
;

export const getTabbableNodes = (topNodes, withGuards) => (
  orderByTabIndex(filterFocusable(getFocusables(topNodes, withGuards)), true, withGuards)
);

export const getAllTabbableNodes = topNodes => (
  orderByTabIndex(filterFocusable(getFocusables(topNodes)), false)
);

export const parentAutofocusables = topNode =>
  filterFocusable(getParentAutofocusables(topNode));
