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

export const getFocusables = (parents: Element[], withGuards?: boolean): HTMLElement[] =>
  parents.reduce(
    (acc, parent) =>
      acc.concat(
        // add all tabbables inside and within shadow DOMs in DOM order
        getFocusablesWithShadowDom(parent, withGuards),
        // add if node is tabbable itself
        parent.parentNode
          ? toArray(parent.parentNode.querySelectorAll<HTMLElement>(queryTabbables)).filter((node) => node === parent)
          : []
      ),
    [] as HTMLElement[]
  );

export const getParentAutofocusables = (parent: Element): HTMLElement[] => {
  const parentFocus = parent.querySelectorAll<Element>(`[${FOCUS_AUTO}]`);

  return toArray(parentFocus)
    .map((node) => getFocusables([node]))
    .reduce((acc, nodes) => acc.concat(nodes), []);
};
