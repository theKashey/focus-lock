import { toArray } from './array';
import { isVisibleCached, notHiddenInput, VisibilityCache } from './is';
import { NodeIndex, orderByTabIndex } from './tabOrder';
import { getFocusables, getParentAutofocusables } from './tabUtils';

export const filterFocusable = (nodes: HTMLElement[], visibilityCache: VisibilityCache): HTMLElement[] =>
  toArray(nodes)
    .filter((node) => isVisibleCached(visibilityCache, node))
    .filter((node) => notHiddenInput(node));

/**
 * only tabbable ones
 * (but with guards which would be ignored)
 */
export const getTabbableNodes = (
  topNodes: Element[],
  visibilityCache: VisibilityCache,
  withGuards?: boolean
): NodeIndex[] =>
  orderByTabIndex(filterFocusable(getFocusables(topNodes, withGuards), visibilityCache), true, withGuards);

/**
 * actually anything "focusable", not only tabbable
 * (without guards, as long as they are not expected to be focused)
 */
export const getAllTabbableNodes = (topNodes: Element[], visibilityCache: VisibilityCache): NodeIndex[] =>
  orderByTabIndex(filterFocusable(getFocusables(topNodes), visibilityCache), false);

export const parentAutofocusables = (topNode: Element, visibilityCache: VisibilityCache): Element[] =>
  filterFocusable(getParentAutofocusables(topNode), visibilityCache);

/*
 * Determines if element is contained in scope, including nested shadow DOMs
 */
export const contains = (scope: Element | ShadowRoot, element: Element): boolean => {
  return (
    ((scope as HTMLElement).shadowRoot
      ? contains((scope as HTMLElement).shadowRoot as ShadowRoot, element)
      : scope.contains(element)) || Array.from(scope.children).some((child) => contains(child, element))
  );
};
