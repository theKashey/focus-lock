import { FOCUS_DISABLED, FOCUS_GROUP } from '../constants';
import { toArray } from './array';

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
  const group = node.getAttribute(FOCUS_GROUP);
  if (group) {
    return filterNested(toArray(getTopParent(node).querySelectorAll(`[${FOCUS_GROUP}="${group}"]:not([${FOCUS_DISABLED}="disabled"])`)));
  }
  return [node];
};

export default getAllAffectedNodes;
