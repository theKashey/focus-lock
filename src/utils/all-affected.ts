import { FOCUS_DISABLED, FOCUS_GROUP } from '../constants';
import { asArray, toArray } from './array';

/**
 * in case of multiple nodes nested inside each other
 * keeps only top ones
 * this is O(nlogn)
 * @param nodes
 * @returns {*}
 */
const filterNested = <T extends Element>(nodes: T[]): T[] => {
  const contained = new Set();
  const l = nodes.length;

  for (let i = 0; i < l; i += 1) {
    for (let j = i + 1; j < l; j += 1) {
      const position = nodes[i].compareDocumentPosition(nodes[j]);

      /* eslint-disable no-bitwise */
      if ((position & Node.DOCUMENT_POSITION_CONTAINED_BY) > 0) {
        contained.add(j);
      }

      if ((position & Node.DOCUMENT_POSITION_CONTAINS) > 0) {
        contained.add(i);
      }
      /* eslint-enable */
    }
  }

  return nodes.filter((_, index) => !contained.has(index));
};

/**
 * finds top most parent for a node
 * @param node
 * @returns {*}
 */
const getTopParent = (node: Element): Element =>
  node.parentNode ? getTopParent(node.parentNode as HTMLElement) : node;

/**
 * returns all "focus containers" inside a given node
 * @param node - node or nodes to look inside
 * @returns Element[]
 */
export const getAllAffectedNodes = (node: Element | Element[]): Element[] => {
  const nodes = asArray(node);

  return nodes.filter(Boolean).reduce((acc, currentNode) => {
    const group = currentNode.getAttribute(FOCUS_GROUP);

    acc.push(
      ...(group
        ? filterNested(
            toArray(
              getTopParent(currentNode).querySelectorAll<Element>(
                `[${FOCUS_GROUP}="${group}"]:not([${FOCUS_DISABLED}="disabled"])`
              )
            )
          )
        : [currentNode as Element])
    );

    return acc;
  }, [] as Element[]);
};
