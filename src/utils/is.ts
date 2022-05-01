import { FOCUS_NO_AUTOFOCUS } from '../constants';

const isElementHidden = (node: Element): boolean => {
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

type CheckParentCallback = (node: Element | undefined) => boolean;

const getParentNode = (node: Element): Element | undefined =>
  // DOCUMENT_FRAGMENT_NODE can also point on ShadowRoot. In this case .host will point on the next node
  node.parentNode && node.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (node.parentNode as any).host
    : node.parentNode;

const isTopNode = (node: Element): boolean =>
  // @ts-ignore
  node === document || (node && node.nodeType === Node.DOCUMENT_NODE);

const isVisibleUncached = (node: Element | undefined, checkParent: CheckParentCallback): boolean =>
  !node || isTopNode(node) || (!isElementHidden(node) && checkParent(getParentNode(node)));

export type VisibilityCache = Map<Element | undefined, boolean>;

export const isVisibleCached = (visibilityCache: VisibilityCache, node: Element | undefined): boolean => {
  const cached = visibilityCache.get(node);

  if (cached !== undefined) {
    return cached;
  }

  const result = isVisibleUncached(node, isVisibleCached.bind(undefined, visibilityCache));
  visibilityCache.set(node, result);

  return result;
};

const isAutoFocusAllowedUncached = (node: Element | undefined, checkParent: CheckParentCallback) =>
  node && !isTopNode(node) ? (isAutoFocusAllowed(node) ? checkParent(getParentNode(node)) : false) : true;

export const isAutoFocusAllowedCached = (cache: VisibilityCache, node: Element | undefined): boolean => {
  const cached = cache.get(node);

  if (cached !== undefined) {
    return cached;
  }

  const result = isAutoFocusAllowedUncached(node, isAutoFocusAllowedCached.bind(undefined, cache));
  cache.set(node, result);

  return result;
};

export const getDataset = (node: Element): HTMLElement['dataset'] | undefined =>
  // @ts-ignore
  node.dataset;

export const isHTMLButtonElement = (node: Element): node is HTMLInputElement => node.tagName === 'BUTTON';
export const isHTMLInputElement = (node: Element): node is HTMLInputElement => node.tagName === 'INPUT';

export const isRadioElement = (node: Element): node is HTMLInputElement =>
  isHTMLInputElement(node) && node.type === 'radio';

export const notHiddenInput = (node: Element): boolean =>
  !((isHTMLInputElement(node) || isHTMLButtonElement(node)) && (node.type === 'hidden' || node.disabled));

export const isAutoFocusAllowed = (node: Element): boolean => {
  const attribute = node.getAttribute(FOCUS_NO_AUTOFOCUS);

  return ![true, 'true', ''].includes(attribute as never);
};

export const isGuard = (node: Element | undefined): boolean => Boolean(node && getDataset(node)?.focusGuard);
export const isNotAGuard = (node: Element | undefined): boolean => !isGuard(node);

export const isDefined = <T>(x: T | null | undefined): x is T => Boolean(x);
