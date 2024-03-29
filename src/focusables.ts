import { getAllAffectedNodes } from './utils/all-affected';
import { isGuard, isNotAGuard } from './utils/is';
import { getTopCommonParent } from './utils/parenting';
import { orderByTabIndex } from './utils/tabOrder';
import { getFocusables } from './utils/tabUtils';

interface FocusableNode {
  node: HTMLElement;
  /**
   * index in the tab order
   */
  index: number;
  /**
   * true, if this node belongs to a Lock
   */
  lockItem: boolean;
  /**
   * true, if this node is a focus-guard (system node)
   */
  guard: boolean;
}

/**
 * traverses all related nodes (including groups) returning a list of all nodes(outer and internal) with meta information
 * This is low-level API!
 * @returns list of focusable elements inside a given top(!) node.
 * @see {@link getFocusableNodes} providing a simpler API
 */
export const expandFocusableNodes = (topNode: HTMLElement | HTMLElement[]): FocusableNode[] => {
  const entries = getAllAffectedNodes(topNode).filter(isNotAGuard);
  const commonParent = getTopCommonParent(topNode, topNode, entries);
  const outerNodes = orderByTabIndex(getFocusables([commonParent], true), true, true);
  const innerElements = getFocusables(entries, false);

  return outerNodes.map(
    ({ node, index }): FocusableNode => ({
      node,
      index,
      lockItem: innerElements.indexOf(node) >= 0,
      guard: isGuard(node),
    })
  );
};
