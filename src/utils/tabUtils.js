import tabbables from './tabbables';

export const getFocusables = parent => parent.querySelectorAll(tabbables.join(','));

export const getParentAutofocusables = parent => {
  const parentFocus = parent.querySelectorAll('[data-autofocus-inside]');
  return [...parentFocus]
    .map( node => getFocusables(node))
    .reduce( (acc,nodes) => [...acc,...nodes],[])
}
