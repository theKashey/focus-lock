import { toArray } from './utils/array';
import { FOCUS_ALLOW } from './constants';

/**
 * focus is hidden FROM the focus-lock
 * ie contained inside a node focus-lock shall ignore
 * @returns {boolean}
 */
export const focusIsHidden = () => (
  document && toArray(document.querySelectorAll(`[${FOCUS_ALLOW}]`)).some(node => node.contains(document.activeElement))
);
