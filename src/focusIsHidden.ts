import { FOCUS_ALLOW } from './constants';
import { toArray } from './utils/array';

/**
 * focus is hidden FROM the focus-lock
 * ie contained inside a node focus-lock shall ignore
 * @returns {boolean}
 */
export const focusIsHidden = () =>
  document &&
  toArray(document.querySelectorAll(`[${FOCUS_ALLOW}]`)).some((node) => node.contains(document.activeElement));
