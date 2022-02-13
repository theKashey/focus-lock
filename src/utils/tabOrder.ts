import { toArray } from './array';

export interface NodeIndex {
  node: HTMLElement;
  tabIndex: number;
  index: number;
}

export const tabSort = (a: NodeIndex, b: NodeIndex): number => {
  const tabDiff = a.tabIndex - b.tabIndex;
  const indexDiff = a.index - b.index;

  if (tabDiff) {
    if (!a.tabIndex) {
      return 1;
    }

    if (!b.tabIndex) {
      return -1;
    }
  }

  return tabDiff || indexDiff;
};

export const orderByTabIndex = (nodes: HTMLElement[], filterNegative: boolean, keepGuards?: boolean): NodeIndex[] =>
  toArray(nodes)
    .map(
      (node, index): NodeIndex => ({
        node,
        index,
        tabIndex: keepGuards && node.tabIndex === -1 ? ((node.dataset || {}).focusGuard ? 0 : -1) : node.tabIndex,
      })
    )
    .filter((data) => !filterNegative || data.tabIndex >= 0)
    .sort(tabSort);
