import getAllAffectedNodes from './utils/all-affected';
import {arrayFind, toArray} from "./utils/array";

const focusInFrame = frame => frame === document.activeElement;

const focusInsideIframe = topNode => (
  getAllAffectedNodes(topNode).reduce(
    (result, node) => result || !!arrayFind(toArray(node.querySelectorAll('iframe')),focusInFrame),
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
