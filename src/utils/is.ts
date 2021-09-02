const isElementHidden = (node: HTMLElement): boolean => {
  // we can measure only "elements"
  // consider others as "visible"
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  const computedStyle: CSSStyleDeclaration = window.getComputedStyle(node, null);
  if (!computedStyle || !computedStyle.getPropertyValue) {
    return false;
  }
  return (
    computedStyle.getPropertyValue('display') === 'none' || computedStyle.getPropertyValue('visibility') === 'hidden'
  );
};

type CheckParentCallback = (node: HTMLElement | undefined) => boolean;

const isVisibleUncached = (node: HTMLElement | undefined, checkParent: CheckParentCallback): boolean =>
  !node ||
  // @ts-ignore
  node === document ||
  (node && node.nodeType === Node.DOCUMENT_NODE) ||
  (!isElementHidden(node) &&
    checkParent(
      // DOCUMENT_FRAGMENT_NODE can also point on ShadowRoot. In this case .host will point on the next node
      node.parentNode && node.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE
        ? (node.parentNode as any).host
        : node.parentNode
    ));

export type VisibilityCache = Map<HTMLElement | undefined, boolean>;

export const isVisibleCached = (visibilityCache: VisibilityCache, node: HTMLElement | undefined): boolean => {
  const cached = visibilityCache.get(node);
  if (cached !== undefined) {
    return cached;
  }
  const result = isVisibleUncached(node, isVisibleCached.bind(undefined, visibilityCache));
  visibilityCache.set(node, result);
  return result;
};

export const notHiddenInput = (node: HTMLInputElement) =>
  !((node.tagName === 'INPUT' || node.tagName === 'BUTTON') && (node.type === 'hidden' || node.disabled));
export const isGuard = (node: HTMLElement): boolean => Boolean(node && node.dataset && node.dataset.focusGuard);
export const isNotAGuard = (node: HTMLElement) => !isGuard(node);

export const isDefined = <T>(x: T | null | undefined): x is T => Boolean(x);
