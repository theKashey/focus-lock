import { getAllAffectedNodes } from './utils/all-affected';
import { toArray } from './utils/array';

const focusInFrame = (frame: HTMLIFrameElement) => frame === document.activeElement;

const focusInsideIframe = (topNode: HTMLElement) =>
  Boolean(toArray(topNode.querySelectorAll<HTMLIFrameElement>('iframe')).some((node) => focusInFrame(node)));

export const focusInside = (topNode: HTMLElement | HTMLElement[]): boolean => {
  const activeElement: HTMLElement = document && (document.activeElement as any);

  if (!activeElement || (activeElement.dataset && activeElement.dataset.focusGuard)) {
    return false;
  }
  return getAllAffectedNodes(topNode).reduce(
    (result, node) => result || node.contains(activeElement) || focusInsideIframe(node),
    false as boolean
  );
};
