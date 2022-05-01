import { parentAutofocusables } from './DOMutils';
import { contains } from './DOMutils';
import { asArray } from './array';
import { VisibilityCache } from './is';

const getParents = (node: Element, parents: Element[] = []): Element[] => {
  parents.push(node);

  if (node.parentNode) {
    getParents((node.parentNode as ShadowRoot).host || node.parentNode, parents);
  }

  return parents;
};

/**
 * finds a parent for both nodeA and nodeB
 * @param nodeA
 * @param nodeB
 * @returns {boolean|*}
 */
export const getCommonParent = (nodeA: Element, nodeB: Element): Element | false => {
  const parentsA = getParents(nodeA);
  const parentsB = getParents(nodeB);

  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < parentsA.length; i += 1) {
    const currentParent = parentsA[i];

    if (parentsB.indexOf(currentParent) >= 0) {
      return currentParent;
    }
  }

  return false;
};

export const getTopCommonParent = (
  baseActiveElement: Element | Element[],
  leftEntry: Element | Element[],
  rightEntries: Element[]
): Element => {
  const activeElements = asArray(baseActiveElement);
  const leftEntries = asArray(leftEntry);
  const activeElement = activeElements[0];
  let topCommon: Element | false = false;

  leftEntries.filter(Boolean).forEach((entry) => {
    topCommon = getCommonParent(topCommon || entry, entry) || topCommon;

    rightEntries.filter(Boolean).forEach((subEntry) => {
      const common = getCommonParent(activeElement, subEntry);

      if (common) {
        if (!topCommon || contains(common, topCommon)) {
          topCommon = common;
        } else {
          topCommon = getCommonParent(common, topCommon);
        }
      }
    });
  });

  // TODO: add assert here?
  return topCommon as unknown as Element;
};

/**
 * return list of nodes which are expected to be autofocused inside a given top nodes
 * @param entries
 * @param visibilityCache
 */
export const allParentAutofocusables = (entries: Element[], visibilityCache: VisibilityCache): Element[] =>
  entries.reduce((acc, node) => acc.concat(parentAutofocusables(node, visibilityCache)), [] as Element[]);
