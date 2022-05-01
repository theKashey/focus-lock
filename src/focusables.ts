import { getTabbableNodes } from './utils/DOMutils';
import { getAllAffectedNodes } from './utils/all-affected';
import { isGuard, isNotAGuard } from './utils/is';
import { getTopCommonParent } from './utils/parenting';

interface FocusableIn {
  node: HTMLElement;
  /**
   * tab index
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
 * return list of focusable elements inside a given top node
 * @deprecated use {@link getFocusableIn}. Yep, there is typo in the function name
 */
export const getFocusabledIn = (topNode: HTMLElement): FocusableIn[] => {
  const entries = getAllAffectedNodes(topNode).filter(isNotAGuard);
  const commonParent = getTopCommonParent(topNode, topNode, entries);
  const visibilityCache = new Map();
  const outerNodes = getTabbableNodes([commonParent], visibilityCache, true);
  const innerElements = getTabbableNodes(entries, visibilityCache)
    .filter(({ node }) => isNotAGuard(node))
    .map(({ node }) => node);

  return outerNodes.map(
    ({ node, index }): FocusableIn => ({
      node,
      index,
      lockItem: innerElements.indexOf(node) >= 0,
      guard: isGuard(node),
    })
  );
};

/**
 * return list of focusable elements inside a given top node
 */
export const getFocusableIn = getFocusabledIn;
