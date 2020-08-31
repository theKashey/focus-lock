import { toArray } from './array';
import { isVisible, notHiddenInput } from './is';
import { NodeIndex, orderByTabIndex } from './tabOrder';
import { getFocusables, getParentAutofocusables } from './tabUtils';

export const filterFocusable = (nodes: HTMLInputElement[]): HTMLInputElement[] =>
  toArray(nodes)
    .filter((node) => isVisible(node))
    .filter((node) => notHiddenInput(node));

/**
 * only tabbable ones
 * (but with guards which would be ignored)
 */
export const getTabbableNodes = (topNodes: HTMLElement[], withGuards?: boolean): NodeIndex[] =>
  orderByTabIndex(filterFocusable(getFocusables(topNodes, withGuards)), true, withGuards);

/**
 * actually anything "focusable", not only tabbable
 * (without guards, as long as they are not expected to be focused)
 */
export const getAllTabbableNodes = (topNodes: HTMLElement[]) =>
  orderByTabIndex(filterFocusable(getFocusables(topNodes)), false);

export const parentAutofocusables = (topNode: HTMLElement): HTMLInputElement[] =>
  filterFocusable(getParentAutofocusables(topNode));
