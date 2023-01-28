import { contains } from './utils/DOMutils';
import { getAllAffectedNodes } from './utils/all-affected';
import { getFirst, toArray } from './utils/array';
import { getActiveElement } from './utils/getActiveElement';

const focusInFrame = (frame: HTMLIFrameElement, activeElement: Element | undefined) => frame === activeElement;

const focusInsideIframe = (topNode: Element, activeElement: Element | undefined) =>
  Boolean(
    toArray(topNode.querySelectorAll<HTMLIFrameElement>('iframe')).some((node) => focusInFrame(node, activeElement))
  );

/**
 * @returns {Boolean} true, if the current focus is inside given node or nodes
 */
export const focusInside = (
  topNode: HTMLElement | HTMLElement[],
  activeElement: HTMLElement | undefined = getActiveElement(getFirst(topNode).ownerDocument)
): boolean => {
  // const activeElement = document && getActiveElement();

  if (!activeElement || (activeElement.dataset && activeElement.dataset.focusGuard)) {
    return false;
  }

  return getAllAffectedNodes(topNode).some((node) => {
    return contains(node, activeElement) || focusInsideIframe(node, activeElement);
  });
};
