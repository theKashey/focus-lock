import { FOCUS_DISABLED, FOCUS_GROUP } from '../constants';
import { asArray, toArray } from './array';

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

const getTopParent = node => (node.parentNode ? getTopParent(node.parentNode) : node);

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
