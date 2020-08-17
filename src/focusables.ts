import { getAllAffectedNodes } from './utils/all-affected';
import { getTabbableNodes } from './utils/DOMutils';
import { isGuard, isNotAGuard } from './utils/is';
import { getTopCommonParent } from './utils/parenting';

interface FocusableIn {
  node: HTMLElement;
  index: number;
  lockItem: boolean;
  guard: boolean;
}

export const getFocusabledIn = (topNode: HTMLElement) => {
  const entries = getAllAffectedNodes(topNode).filter(isNotAGuard);
  const commonParent = getTopCommonParent(topNode, topNode, entries);
  const outerNodes = getTabbableNodes([commonParent], true);
  const innerElements = getTabbableNodes(entries)
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
