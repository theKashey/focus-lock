import { orderByTabIndex } from './tabOrder';
import { getFocusables, getParentAutofocusables } from './tabUtils';
import { toArray } from './array';
import { isVisible, notHiddenInput } from './is';

export const filterFocusable = nodes =>
  toArray(nodes)
    .filter(node => isVisible(node))
    .filter(node => notHiddenInput(node))
;

/**
 * only tabbable ones
 * (but with guards which would be ignored)
 */
export const getTabbableNodes = (topNodes, withGuards) => (
  orderByTabIndex(filterFocusable(getFocusables(topNodes, withGuards)), true, withGuards)
);

/**
 * actually anything "focusable", not only tabbable
 * (without guards, as long as they are not expected to be focused)
 */
export const getAllTabbableNodes = topNodes => (
  orderByTabIndex(filterFocusable(getFocusables(topNodes)), false)
);

export const parentAutofocusables = topNode =>
  filterFocusable(getParentAutofocusables(topNode));
