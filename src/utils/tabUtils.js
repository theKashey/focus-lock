import tabbables from './tabbables';

export const getFocusables = parents => (
  parents.reduce((acc, parent) => [...acc, ...parent.querySelectorAll(tabbables.join(','))], [])
);

export const getParentAutofocusables = (parent) => {
  const parentFocus = parent.querySelectorAll('[data-autofocus-inside]');
  return [...parentFocus]
    .map(node => getFocusables([node]))
    .reduce((acc, nodes) => [...acc, ...nodes], []);
};
