import { FOCUS_AUTO } from '../constants';
import { toArray } from './array';
import { tabbables } from './tabbables';

const queryTabbables = tabbables.join(',');
const queryGuardTabbables = `${queryTabbables}, [data-focus-guard]`;

const getFocusablesWithShadowDom = (parent: Element, withGuards?: boolean): HTMLElement[] =>
  toArray(parent.shadowRoot?.children || parent.children).reduce(
    (acc, child) =>
      acc.concat(
        child.matches(withGuards ? queryGuardTabbables : queryTabbables) ? [child as HTMLElement] : [],
        getFocusablesWithShadowDom(child)
      ),
    [] as HTMLElement[]
  );

const getFocusablesWithIFrame = (parent: Element, withGuards?: boolean): HTMLElement[] => {
  if (parent instanceof HTMLIFrameElement && parent.contentDocument) {
    return getFocusables([parent.contentDocument.body], withGuards);
  }

  return [parent] as HTMLElement[];
};

export const getFocusables = (parents: Element[], withGuards?: boolean): HTMLElement[] => {
  return parents.reduce((acc, parent) => {
    const focusableWithShadowDom = getFocusablesWithShadowDom(parent, withGuards);
    const focusableWithIframes = ([] as HTMLElement[]).concat(
      ...focusableWithShadowDom.map((node) => getFocusablesWithIFrame(node, withGuards))
    );

    return acc.concat(
      // add all tabbables inside and within shadow DOMs in DOM order
      focusableWithIframes,
      // add if node is tabbable itself
      parent.parentNode
        ? toArray(parent.parentNode.querySelectorAll<HTMLElement>(queryTabbables)).filter((node) => node === parent)
        : []
    );
  }, [] as HTMLElement[]);
};

/**
 * return a list of focusable nodes within an area marked as "auto-focusable"
 * @param parent
 */
export const getParentAutofocusables = (parent: Element): HTMLElement[] => {
  const parentFocus = parent.querySelectorAll<Element>(`[${FOCUS_AUTO}]`);

  return toArray(parentFocus)
    .map((node) => getFocusables([node]))
    .reduce((acc, nodes) => acc.concat(nodes), []);
};
