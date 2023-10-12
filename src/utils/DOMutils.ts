import { toArray } from './array';
import { isAutoFocusAllowedCached, isVisibleCached, notHiddenInput, VisibilityCache } from './is';
import { NodeIndex, orderByTabIndex } from './tabOrder';
import { getFocusables, getParentAutofocusables } from './tabUtils';

/**
 * given list of focusable elements keeps the ones user can interact with
 * @param nodes
 * @param visibilityCache
 */
export const filterFocusable = (nodes: HTMLElement[], visibilityCache: VisibilityCache): HTMLElement[] =>
  toArray(nodes)
    .filter((node) => isVisibleCached(visibilityCache, node))
    .filter((node) => notHiddenInput(node));

export const filterAutoFocusable = (nodes: HTMLElement[], cache: VisibilityCache = new Map()): HTMLElement[] =>
  toArray(nodes).filter((node) => isAutoFocusAllowedCached(cache, node));

/**
 * !__WARNING__! Low level API.
 * @returns all tabbable nodes
 *
 * @see {@link getFocusableNodes} to get any focusable element
 *
 * @param topNodes - array of top level HTMLElements to search inside
 * @param visibilityCache - an cache to store intermediate measurements. Expected to be a fresh `new Map` on every call
 */
export const getTabbableNodes = (
  topNodes: Element[],
  visibilityCache: VisibilityCache,
  withGuards?: boolean
): NodeIndex[] =>
  orderByTabIndex(filterFocusable(getFocusables(topNodes, withGuards), visibilityCache), true, withGuards);

/**
 * !__WARNING__! Low level API.
 *
 * @returns anything "focusable", not only tabbable. The difference is in `tabIndex=-1`
 * (without guards, as long as they are not expected to be ever focused)
 *
 * @see {@link getTabbableNodes} to get only tabble nodes element
 *
 * @param topNodes - array of top level HTMLElements to search inside
 * @param visibilityCache - an cache to store intermediate measurements. Expected to be a fresh `new Map` on every call
 */
export const getFocusableNodes = (topNodes: Element[], visibilityCache: VisibilityCache): NodeIndex[] =>
  orderByTabIndex(filterFocusable(getFocusables(topNodes), visibilityCache), false);

/**
 * return list of nodes which are expected to be auto-focused
 * @param topNode
 * @param visibilityCache
 */
export const parentAutofocusables = (topNode: Element, visibilityCache: VisibilityCache): Element[] =>
  filterFocusable(getParentAutofocusables(topNode), visibilityCache);

/*
 * Determines if element is contained in scope, including nested shadow DOMs
 */
export const contains = (scope: Element | ShadowRoot, element: Element): boolean => {
  if ((scope as HTMLElement).shadowRoot) {
    return contains((scope as HTMLElement).shadowRoot as ShadowRoot, element);
  } else {
    if (
      Object.getPrototypeOf(scope).contains !== undefined &&
      Object.getPrototypeOf(scope).contains.call(scope, element)
    ) {
      return true;
    }

    return toArray(scope.children).some((child) => {
      if (child instanceof HTMLIFrameElement) {
        const iframeBody = (child as HTMLIFrameElement).contentDocument?.body;

        if (iframeBody) {
          return contains(iframeBody, element);
        }

        return false;
      }

      return contains(child, element);
    });
  }
};
