import tabbables from './tabbables';
import { toArray } from './array';
import { FOCUS_AUTO } from '../constants';

const queryTabbables = tabbables.join(',');
const queryGuardTabbables = `${queryTabbables}, [data-focus-guard]`;

export const getFocusables = (parents, withGuards) => (
  parents.reduce(
    (acc, parent) => (
      acc.concat(
        // add all tabbables inside
        toArray(parent.querySelectorAll(withGuards ? queryGuardTabbables : queryTabbables)),
        // add if node is tabble itself
        parent.parentNode
          ? toArray(parent.parentNode.querySelectorAll(tabbables.join(','))).filter(node => node === parent)
          : [],
      )
    ),
    [],
  )
);

export const getParentAutofocusables = (parent) => {
  const parentFocus = parent.querySelectorAll(`[${FOCUS_AUTO}]`);
  return toArray(parentFocus)
    .map(node => getFocusables([node]))
    .reduce((acc, nodes) => acc.concat(nodes), []);
};
