import { FOCUS_DISABLED, FOCUS_GROUP } from '../constants';
import { asArray, toArray } from './array';

/**
 * in case of multiple nodes nested inside each other
 * keeps only top ones
 * @param nodes
 * @returns {*}
 */
const filterNested = (nodes) => {
  const l = nodes.length;
  for (let i = 0; i < l; i += 1) {
    for (let j = 0; j < l; j += 1) {
      if (i !== j) {
        if (nodes[i].contains(nodes[j])) {
          return filterNested(nodes.filter(x => x !== nodes[j]));
        }
      }
    }
  }
  return nodes;
};

/**
 * finds top most parent for a node
 * @param node
 * @returns {*}
 */
const getTopParent = node => (node.parentNode ? getTopParent(node.parentNode) : node);

/**
 * returns all "focus containers" inside a given node
 * @param node
 * @returns {T}
 */
const getAllAffectedNodes = (node) => {
  const nodes = asArray(node);
  return nodes.filter(Boolean).reduce((acc, currentNode) => {
    const group = currentNode.getAttribute(FOCUS_GROUP);
    acc.push(
      ...group
        ? filterNested(toArray(
          getTopParent(currentNode).querySelectorAll(`[${FOCUS_GROUP}="${group}"]:not([${FOCUS_DISABLED}="disabled"])`),
        ))
        : [currentNode],
    );
    return acc;
  }, []);
};

export default getAllAffectedNodes;
