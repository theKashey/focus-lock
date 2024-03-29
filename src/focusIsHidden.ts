import { FOCUS_ALLOW } from './constants';
import { contains } from './utils/DOMutils';
import { toArray } from './utils/array';
import { getActiveElement } from './utils/getActiveElement';

/**
 * checks if focus is hidden FROM the focus-lock
 * ie contained inside a node focus-lock shall ignore
 *
 * This is a utility function coupled with {@link FOCUS_ALLOW} constant
 *
 * @returns {boolean} focus is currently is in "allow" area
 */
export const focusIsHidden = (inDocument: Document = document): boolean => {
  const activeElement = getActiveElement(inDocument);

  if (!activeElement) {
    return false;
  }

  // this does not support setting FOCUS_ALLOW within shadow dom
  return toArray(inDocument.querySelectorAll(`[${FOCUS_ALLOW}]`)).some((node) => contains(node, activeElement));
};
