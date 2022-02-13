import { FOCUS_ALLOW } from './constants';
import { toArray } from './utils/array';
import { getActiveElement } from './utils/getActiveElement';

/**
 * focus is hidden FROM the focus-lock
 * ie contained inside a node focus-lock shall ignore
 * @returns {boolean}
 */
export const focusIsHidden = (): boolean => {
  const activeElement = document && getActiveElement();

  if (!activeElement) {
    return false;
  }

  return toArray(document.querySelectorAll(`[${FOCUS_ALLOW}]`)).some((node) => node.contains(activeElement));
};
