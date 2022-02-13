import { FOCUS_AUTO } from '../constants';
import { toArray } from './array';
import { tabbables } from './tabbables';

const queryTabbables = tabbables.join(',');
const queryGuardTabbables = `${queryTabbables}, [data-focus-guard]`;

export const getFocusables = (parents: Element[], withGuards?: boolean): HTMLElement[] =>
  parents.reduce(
    (acc, parent) =>
      acc.concat(
        // add all tabbables inside
        toArray(parent.querySelectorAll(withGuards ? queryGuardTabbables : queryTabbables)),
        // add if node is tabbale itself
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
