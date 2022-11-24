import { filterAutoFocusable } from './DOMutils';
import { pickFirstFocus } from './firstFocus';
import { getDataset } from './is';
import { NodeIndex } from './tabOrder';

const findAutoFocused =
  (autoFocusables: Element[]) =>
  (node: Element): boolean => {
    const autofocus = getDataset(node)?.autofocus;

    return (
      // @ts-expect-error
      node.autofocus ||
      //
      (autofocus !== undefined && autofocus !== 'false') ||
      //
      autoFocusables.indexOf(node) >= 0
    );
  };

export const pickAutofocus = (
  nodesIndexes: NodeIndex[],
  orderedNodes: HTMLElement[],
  groups: Element[]
): HTMLElement | undefined => {
  const nodes = nodesIndexes.map(({ node }) => node);

  const autoFocusable = filterAutoFocusable(nodes.filter(findAutoFocused(groups)));

  if (autoFocusable && autoFocusable.length) {
    return pickFirstFocus(autoFocusable);
  }

  return pickFirstFocus(filterAutoFocusable(orderedNodes));
};
