import { asArray } from './array';
import { parentAutofocusables } from './DOMutils';

const getParents = (node: HTMLElement, parents: HTMLElement[] = []): HTMLElement[] => {
  parents.push(node);
  if (node.parentNode) {
    getParents(node.parentNode as HTMLElement, parents);
  }
  return parents;
};
/**
 * finds a parent for both nodeA and nodeB
 * @param nodeA
 * @param nodeB
 * @returns {boolean|*}
 */
export const getCommonParent = (nodeA: HTMLElement, nodeB: HTMLElement) => {
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
  baseActiveElement: HTMLElement,
  leftEntry: HTMLElement | HTMLElement[],
  rightEntries: HTMLElement[]
): HTMLElement => {
  const activeElements = asArray(baseActiveElement);
  const leftEntries = asArray(leftEntry);
  const activeElement = activeElements[0];
  let topCommon: HTMLElement | false = false;

  leftEntries.filter(Boolean).forEach((entry) => {
    topCommon = getCommonParent(topCommon || entry, entry) || topCommon;
    rightEntries.filter(Boolean).forEach((subEntry) => {
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

  // TODO: add assert here?
  return (topCommon as unknown) as HTMLInputElement;
};
export const allParentAutofocusables = (entries: HTMLElement[]): HTMLInputElement[] =>
  entries.reduce((acc, node) => acc.concat(parentAutofocusables(node)), [] as HTMLInputElement[]);
