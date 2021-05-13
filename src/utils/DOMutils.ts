import { toArray } from './array';
import { isVisibleCached, notHiddenInput, VisibilityCache } from './is';
import { NodeIndex, orderByTabIndex } from './tabOrder';
import { getFocusables, getParentAutofocusables } from './tabUtils';

export const filterFocusable = (nodes: HTMLInputElement[], visibilityCache: VisibilityCache): HTMLInputElement[] =>
  toArray(nodes)
    .filter((node) => isVisibleCached(visibilityCache, node))
    .filter((node) => notHiddenInput(node));

/**
 * only tabbable ones
 * (but with guards which would be ignored)
 */
export const getTabbableNodes = (
  topNodes: HTMLElement[],
  visibilityCache: VisibilityCache,
  withGuards?: boolean
): NodeIndex[] =>
  orderByTabIndex(filterFocusable(getFocusables(topNodes, withGuards), visibilityCache), true, withGuards);

/**
 * actually anything "focusable", not only tabbable
 * (without guards, as long as they are not expected to be focused)
 */
export const getAllTabbableNodes = (topNodes: HTMLElement[], visibilityCache: VisibilityCache) =>
  orderByTabIndex(filterFocusable(getFocusables(topNodes), visibilityCache), false);

export const parentAutofocusables = (topNode: HTMLElement, visibilityCache: VisibilityCache): HTMLInputElement[] =>
  filterFocusable(getParentAutofocusables(topNode), visibilityCache);
