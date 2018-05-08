import getAllAffectedNodes from './utils/all-affected';
import { toArray } from './utils/DOMutils';

const focusInFrame = frame => frame === document.activeElement;

const focusInsideIframe = topNode => (
  getAllAffectedNodes(topNode).reduce(
    (result, node) => result || !!toArray(node.querySelectorAll('iframe')).some(focusInFrame),
    false,
  )
);

const focusInside = topNode => (
  getAllAffectedNodes(topNode).reduce(
    (result, node) => result || node.querySelector('*:focus') || focusInsideIframe(topNode),
    false,
  )
);

export default focusInside;
