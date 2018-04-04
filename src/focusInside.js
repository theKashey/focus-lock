import getAllAffectedNodes from './utils/all-affected';

const focusInFrame = frame => frame === document.activeElement;

const focusInsideIframe = topNode => (
  getAllAffectedNodes(topNode).reduce(
    (result, node) => result || !![...node.querySelectorAll('iframe')].find(focusInFrame),
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
