import getAllAffectedNodes from './utils/all-affected';
import { isGuard, isNotAGuard } from './utils/is';
import { getTopCommonParent } from './utils/parenting';
import { getTabbableNodes } from './utils/DOMutils';

export const getFocusabledIn = (topNode) => {
  const entries = getAllAffectedNodes(topNode).filter(isNotAGuard);
  const commonParent = getTopCommonParent(topNode, topNode, entries);
  const outerNodes = getTabbableNodes([commonParent], true);
  const innerElements = getTabbableNodes(entries)
    .filter(({ node }) => isNotAGuard(node))
    .map(({ node }) => node);

  return outerNodes.map(({ node, index }) => ({
    node,
    index,
    lockItem: innerElements.indexOf(node) >= 0,
    guard: isGuard(node),
  }));
};
