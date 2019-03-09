import getAllAffectedNodes from './utils/all-affected';
import { arrayFind, toArray } from './utils/array';

const focusInFrame = frame => frame === document.activeElement;

const focusInsideIframe = topNode => !!arrayFind(toArray(topNode.querySelectorAll('iframe')), focusInFrame);

const focusInside = (topNode) => {
  const activeElement = document && document.activeElement;

  if (!activeElement || (activeElement.dataset && activeElement.dataset.focusGuard)) {
    return false;
  }
  return getAllAffectedNodes(topNode)
    .reduce(
      (result, node) => result || node.contains(activeElement) || focusInsideIframe(node),
      false,
    );
};

export default focusInside;
