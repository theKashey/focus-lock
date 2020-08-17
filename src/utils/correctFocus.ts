const isRadio = (node: HTMLInputElement): node is HTMLInputElement => node.tagName === 'INPUT' && node.type === 'radio';

const findSelectedRadio = (node: HTMLInputElement, nodes: HTMLInputElement[]) =>
  nodes
    .filter(isRadio)
    .filter((el) => el.name === node.name)
    .filter((el) => el.checked)[0] || node;

export const correctNode = (node: HTMLInputElement, nodes: HTMLInputElement[]) => {
  if (isRadio(node) && node.name) {
    return findSelectedRadio(node, nodes);
  }
  return node;
};

/**
 * giving a set of radio inputs keeps only selected (tabbable) ones
 * @param nodes
 */
export const correctNodes = (nodes: HTMLInputElement[]) => {
  // IE11 has no Set(array) constructor
  const resultSet = new Set();
  nodes.forEach((node) => resultSet.add(correctNode(node, nodes)));
  // using filter to support IE11
  return nodes.filter((node) => resultSet.has(node));
};
