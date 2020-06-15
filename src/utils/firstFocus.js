import { correctNode } from './correctFocus';


const pickFirstFocus = (nodes) => {
  if (nodes[0] && nodes.length > 1) {
    return correctNode(nodes[0], nodes);
  }
  return nodes[0];
};

export const pickFocusable = (nodes, index) => {
  if (nodes.length > 1) {
    return nodes.indexOf(correctNode(nodes[index], nodes));
  }
  return index;
};


export default pickFirstFocus;
