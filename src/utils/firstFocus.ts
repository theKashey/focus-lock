import { correctNode } from './correctFocus';

export const pickFirstFocus = (nodes: HTMLInputElement[]) => {
  if (nodes[0] && nodes.length > 1) {
    return correctNode(nodes[0], nodes);
  }
  return nodes[0];
};

export const pickFocusable = (nodes: HTMLInputElement[], index: number) => {
  if (nodes.length > 1) {
    return nodes.indexOf(correctNode(nodes[index], nodes));
  }
  return index;
};
