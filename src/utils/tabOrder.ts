import { toArray } from './array';

export interface NodeIndex {
  node: HTMLElement;
  tabIndex: number;
  index: number;
}

export const tabSort = (a: NodeIndex, b: NodeIndex): number => {
  const aTab = Math.max(0, a.tabIndex);
  const bTab = Math.max(0, b.tabIndex);
  const tabDiff = aTab - bTab;
  const indexDiff = a.index - b.index;

  if (tabDiff) {
    if (!aTab) {
      return 1;
    }

    if (!bTab) {
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
