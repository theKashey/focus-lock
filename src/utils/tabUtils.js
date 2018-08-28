import tabbables from './tabbables';
import { toArray } from './array';
import { FOCUS_AUTO } from '../constants';

export const getFocusables = parents => (
  parents.reduce((acc, parent) => acc.concat(toArray(parent.querySelectorAll(tabbables.join(',')))), [])
);

export const getParentAutofocusables = (parent) => {
  const parentFocus = parent.querySelectorAll(`[${FOCUS_AUTO}]`);
  return toArray(parentFocus)
    .map(node => getFocusables([node]))
    .reduce((acc, nodes) => acc.concat(nodes), []);
};
