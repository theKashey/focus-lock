import tabbables from './tabbables';
import { toArray } from './DOMutils';

export const getFocusables = parents => (
  parents.reduce((acc, parent) => acc.concat(toArray(parent.querySelectorAll(tabbables.join(',')))), [])
);

export const getParentAutofocusables = (parent) => {
  const parentFocus = parent.querySelectorAll('[data-autofocus-inside]');
  return toArray(parentFocus)
    .map(node => getFocusables([node]))
    .reduce((acc, nodes) => acc.concat(toArray(nodes)), []);
};
