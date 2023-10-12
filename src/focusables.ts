import { getTabbableNodes } from './utils/DOMutils';
import { getAllAffectedNodes } from './utils/all-affected';
import { isGuard, isNotAGuard } from './utils/is';
import { getTopCommonParent } from './utils/parenting';

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
 * @returns list of focusable elements inside a given top node
 * @see {@link getFocusableNodes} for lower level access
 */
export const expandFocusableNodes = (topNode: HTMLElement): FocusableNode[] => {
  const entries = getAllAffectedNodes(topNode).filter(isNotAGuard);
  const commonParent = getTopCommonParent(topNode, topNode, entries);
  const visibilityCache = new Map();
  const outerNodes = getTabbableNodes([commonParent], visibilityCache, true);
  const innerElements = getTabbableNodes(entries, visibilityCache)
    .filter(({ node }) => isNotAGuard(node))
    .map(({ node }) => node);

  return outerNodes.map(
    ({ node, index }): FocusableNode => ({
      node,
      index,
      lockItem: innerElements.indexOf(node) >= 0,
      guard: isGuard(node),
    })
  );
};
