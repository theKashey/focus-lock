import getAllAffectedNodes from './utils/all-affected';
import { arrayFind, toArray } from './utils/array';

const focusInFrame = frame => frame === document.activeElement;

const focusInsideIframe = topNode => (
  getAllAffectedNodes(topNode).reduce(
    (result, node) => result || !!arrayFind(toArray(node.querySelectorAll('iframe')), focusInFrame),
    false,
  )
);

const focusInside = (topNode) => {
  const activeElement = document && document.activeElement;

  if (!activeElement || activeElement.dataset.focusGuard) {
    return false;
  }
  return getAllAffectedNodes(topNode).reduce(
    (result, node) => result || node.contains(activeElement) || focusInsideIframe(topNode),
    false,
  );
};

export default focusInside;
