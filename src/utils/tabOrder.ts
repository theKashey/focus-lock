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

const getTabIndex = (node: HTMLElement): number => {
  if (node.tabIndex < 0) {
    // all "focusable" elements are already preselected
    // but some might have implicit negative tabIndex
    // return 0 for <audio without tabIndex attribute - it is "tabbable"
    if (!node.hasAttribute('tabindex')) {
      return 0;
    }
  }

  return node.tabIndex;
};

export const orderByTabIndex = (nodes: HTMLElement[], filterNegative: boolean, keepGuards?: boolean): NodeIndex[] =>
  toArray(nodes)
    .map((node, index): NodeIndex => {
      const tabIndex = getTabIndex(node);

      return {
        node,
        index,
        tabIndex: keepGuards && tabIndex === -1 ? ((node.dataset || {}).focusGuard ? 0 : -1) : tabIndex,
      };
    })
    .filter((data) => !filterNegative || data.tabIndex >= 0)
    .sort(tabSort);
