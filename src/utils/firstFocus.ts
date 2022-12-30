import { correctNode } from './correctFocus';

export const pickFirstFocus = (nodes: HTMLElement[]): HTMLElement | undefined => {
  if (nodes[0] && nodes.length > 1) {
    return correctNode(nodes[0], nodes);
  }

  return nodes[0];
};

export const pickFocusable = (nodes: HTMLElement[], index: number): number => {
  if (nodes.length > 1) {
    return nodes.indexOf(correctNode(nodes[index], nodes));
  }

  return index;
};
