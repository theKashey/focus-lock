import * as allConstants from './constants';
import { focusInside } from './focusInside';
import { focusIsHidden } from './focusIsHidden';
import { focusMerge } from './focusMerge';
import { getFocusableIn } from './focusables';
import { setFocus } from './setFocus';
import { focusNextElement, focusPrevElement } from './sibling';
import { getActiveElement } from './utils/getActiveElement';

/**
 * magic symbols to control focus behavior from DOM
 * see description of every particular one
 */
const constants = allConstants;

export {
  constants,
  focusInside,
  focusIsHidden,
  setFocus,
  focusMerge,
  getFocusableIn,
  focusNextElement,
  focusPrevElement,
  getActiveElement,
};

/**
 * @deprecated - please use {@link setFocus} named export
 */
const oldDefaultExport: typeof setFocus = setFocus;

export default oldDefaultExport;
//
